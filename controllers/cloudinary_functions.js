import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import busboy from "busboy";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

//  stream and upload files to cloudinary
export const streamAndUpload = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return res.status(400).send({ error: "Unsupported content type" });
    }

    const bb = busboy({ headers: req.headers });

    bb.on("file", (name, stream, info) => {
      const { filename, mimeType } = info;
      console.log(`Uploading file: ${filename} with type: ${mimeType}`);
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "uploaded_files",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.log(error);
            return res.status(400).json({ error: "File not uploaded" });
          }
          console.log("result : ", result);
          return res.status(200).json({ url: result.secure_url });
        }
      );

      stream.pipe(uploadStream);
    });

    bb.on("finish", () => {
      console.log("file uploaded ");
    });

    req.pipe(bb);
  } catch (e) {
    console.log("error : ", e);
    return res.status(400).json({ error: "Cannot upload file" });
  }
};

// delete a file from cloudinary
export const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ error: "Bad request" });
    const result = await cloudinary.uploader.destroy(publicId);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "cannot delete file" });
  }
};
