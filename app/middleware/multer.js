const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Set the upload directory directly
const uploadDir = path.join(__dirname, '../../uploads');

// ✅ Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

// ✅ File filter for both images and bulk CSV
const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  const csvTypes = ["text/csv", "application/vnd.ms-excel"];

  if (file.fieldname === 'file') {
    // Bulk CSV file
    if (csvTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only CSV files are allowed for bulk upload."), false);
    }
  } else {
    // Images
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only image files are allowed."), false);
    }
  }
};

const maxSize = 5 * 1024 * 1024;

const fileLimits = {
  fileSize: maxSize,
  files: 4,
};

const upload = multer({
  storage,
  fileFilter,
  limits: fileLimits
});

module.exports = {
  upload
};
