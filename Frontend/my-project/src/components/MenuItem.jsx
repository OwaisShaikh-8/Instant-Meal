import React from "react";
import { Plus, Minus } from "lucide-react";

const MenuItem = ({ item, cartQuantity, addItem, removeItem }) => {
  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(item.id); // use item id
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeItem(item.id); // use item id
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <figure className="h-80 w-full overflow-hidden rounded-2xl">
        {item.image?.url ? (
          <img
            src={item.image.url}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </figure>

      <h3 className="font-bold mt-3">{item.name}</h3>
      <p className="text-sm text-gray-500">{item.description}</p>

      <div className="flex justify-between items-center mt-4">
        <span className="font-bold">PKR {item.price}</span>

        {cartQuantity > 0 ? (
          <div className="flex gap-2 bg-[#FFA31A] text-white rounded-full px-3 py-1 items-center">
            <button
              onClick={handleRemove}
              className="hover:opacity-80 cursor-pointer"
              type="button"
            >
              <Minus size={18} />
            </button>
            <span className="min-w-[20px] text-center font-semibold">{cartQuantity}</span>
            <button
              onClick={handleAdd}
              className="hover:opacity-80 cursor-pointer"
              type="button"
            >
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-[#FFA31A] text-white px-4 py-2 rounded-full hover:bg-[#FF8C00] transition cursor-pointer"
            type="button"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
