const multer = require("multer");
const path = require('path')
const config = require('../utility/environment')

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, config.environment.fileuploadtemppath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
        + path.extname(file.originalname))
      },
    
    
});

const fileFilter = (req, file, cb) => {

    const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/*",
      ];
    
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        return cb(new Error("Invalid file type."), false );
      }

}

const maxSize = 5 * 1024 * 1024;

const fileLimits = {
  fileSize: maxSize,
  files: 4,
  fileSize: maxSize
}

const upload  = multer({ storage: storage, fileFilter: fileFilter, limits: fileLimits });

module.exports = {
  upload
 }