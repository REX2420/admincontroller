"use server";

import Order from "@/lib/database/models/order.model";
import { generateLast12MonthsData } from "./analytics.generator";
import Product from "@/lib/database/models/product.model";
import { connectToDatabase } from "@/lib/database/connect";
import User from "@/lib/database/models/user.model";

// get users analytics for admin - only admin can access
export const getUseranalytics = async () => {
  try {
    const users = await generateLast12MonthsData(User);
    return { users };
  } catch (error: any) {
    console.log(error);
  }
};
// get Order analytics for admin
export const getOrderAnalytics = async () => {
  try {
    const orders = await generateLast12MonthsData(Order);
    return { orders };
  } catch (error: any) {
    console.log(error);
  }
};

// get Product analytics for admin
export const getProductAnalytics = async () => {
  try {
    const products = await generateLast12MonthsData(Product);
    return { products };
  } catch (error: any) {
    console.log(error);
  }
};

// get product size analytics for admin
export const sizeAnalytics = async () => {
  try {
    await connectToDatabase();
    const products = await Product.find({});
    if (!products) {
      return {
        message: "No Products found",
        success: false,
      };
    }
    const individualSizeAnalytics = products.reduce(
      (acc: any, product: any) => {
        product.subProducts.forEach((subProduct: any) => {
          subProduct.sizes.forEach((size: any) => {
            if (acc[size.size]) {
              acc[size.size] += size.sold;
            } else {
              acc[size.size] = size.sold;
            }
          });
        });
        return acc;
      }
    );
    const sizeData = Object.keys(individualSizeAnalytics).map((size) => ({
      name: size,
      value: individualSizeAnalytics[size],
    }));
    return JSON.parse(JSON.stringify(sizeData));
  } catch (error: any) {
    console.log(error);
  }
};

// get top selling products for admin
export const getTopSellingProducts = async () => {
  try {
    await connectToDatabase();

    let topSellingProducts = await Product.find({})
      .sort({ "subProducts.sold": -1 })
      .limit(5)
      .lean();
    const pieChartData = topSellingProducts.map((product) => ({
      name: product.name,
      value: product.subProducts[0].sold,
    }));
    return JSON.parse(JSON.stringify(pieChartData));
  } catch (error: any) {
    console.log(error);
  }
};
