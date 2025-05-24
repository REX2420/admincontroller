"use server";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET as string,
});

// fetch all website banners for admin
export const fetchAllWebsiteBanners = async () => {
  try {
    const result = await cloudinary.api.resources_by_tag("website_banners", {
      type: "upload",
      max_results: 100,
    });
    return result.resources;
  } catch (error: any) {
    console.log("Error fetching website banners", error);
    throw new Error(`Failed to fetch website banners: ${error.message}`);
  }
};

export const uploadWebsiteBannerImages = async (images: any) => {
  try {
    // Validate environment variables
    if (!process.env.CLOUDINARY_NAME) {
      throw new Error("CLOUDINARY_NAME environment variable is not set");
    }

    const base64ToBuffer = (base64: any): any => {
      const base64String = base64.split(";base64,").pop();
      return Buffer.from(base64String, "base64");
    };

    const imageUploadPromises = images.map(async (base64Image: any, index: number) => {
      try {
        const buffer = base64ToBuffer(base64Image);
        const formData = new FormData();
        
        // Detect image type from base64 data
        const imageType = base64Image.split(";")[0].split("/")[1] || "jpeg";
        formData.append("file", new Blob([buffer], { type: `image/${imageType}` }));

        // Use the upload preset associated with your Cloudinary setup
        formData.append("upload_preset", "website");

        // Add a tag to categorize images as belonging to "website_banners"
        formData.append("tags", "website_banners");

        // Generate unique public_id with timestamp and random string
        const uniqueId = `website_banner_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        formData.append("public_id", uniqueId);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        
        // Check if upload was successful
        if (result.error) {
          throw new Error(`Cloudinary error: ${result.error.message}`);
        }

        return result;
      } catch (error: any) {
        console.error(`Error uploading image ${index + 1}:`, error);
        throw error;
      }
    });

    const uploadedImages = await Promise.all(imageUploadPromises);

    const imageUrls = uploadedImages.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
      tags: img.tags,
    }));

    return {
      success: true,
      imageUrls,
      message: `Successfully uploaded ${imageUrls.length} images`,
    };
  } catch (error: any) {
    console.error("Error in uploadWebsiteBannerImages:", error);
    return {
      success: false,
      error: error.message,
      imageUrls: [],
    };
  }
};

// fetch all app banners for admin
export const fetchAllAppBanners = async () => {
  try {
    const result = await cloudinary.api.resources_by_tag("app_banners", {
      type: "upload",
      max_results: 100,
    });
    return result.resources;
  } catch (error: any) {
    console.log("Error fetching app banners", error);
    throw new Error(`Failed to fetch app banners: ${error.message}`);
  }
};

export const uploadAppBannerImages = async (images: any) => {
  try {
    // Validate environment variables
    if (!process.env.CLOUDINARY_NAME) {
      throw new Error("CLOUDINARY_NAME environment variable is not set");
    }

    const base64ToBuffer = (base64: any): any => {
      const base64String = base64.split(";base64,").pop();
      return Buffer.from(base64String, "base64");
    };

    const imageUploadPromises = images.map(async (base64Image: any, index: number) => {
      try {
        const buffer = base64ToBuffer(base64Image);
        const formData = new FormData();
        
        // Detect image type from base64 data
        const imageType = base64Image.split(";")[0].split("/")[1] || "jpeg";
        formData.append("file", new Blob([buffer], { type: `image/${imageType}` }));

        // Use the upload preset associated with your Cloudinary setup
        formData.append("upload_preset", "website");

        // Add a tag to categorize images as belonging to "app_banners"
        formData.append("tags", "app_banners");

        // Generate unique public_id with timestamp and random string
        const uniqueId = `app_banner_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        formData.append("public_id", uniqueId);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        
        // Check if upload was successful
        if (result.error) {
          throw new Error(`Cloudinary error: ${result.error.message}`);
        }

        return result;
      } catch (error: any) {
        console.error(`Error uploading image ${index + 1}:`, error);
        throw error;
      }
    });

    const uploadedImages = await Promise.all(imageUploadPromises);

    const imageUrls = uploadedImages.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
      tags: img.tags,
    }));

    return {
      success: true,
      imageUrls,
      message: `Successfully uploaded ${imageUrls.length} images`,
    };
  } catch (error: any) {
    console.error("Error in uploadAppBannerImages:", error);
    return {
      success: false,
      error: error.message,
      imageUrls: [],
    };
  }
};

// for both website and app
export const deleteAnyBannerId = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result == "ok") {
      return {
        success: true,
        message: "Successfully deleted image.",
      };
    } else {
      return {
        success: false,
        message: result.result,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};
