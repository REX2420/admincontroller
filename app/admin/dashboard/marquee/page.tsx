"use client";

import CreateMarqueeText from "@/components/admin/dashboard/marquee/create";
import ListAllMarqueeTexts from "@/components/admin/dashboard/marquee/list";
import { getAllMarqueeTexts } from "@/lib/database/actions/admin/marquee/marquee.actions";
import { useEffect, useState } from "react";
import React from "react";

const MarqueePage = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchAllMarqueeTexts = async () => {
      try {
        await getAllMarqueeTexts().then((res) => {
          if (res?.success) {
            setData(res?.marqueeTexts);
          } else {
            alert(res?.message);
          }
        });
      } catch (error: any) {
        alert(error);
      }
    };
    fetchAllMarqueeTexts();
  }, []);

  return (
    <div className="container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Marquee Text Management</h1>
        <p className="text-gray-600">
          Manage the scrolling marquee texts that appear on your product pages. 
          These texts will scroll horizontally on mobile devices.
        </p>
      </div>
      
      <CreateMarqueeText setMarqueeTexts={setData} />
      <ListAllMarqueeTexts setMarqueeTexts={setData} marqueeTexts={data} />
    </div>
  );
};

export default MarqueePage; 