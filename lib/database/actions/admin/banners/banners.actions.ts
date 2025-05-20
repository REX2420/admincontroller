"use server";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUNDINARY_API_KEY as string,
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
  }
};

export const uploadWebsiteBannerImages = async (images: any) => {
  const base64ToBuffer = (base64: any): any => {
    const base64String = base64.split(";base64,").pop();
    return Buffer.from(base64String, "base64");
  };
  const imageUploadPromises = images.map(async (base64Image: any) => {
    const buffer = base64ToBuffer(base64Image);
    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: "image/jpeg" }));

    // Use the upload preset associated with your Cloudinary setup
    formData.append("upload_preset", "website");

    // Add a tag to categorize images as belonging to "website_banners"
    formData.append("tags", "website_banners");

    // Optionally add a unique identifier for the public_id
    formData.append("public_id", `${Date.now()}`);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dtxh3ew7s/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    return response.json();
  });

  const uploadedImages = await Promise.all(imageUploadPromises);

  const imageUrls = uploadedImages.map((img) => ({
    url: img.secure_url,
    public_id: img.public_id,
    tags: img.tags,
  }));
  return {
    imageUrls,
  };
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
  }
};

export const uploadAppBannerImages = async (images: any) => {
  const base64ToBuffer = (base64: any): any => {
    const base64String = base64.split(";base64,").pop();
    return Buffer.from(base64String, "base64");
  };
  const imageUploadPromises = images.map(async (base64Image: any) => {
    const buffer = base64ToBuffer(base64Image);
    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: "image/jpeg" }));

    // Use the upload preset associated with your Cloudinary setup
    formData.append("upload_preset", "website");

    // Add a tag to categorize images as belonging to "app_banners"
    formData.append("tags", "app_banners");

    // Optionally add a unique identifier for the public_id
    formData.append("public_id", `${Date.now()}`);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dtxh3ew7s/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    return response.json();
  });

  const uploadedImages = await Promise.all(imageUploadPromises);

  const imageUrls = uploadedImages.map((img) => ({
    url: img.secure_url,
    public_id: img.public_id,
    tags: img.tags,
  }));
  return {
    imageUrls,
  };
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
  }
};
