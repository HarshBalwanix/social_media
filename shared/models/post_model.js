const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    media_url: {
      type: String,
      required: false,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
