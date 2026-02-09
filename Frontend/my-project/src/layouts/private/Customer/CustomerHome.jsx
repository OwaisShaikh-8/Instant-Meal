import React, { useState, useMemo, useCallback } from "react";
import { Flame, Search, Filter } from "lucide-react";
import CustomerHeader from "../../../components/CustomerHeader.jsx";
import RestroCard from "../../../components/RestroCard.jsx";
import useRestaurant from "../../../hooks/use-restaurant.js";

const DealsMarque = () => (
  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 overflow-hidden">
    <div className="animate-marquee whitespace-nowrap">
      <span className="mx-8">🔥 50% OFF on First Order!</span>
      <span className="mx-8">⚡ Free Delivery on Orders Above Rs.500</span>
      <span className="mx-8">🎉 Buy 1 Get 1 Free on Selected Items</span>
      <span className="mx-8">🍕 Special Weekend Deals Available</span>
    </div>
  </div>
);

// Static restaurant data
// Static categories
const categories = [
  { id: "all", label: "All", icon: "🍽️" },
  { id: "fast", label: "Fast Food", icon: "🍔" },
  { id: "bbq", label: "BBQ", icon: "🍗" },
  { id: "pakistani", label: "Pakistani", icon: "🍛" },
  { id: "italian", label: "Italian", icon: "🍕" },
];

// Memoized category button
const CategoryButton = React.memo(({ cat, active, onClick }) => (
  <button
    onClick={() => onClick(cat.id)}
    className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white shadow-lg scale-105"
        : "bg-white text-gray-700 hover:bg-gray-50 shadow"
    }`}
  >
    <span className="text-xl">{cat.icon}</span>
    <span>{cat.label}</span>
  </button>
));

const Customer = () => {
  const { restaurants } = useRestaurant();

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // useCallback to avoid creating new function on every render
  const handleFilter = useCallback((id) => setFilter(id), []);

  // Memoized filtered restaurants

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <CustomerHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#FFA31A] to-[#FF8C00] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg">
                Hot Deals Today
              </span>
            </div>
            <h1 className="font-bold text-4xl md:text-6xl text-white mb-4 leading-tight">
              Order Your Favorite
              <br />
              Food in Minutes
            </h1>
            <p className="text-white/90 text-lg mb-8">
              Discover the best restaurants near you with amazing deals and fast
              delivery
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl flex items-center gap-3 max-w-2xl">
              <Search className="w-6 h-6 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search for restaurants or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-gray-700 text-lg py-2"
              />
              <button className="bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <DealsMarque />

      {/* Restaurants Section */}
      <div className="container mx-auto mt-20 px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Top Restaurants Near You
            </h2>
            <p className="text-gray-600">
              {restaurants.length} restaurants found
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-[#FFA31A] transition-colors">
            <Filter className="w-5 h-5" />
            <span className="hidden md:inline">Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants?.map((restro) => (
            <RestroCard
              key={restro._id}
              restaurant={restro} // pass the whole object
            />
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Customer;
