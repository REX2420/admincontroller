"use client";

import {
  getTopSellingProducts,
  sizeAnalytics,
} from "@/lib/database/actions/admin/analytics/analytics.actions";
import { useEffect, useState } from "react";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];
const ProductData = () => {
  const [sizeData, setSizeData] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  useEffect(() => {
    async function fetchSizeDataForProduct() {
      await sizeAnalytics()
        .then((res) => setSizeData(res))
        .catch((err) => console.log(err));
    }
    fetchSizeDataForProduct();
    async function topSellingProducts() {
      await getTopSellingProducts()
        .then((res) => setTopSellingProducts(res))
        .catch((err) => console.log(err));
    }
    topSellingProducts();
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Product Performance</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            Size Performance
          </h3>
          {sizeData?.length > 0 ? (
            <div className="flex justify-center">
              <PieChart width={400} height={400}>
                <Pie
                  data={sizeData}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sizeData?.length > 0 &&
                    sizeData?.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[400px] text-gray-500">
              No Data Found
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            Top Selling Products
          </h3>
          {topSellingProducts?.length > 0 ? (
            <div className="flex justify-center">
              <PieChart width={400} height={400}>
                <Pie
                  data={topSellingProducts}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topSellingProducts?.length > 0 &&
                    topSellingProducts?.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[400px] text-gray-500">
              No Data Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductData;
