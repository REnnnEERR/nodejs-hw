import multer from "multer";


export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {

      return callback(new Error("invalid file type!!! Expected image"));
    };


    callback(null, true);
  }
});
