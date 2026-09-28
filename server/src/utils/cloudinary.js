import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error?.message || error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = "auto") => {
  try {
    if (!publicId) return null;

    let targetType = resourceType === "auto" ? "image" : resourceType;
    let response = await cloudinary.uploader.destroy(publicId, {
      resource_type: targetType,
    });

    if (!response || response.result === "not found") {
      const altType = targetType === "image" ? "raw" : "image";
      response = await cloudinary.uploader.destroy(publicId, {
        resource_type: altType,
      });
    }

    return response;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error?.message || error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
