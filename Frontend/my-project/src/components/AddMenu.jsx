import React, { useState } from "react";
import {
  X,
  AlertCircle,
  Upload,
  Utensils,
  DollarSign,
  FileText,
  Loader2,
  ChefHat,
  Sparkles,
  Plus,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useMenu from "../hooks/use-menu";
import { useEffect } from "react";
import MenuItemCard from "./MenuItem";
import useRestaurant from "../hooks/use-restaurant";

const MENU_CATEGORIES = [
  { id: 1, name: "Appetizers", icon: "🥗" },
  { id: 2, name: "Main Course", icon: "🍛" },
  { id: 3, name: "Desserts", icon: "🍰" },
  { id: 4, name: "Beverages", icon: "🥤" },
  { id: 5, name: "Fast Food", icon: "🍔" },
  { id: 6, name: "Traditional", icon: "🍲" },
  { id: 7, name: "BBQ & Grills", icon: "🍖" },
  { id: 8, name: "Seafood", icon: "🦐" },
  { id: 9, name: "Vegetarian", icon: "🥬" },
  { id: 10, name: "Breakfast", icon: "🍳" },
];

// ✅ Fixed Zod schema
const menuItemSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters").max(50, "Name too long"),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(1, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters").max(200, "Description too long"),
  image: z.any().nullable().refine((file) => file !== null, "Please upload an item image"),
  available: z.boolean().default(true),
});



const AddMenu = ({ onSubmit: onSubmitCallback }) => {
  
  
  
  
  const {activeRestaurant} = useRestaurant()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {addMenuItem, deleteMenuItem, refetchMenu, isFetching, menuItems} = useMenu(activeRestaurant?._id);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    trigger,
    watch,
  } = useForm({
    resolver: zodResolver(menuItemSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      description: "",
      image: null,
      available: true,
    },
  });

  const isAvailable = watch("available");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
      trigger("image");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("image", data.image);
      formData.append("available", data.available);


      await addMenuItem(formData)
      await onSubmitCallback(formData);

      reset();
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding menu item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    setIsModalOpen(false);
    refetchMenu();
  };
  
  return (
    <>
      {/* Menu Management Section */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#FFA31A] w-fit p-3 rounded-xl">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Menu Management</h4>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Add Menu Items
          </button>
        </div>

        {/* Loading State */}
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-[#FFA31A] animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading menu items...</p>
          </div>
        ) : (
          /* Menu Items Display */
          menuItems && menuItems.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-6">
              {menuItems.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Utensils className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg">Your Menu is Empty</p>
              <p className="text-gray-500 text-sm mt-2">Click "Add Menu Items" to get started</p>
            </div>
          )
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <ChefHat className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Add Menu Item</h2>
                    <p className="text-white/90 text-sm">Create a delicious new dish for your menu</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Item Image *</label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-[#FFA31A]/30 group">
                      <img src={imagePreview} alt="Item preview" className="w-full h-56 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setValue("image", null);
                          trigger("image");
                        }}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gradient-to-br from-gray-50 to-orange-50/30 hover:from-orange-50/50 hover:to-yellow-50/50 transition-all duration-300 group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="bg-[#FFA31A]/10 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-10 h-10 text-[#FFA31A]" />
                        </div>
                        <p className="mb-2 text-sm text-gray-600 font-semibold">Click to upload item image</p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                {errors.image && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.image.message}
                  </p>
                )}
              </div>

              {/* Name & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name *</label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <input
                          {...field}
                          type="text"
                          placeholder="e.g., Chicken Biryani"
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.name
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20"
                          } outline-none focus:ring-2 transition-all duration-300`}
                        />
                      </div>
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (PKR) *</label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="0.00"
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.price
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20"
                          } outline-none focus:ring-2 transition-all duration-300`}
                        />
                      </div>
                    )}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category *</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {MENU_CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            field.onChange(category.name.toLowerCase());
                            trigger("category");
                          }}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            field.value === category.name.toLowerCase()
                              ? "border-[#FFA31A] bg-[#FFA31A]/10 shadow-md scale-105"
                              : "border-gray-200 hover:border-[#FFA31A]/50 hover:bg-gray-50"
                          }`}
                        >
                          <div className="text-3xl mb-1">{category.icon}</div>
                          <div className="text-xs font-medium text-gray-700">{category.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <div className="absolute left-4 top-4 text-gray-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <textarea
                        {...field}
                        placeholder="Describe your delicious dish..."
                        rows="4"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          errors.description
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20"
                        } outline-none focus:ring-2 transition-all duration-300 resize-none`}
                      />
                    </div>
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-[#FFA31A]/50 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${isAvailable ? "bg-green-100" : "bg-gray-100"}`}>
                      <Sparkles className={`w-5 h-5 ${isAvailable ? "text-green-600" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Available for Order</p>
                      <p className="text-xs text-gray-500">Toggle if this item is currently available</p>
                    </div>
                  </div>
                  <Controller
                    name="available"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={field.value} onChange={field.onChange} />
                        <div className={`w-14 h-7 rounded-full transition-all duration-300 ${field.value ? "bg-green-500" : "bg-gray-300"}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-1 ${field.value ? "translate-x-8" : "translate-x-1"}`}></div>
                        </div>
                      </div>
                    )}
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid || isSubmitting}
                  className={`flex-1 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    !isValid || isSubmitting
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white hover:shadow-lg hover:scale-[1.02]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding Item...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Add Menu Item
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default AddMenu;