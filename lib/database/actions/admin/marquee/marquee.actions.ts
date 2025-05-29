"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Marquee from "@/lib/database/models/marquee.model";
import { revalidateTag } from "next/cache";

// create marquee text for admin
export const createMarqueeText = async (
  text: string,
  isActive: boolean = true,
  order: number = 0
) => {
  try {
    await connectToDatabase();
    if (!text) {
      return {
        message: "Please provide marquee text.",
        success: false,
      };
    }
    await new Marquee({
      text,
      isActive,
      order,
    }).save();
    
    // Revalidate cache
    revalidateTag("marquee_texts");
    
    const marqueeTexts = await Marquee.find().sort({ order: 1, updatedAt: -1 });
    return {
      marqueeTexts: JSON.parse(JSON.stringify(marqueeTexts)),
      success: true,
      message: "Successfully created marquee text",
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating marquee text",
      success: false,
    };
  }
};

// delete marquee text for admin
export const deleteMarqueeText = async (marqueeId: string) => {
  try {
    await connectToDatabase();
    const marquee = await Marquee.findByIdAndDelete(marqueeId);
    if (!marquee) {
      return {
        message: "No marquee text found with this ID!",
        success: false,
      };
    }
    
    // Revalidate cache
    revalidateTag("marquee_texts");
    
    const marqueeTexts = await Marquee.find({}).sort({
      order: 1,
      updatedAt: -1,
    });
    return {
      message: "Successfully deleted!",
      marqueeTexts: JSON.parse(JSON.stringify(marqueeTexts)),
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting marquee text",
      success: false,
    };
  }
};

// update marquee text for admin
export const updateMarqueeText = async (
  marqueeId: string,
  text: string,
  isActive: boolean,
  order: number
) => {
  try {
    await connectToDatabase();
    if (!text) {
      return {
        message: "Please provide marquee text.",
        success: false,
      };
    }
    const marquee = await Marquee.findByIdAndUpdate(marqueeId, {
      text,
      isActive,
      order,
    });
    if (!marquee) {
      return {
        message: "No marquee text found with this Id.",
        success: false,
      };
    }
    
    // Revalidate cache
    revalidateTag("marquee_texts");
    
    const marqueeTexts = await Marquee.find().sort({ order: 1, updatedAt: -1 });
    return {
      marqueeTexts: JSON.parse(JSON.stringify(marqueeTexts)),
      success: true,
      message: "Successfully updated",
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating marquee text",
      success: false,
    };
  }
};

// get all marquee texts for admin
export const getAllMarqueeTexts = async () => {
  try {
    await connectToDatabase();
    const marqueeTexts = await Marquee.find().sort({ order: 1, updatedAt: -1 });
    if (!marqueeTexts) {
      return {
        message: "No marquee texts found!",
        success: false,
      };
    }
    return {
      marqueeTexts: JSON.parse(JSON.stringify(marqueeTexts)),
      success: true,
      message: "Successfully fetched all marquee texts",
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error fetching marquee texts",
      success: false,
    };
  }
};

// get active marquee texts for frontend
export const getActiveMarqueeTexts = async () => {
  try {
    await connectToDatabase();
    const marqueeTexts = await Marquee.find({ isActive: true }).sort({ order: 1 });
    return {
      marqueeTexts: JSON.parse(JSON.stringify(marqueeTexts)),
      success: true,
      message: "Successfully fetched active marquee texts",
    };
  } catch (error: any) {
    console.log(error);
    return {
      marqueeTexts: [],
      success: false,
      message: "Error fetching marquee texts",
    };
  }
}; 