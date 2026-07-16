const multer = require("multer");

// Store file in memory
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",

  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",

  // Documents
  "application/pdf",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",

  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",

  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",

  // Archives
  "application/zip",
  "application/x-zip-compressed",

  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/x-m4a",
];

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },

  fileFilter(req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
});

module.exports = upload;