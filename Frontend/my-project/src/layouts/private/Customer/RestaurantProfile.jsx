import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Mail,
  Heart,
  Share2,
  ShoppingCart,
  Search,
} from "lucide-react";
import CustomerHeader from "../../../components/CustomerHeader.jsx";
import useRestaurant from "../../../hooks/use-restaurant.js";
import useMenu from "../../../hooks/use-menu.js";
import useCart from "../../../hooks/use-cart.js";
import MenuItem from "../../../components/MenuItem.jsx";

const RestaurantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    activeRestaurant,
    isRestaurantByIdLoading,
    isRestaurantByIdError,
  } = useRestaurant({ id, shouldFetchById: true });

  const { menuItems, isFetching } = useMenu(id);

  // Redux cart
  const { items: cartItems, addItem, removeItem, totalItems } = useCart(id);

  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (isRestaurantByIdLoading || isFetching) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin h-16 w-16 border-t-4 border-[#FFA31A] rounded-full" />
        </div>
      </div>
    );
  }

  if (isRestaurantByIdError || !activeRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-700">
            Restaurant not found
          </h2>
          <button
            onClick={() => navigate("/customer")}
            className="mt-6 bg-[#FFA31A] text-white px-6 py-2 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Categories
  const categories = ["All", ...new Set(menuItems.map((i) => i.category))];

  // Filtered menu
  const filteredMenu = menuItems.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || item.category === selectedCategory)
    );
  });

  // Cart handlers

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find((i) => i.itemId === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />

      {/* ================= BANNER ================= */}
      <div className="relative h-96">
        {activeRestaurant?.banner?.url ? (
          <img
            src={activeRestaurant.banner.url}
            alt={activeRestaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full bg-gradient-to-r from-[#FFA31A] to-[#FF8C00]" />
        )}

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white p-3 rounded-full shadow hover:shadow-lg transition"
        >
          <ArrowLeft />
        </button>

        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white p-3 rounded-full shadow hover:shadow-lg transition"
          >
            <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} />
          </button>
          <button className="bg-white p-3 rounded-full shadow hover:shadow-lg transition">
            <Share2 />
          </button>
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div className="max-w-7xl mx-auto -mt-20 p-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold">{activeRestaurant.name}</h1>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* LOCATION */}
            <div className="flex gap-3">
              <MapPin className="text-[#FFA31A] flex-shrink-0" />
              <div>
                <p className="font-semibold">Location</p>
                <p>{activeRestaurant.area}</p>
                <p>{activeRestaurant.city}</p>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex gap-3">
              <Phone className="text-[#FFA31A] flex-shrink-0" />
              <div>
                <p className="font-semibold">Phone</p>
                <a
                  href={`tel:${activeRestaurant.contact}`}
                  className="hover:text-[#FFA31A] transition"
                >
                  {activeRestaurant.contact}
                </a>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex gap-3">
              <Mail className="text-[#FFA31A] flex-shrink-0" />
              <div>
                <p className="font-semibold">Email</p>
                <a
                  href={`mailto:${activeRestaurant.email}`}
                  className="hover:text-[#FFA31A] transition"
                >
                  {activeRestaurant.email}
                </a>
              </div>
            </div>

            {/* HOURS */}
            <div className="flex gap-3">
              <Clock className="text-[#FFA31A] flex-shrink-0" />
              <div>
                <p className="font-semibold">Opening Hours</p>
                <p>{activeRestaurant.openingHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-3 mb-6">
          <Search className="mt-3 text-gray-400 flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu..."
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA31A]"
          />
        </div>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-[#FFA31A] text-white"
                  : "bg-white border hover:border-[#FFA31A]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <MenuItem
              key={item._id}
              item={item}
              cartQuantity={getItemQuantity(item._id)}
              addItem={()=> addItem(item._id)}
              removeItem={()=> removeItem(item._id)}
            />
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        )}
      </div>

      {/* ================= CART BUTTON ================= */}
      {totalItems > 0 && (
        <button
          onClick={() => navigate(`/cart/${id}`)}
          className="fixed bottom-6 right-6 bg-[#FFA31A] text-white px-6 py-4 rounded-full flex gap-3 shadow-xl hover:bg-[#FF8C00] transition transform hover:scale-105"
        >
          <ShoppingCart /> Cart ({totalItems})
        </button>
      )}
    </div>
  );
};

export default RestaurantProfile;
