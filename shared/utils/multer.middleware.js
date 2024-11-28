const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./post_app/services/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


module.exports = {
  upload: multer({
    storage,
  }),
};
