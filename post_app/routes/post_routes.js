const express = require("express");

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getMediaFromPost,
  convertMediaToGreyscale,
  serveMediaFile,
  cropMedia,
  adjustMediaBrightness,
} = require("../controllers/post_controller");
const { upload } = require("../../shared/utils/multer.middleware");
const { verifyJWT } = require("../../shared/utils/auth.middleware");

const router = express.Router();
router.use(verifyJWT);

//posts routes
router.post(
  "/posts",
  upload.fields([{ name: "media_url", maxCount: 1 }]),
  createPost
);
router.get("/posts", getAllPosts);
router.get("/posts/:postId", getPostById);
router.get("/post/:media", getMediaFromPost);
router.get("/uploads/media/:postId", serveMediaFile);
router.put("/post/media/crop/:postId", cropMedia);
router.put("post/media/greyscale/:postId", convertMediaToGreyscale);
router.put("post/media/brightness/:postId", adjustMediaBrightness);
router.put("/posts/:postId", updatePostById);
router.delete("/posts/:postId", deletePostById);

module.exports = router;
