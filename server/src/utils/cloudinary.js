import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env variables are loaded regardless of import order
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const configureCloudinary = () => {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
};

// Initial config
configureCloudinary();

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    if (!localFilePath) return null;

    // Refresh config in case env was loaded after module evaluation
    configureCloudinary();

    let response;
    try {
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: resourceType,
      });
    } catch (initialError) {
      console.warn("Primary Cloudinary upload failed, trying fallback:", initialError?.message || initialError);
      const fallbackType = resourceType === "auto" ? "raw" : "auto";
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: fallbackType,
      });
    }

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Fatal Error:", error?.message || error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = "auto") => {
  try {
    if (!publicId) return null;

    configureCloudinary();

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
