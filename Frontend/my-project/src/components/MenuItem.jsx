import React from "react";
import { Trash2 } from "lucide-react";
import PropTypes from "prop-types";

const MenuItemCard = ({ item, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#FFA31A] transition-all duration-300 hover:shadow-lg overflow-hidden">
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={item.image?.url || "/placeholder-food.jpg"}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {/* Delete Button */}
        <button
          onClick={() => onDelete(item._id)}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-red-50 shadow-md"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Item Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">
          {item.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-2xl font-bold text-[#FFA31A]">
            PKR {item.price}
          </span>
        </div>
      </div>
    </div>
  );
};

MenuItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MenuItemCard;
