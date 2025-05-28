import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { SlEye } from "react-icons/sl";
import { HiCurrencyRupee } from "react-icons/hi";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  calculateTotalOrders,
  getDashboardData,
} from "@/lib/database/actions/admin/dashboard/dashboard.actions";
import DashboardCard from "@/components/admin/dashboard/dashboardCard";
import ProductData from "@/components/admin/dashboard/product.perfomance";
import LowStockProducts from "@/components/admin/dashboard/low-stock-products";
import OutOfStockProducts from "@/components/admin/dashboard/out-of-stock-products";

const AdminDashboardPage = async () => {
  const data = await getDashboardData().catch((err) => {
    console.log("Dashboard data error:", err);
    return { orders: [], products: [] }; // Fallback data
  });
  
  const allOrdersData = await calculateTotalOrders().catch((err) => {
    console.log("Orders calculation error:", err);
    return {
      totalSales: 0,
      lastMonthSales: 0,
      growthPercentage: "0.00"
    }; // Fallback data
  });

  // Ensure data has the expected structure
  const safeData = {
    orders: data?.orders || [],
    products: data?.products || []
  };

  const safeOrdersData = {
    totalSales: allOrdersData?.totalSales || 0,
    lastMonthSales: allOrdersData?.lastMonthSales || 0,
    growthPercentage: allOrdersData?.growthPercentage || "0.00"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <DashboardCard data={safeData} />
      </div>
      <div className="text-3xl font-bold mb-6 text-gray-800">Orders</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <HiCurrencyRupee size={40} className="text-white" />
            </div>
            <div className="text-white">
              <p className="text-2xl font-bold">MVR{safeOrdersData.totalSales}</p>
              <p className="text-sm opacity-90">Total Sales</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <HiCurrencyRupee size={40} className="text-white" />
            </div>
            <div className="text-white">
              <p className="text-2xl font-bold">MVR{safeOrdersData.lastMonthSales}</p>
              <p className="text-sm opacity-90">Last Month Sales</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <HiCurrencyRupee size={40} className="text-white" />
            </div>
            <div className="text-white">
              <p className="text-2xl font-bold">MVR{safeOrdersData.growthPercentage}</p>
              <p className="text-sm opacity-90">Growth Percentage</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div className="text-2xl font-bold mb-4 text-gray-800">Recent Orders</div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-50">
                  <TableCell className="font-semibold">Name</TableCell>
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell className="font-semibold">Payment</TableCell>
                  <TableCell className="font-semibold">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {safeData.orders.length > 0 ? (
                  safeData.orders.map((order: any, index: any) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell>{order?.user?.email || 'N/A'}</TableCell>
                      <TableCell>MVR{order?.total || 0}</TableCell>
                      <TableCell>
                        {order?.isPaid ? (
                          <FaCheckCircle size={23} className="text-green-500" />
                        ) : (
                          <IoIosCloseCircle size={25} className="text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/order/${order?._id}`} className="text-blue-500 hover:text-blue-700">
                          <SlEye />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <ProductData />
      <LowStockProducts />
      <OutOfStockProducts />
    </div>
  );
};

export default AdminDashboardPage;
