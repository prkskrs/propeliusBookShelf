import fs from "fs";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = path.join(
      new URL("../coverImage", import.meta.url).pathname,
      "../coverImage"
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, (file.originalname = Date.now() + file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only svg .png, .jpg and .jpeg format allowed!"));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
    fileSize: 15 * 1024 * 1024, // 5MB limit
  },
});

const fileUpload = async (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.json("something went wrong");
    }
    next();
  });
};

export default upload;
