const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Decide Cloudinary resource type
    let resourceType = "image";

    if (req.file.mimetype.startsWith("video/")) {
      resourceType = "video";
    } else if (req.file.mimetype.startsWith("audio/")) {
      resourceType = "video"; // Cloudinary stores audio as video
    } else if (
      !req.file.mimetype.startsWith("image/")
    ) {
      resourceType = "raw";
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "ourspace",
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            resolve(result);
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });
    };

    const result = await streamUpload();

    res.json({
      url: result.secure_url,
      resourceType,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};