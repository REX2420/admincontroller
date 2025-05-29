"use client";

import MarqueeListItem from "./list.item";

const ListAllMarqueeTexts = ({
  marqueeTexts,
  setMarqueeTexts,
}: {
  marqueeTexts: any[];
  setMarqueeTexts: any;
}) => {
  return (
    <div className="my-[20px]">
      <div className="titleStyle">All Marquee Texts</div>
      <div className="grid grid-cols-1 gap-4">
        {marqueeTexts.length > 0 ? (
          marqueeTexts.map((marquee: any) => (
            <MarqueeListItem
              key={marquee._id}
              marquee={marquee}
              setMarqueeTexts={setMarqueeTexts}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No marquee texts found. Create your first marquee text above.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListAllMarqueeTexts; 