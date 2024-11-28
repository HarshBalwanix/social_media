const Post = require("../../shared/models/post_model");
const ApiError = require("../../shared/utils/apiError");
const ApiResponse = require("../../shared/utils/apiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");
const jwt = require("jsonwebtoken");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../../shared/utils/cloudinary");
const fs = require("fs");
const User = require("../../shared/models/user_model");

const createPost = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Login to post");
  }

  const { content } = req.body;
  const mediaLocalPath = await req.files?.media_url[0].path;
  if (!mediaLocalPath) {
    throw new ApiError(400, "Media file is required in local");
  }

  const media_url = await uploadOnCloudinary(mediaLocalPath);

  if (!media_url) {
    throw new ApiError(400, "Media file is required");
  }

  // create new post
  const createdPost = await Post.create({
    content,
    media_url: media_url.url,
    user_id: req.user._id,
  });

  // remove the locally saved temp file
  //   fs.unlink;

  if (!createdPost) {
    throw new ApiError(500, "Something went wrong while creating post");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdPost, "Post created successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("user_id", "username");

  if (!posts) {
    throw new ApiError(404, "No posts found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  console.log(postId);

  const post = await Post.findById(postId).populate("user_id", "username");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post retrieved successfully"));
});

const updatePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.content = content || post.content;

  const updatedPost = await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

const deletePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Delete media from Cloudinary
  await deleteFromCloudinary(post.media_url);

  // Delete post from database
  await post.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const getMediaFromPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { media_url: post.media_url },
        "Media retrieved successfully"
      )
    );
});

const serveMediaFile = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const mediaUrl = post.media_url;

  // Assuming mediaUrl is a direct link to the media file
  return res.redirect(mediaUrl);
});

const cropMedia = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { cropOptions } = req.body; // Assuming cropOptions contains the necessary cropping parameters

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const mediaUrl = post.media_url;

  // Assuming you have a function to crop media on Cloudinary
  const croppedMediaUrl = await cropMediaOnCloudinary(mediaUrl, cropOptions);

  if (!croppedMediaUrl) {
    throw new ApiError(500, "Failed to crop media");
  }

  post.media_url = croppedMediaUrl;
  const updatedPost = await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Media cropped successfully"));
});

const convertMediaToGreyscale = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const mediaUrl = post.media_url;

  // Assuming you have a function to convert media to greyscale on Cloudinary
  const greyscaleMediaUrl = await convertToGreyscaleOnCloudinary(mediaUrl);

  if (!greyscaleMediaUrl) {
    throw new ApiError(500, "Failed to convert media to greyscale");
  }

  post.media_url = greyscaleMediaUrl;
  const updatedPost = await post.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPost,
        "Media converted to greyscale successfully"
      )
    );
});

const adjustMediaBrightness = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { brightness } = req.body; // Assuming brightness is a value between -100 and 100

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const mediaUrl = post.media_url;

  // Assuming you have a function to adjust brightness on Cloudinary
  const adjustedMediaUrl = await adjustBrightnessOnCloudinary(
    mediaUrl,
    brightness
  );

  if (!adjustedMediaUrl) {
    throw new ApiError(500, "Failed to adjust media brightness");
  }

  post.media_url = adjustedMediaUrl;
  const updatedPost = await post.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPost,
        "Media brightness adjusted successfully"
      )
    );
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getMediaFromPost,
  serveMediaFile,
  cropMedia,
  convertMediaToGreyscale,
  adjustMediaBrightness,
};
