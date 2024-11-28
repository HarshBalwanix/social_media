const jwt = require("jsonwebtoken");
const ApiError = require("./apiError");
const asyncHandler = require("./asyncHandler");
const User = require("../models/user_model");
const cookieParser = require("cookie-parser");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorised request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Invalid access token in error catch box"
    );
  }
});

module.exports = { verifyJWT };
