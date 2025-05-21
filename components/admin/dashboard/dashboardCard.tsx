"use client";
import { GiTakeMyMoney } from "react-icons/gi";
import { SiProducthunt } from "react-icons/si";
import { SlHandbag } from "react-icons/sl";
import React from "react";

const DashboardCard = ({ data }: { data: any }) => {
  return (
    <div className="p-6">
      <div className="text-3xl font-bold mb-8 text-gray-800">Dashboard</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <SlHandbag size={35} className="text-white" />
            </div>
            <div className="text-white">
              <p className="text-2xl font-bold">{data.orders.length}</p>
              <p className="text-sm opacity-90">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <SiProducthunt size={35} className="text-white" />
            </div>
            <div className="text-white">
              <p className="text-2xl font-bold">{data.products.length}</p>
              <p className="text-sm opacity-90">Total Products</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-400 to-pink-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <GiTakeMyMoney size={35} className="text-white" />
            </div>
            <div className="text-white">
              <p className="text-2xl font-bold">
                ${data.orders.reduce((a: any, val: any) => a + val.total, 0).toFixed(2)}
              </p>
              <p className="text-sm opacity-90">
                ${data.orders
                  .filter((o: any) => !o.isPaid)
                  .reduce((a: any, val: any) => a + val.total, 0)
                  .toFixed(2)}{" "}
                unpaid
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
