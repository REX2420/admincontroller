"use server";

import { connectToDatabase } from "@/lib/database/connect";
import HomeScreenOffer from "@/lib/database/models/home.screen.offers";
import cloudinary from "cloudinary";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Helper function to convert base64 string to buffer
const base64ToBuffer = (base: any) => {
  const base64String = base.split(";base64,").pop();
  return Buffer.from(base64String, "base64");
};

export const createOffer = async (
  title: string,
  offerType: string, // Enum like 'Special Combos' or 'Crazy Deals'
  images: string[] // Array of base64 strings for image uploads
) => {
  try {
    await connectToDatabase();

    if (!title) {
      return {
        message: "Please provide a title for the offer.",
        success: false,
      };
    }

    // Check if offer already exists
    const existingOffer = await HomeScreenOffer.findOne({ title });
    if (existingOffer) {
      return {
        message: "Offer with this title already exists.",
        success: false,
      };
    }

    // Upload images to Cloudinary
    const uploadImagesToCloudinary = images.map(async (base64Image: any) => {
      const buffer = base64ToBuffer(base64Image);
      const formData = new FormData();
      formData.append("file", new Blob([buffer], { type: "image/jpeg" }));
      formData.append("upload_preset", "website");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      return response.json();
    });

    // Wait for all images to upload and gather their URLs and public IDs
    const uploadedImages = await Promise.all(uploadImagesToCloudinary);
    const imageUrls = uploadedImages.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));

    // Create a new offer in the database
    await new HomeScreenOffer({
      title,
      offerType, // e.g., 'Special Combos' or 'Crazy Deals'
      images: imageUrls,
    }).save();

    const offers = await HomeScreenOffer.find().sort({ updatedAt: -1 });

    return {
      message: `Offer ${title} has been successfully created.`,
      success: true,
      offers: JSON.parse(JSON.stringify(offers)),
    };
  } catch (error: any) {
    console.log(error);
  }
};

// Delete an offer and its associated images from Cloudinary
export const deleteOffer = async (offerId: string) => {
  try {
    await connectToDatabase();

    const offer = await HomeScreenOffer.findById(offerId);

    if (!offer) {
      return {
        message: "Offer not found with this Id!",
        success: false,
      };
    }

    // Delete images from Cloudinary
    const imagePublicIds = offer.images.map((image: any) => image.public_id);
    const deleteImagePromises = imagePublicIds.map((publicId: string) =>
      cloudinary.v2.uploader.destroy(publicId)
    );
    await Promise.all(deleteImagePromises);

    // Delete offer document from MongoDB
    await HomeScreenOffer.findByIdAndDelete(offerId);

    const offers = await HomeScreenOffer.find().sort({ updatedAt: -1 });

    return {
      message:
        "Successfully deleted offer and associated images from Cloudinary.",
      success: true,
      offers: JSON.parse(JSON.stringify(offers)),
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting offer.",
      success: false,
    };
  }
};

// Get all offers for the home screen
export const getAllOffers = async () => {
  try {
    await connectToDatabase();
    const offers = await HomeScreenOffer.find().sort({ updatedAt: -1 });
    return {
      offers: JSON.parse(JSON.stringify(offers)),
      message: "Successfully fetched all offers.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// Update the title of an offer by its ID
export const updateOffer = async (
  offerId: string,
  newTitle: string,
  newOfferType: string
) => {
  try {
    await connectToDatabase();

    // Find the offer by its ID
    const offer = await HomeScreenOffer.findById(offerId);

    if (!offer) {
      return {
        message: "Offer not found with this Id!",
        success: false,
      };
    }

    // Update the title and offer type
    offer.title = newTitle;
    offer.offerType = newOfferType;

    // Save the updated offer
    await offer.save();

    const offers = await HomeScreenOffer.find().sort({ updatedAt: -1 });

    return {
      message: "Successfully updated the offer!",
      success: true,
      offers: JSON.parse(JSON.stringify(offers)),
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating offer.",
      success: false,
    };
  }
};
