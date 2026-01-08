import React from "react";

const YourOrdersCard = () => {
  return (
    <div className="w-full max-w-[900px] bg-white rounded-xl border shadow-sm p-4 flex gap-4 items-center">
      
      {/* Left Image */}
      <div className="w-[90px] h-[90px] rounded-lg overflow-hidden flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
          alt="Food"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          Chicken Burger Combo
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Juicy chicken burger with fries and cold drink
        </p>

        <p className="text-sm font-medium text-gray-700 mt-2">
          Quantity: <span className="font-semibold">2</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
          Track
        </button>
        <button className="px-4 py-2 text-sm rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition">
          Cancel
        </button>
      </div>

    </div>
  );
};

export default YourOrdersCard;
