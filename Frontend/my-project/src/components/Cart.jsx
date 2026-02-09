import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  ShoppingBag,
  MapPin,
  Upload,
  Clock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomerHeader from "../components/CustomerHeader.jsx";
import useCart from "../hooks/use-cart.js";
import useRestaurant from "../hooks/use-restaurant.js";
import useMenu from "../hooks/use-menu.js";
import useAuth from "../hooks/use-auth.js";
import useOrders from "../hooks/use-order.js";

// Zod validation schema
const orderSchema = z
  .object({
    orderType: z.enum(["delivery", "selfPickup", "dining"], {
      required_error: "Please select an order type",
    }),
    deliveryAddress: z.string().optional(),
    arrivalTime: z.string().optional(),
    easypaisaScreenshot: z
      .instanceof(FileList)
      .refine((files) => files?.length === 1, "Payment screenshot is required")
      .refine(
        (files) => {
          if (files?.length === 1) {
            const file = files[0];
            const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            return validTypes.includes(file.type);
          }
          return false;
        },
        "Please upload a valid image file (JPG, PNG, WEBP)"
      )
      .refine(
        (files) => {
          if (files?.length === 1) {
            return files[0].size <= 5 * 1024 * 1024; // 5MB
          }
          return false;
        },
        "File size must be less than 5MB"
      ),
    specialInstructions: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.orderType === "delivery") {
        return data.deliveryAddress && data.deliveryAddress.length >= 10;
      }
      return true;
    },
    {
      message: "Address must be at least 10 characters",
      path: ["deliveryAddress"],
    }
  )
  .refine(
    (data) => {
      if (data.orderType === "selfPickup" || data.orderType === "dining") {
        return data.arrivalTime && data.arrivalTime.length > 0;
      }
      return true;
    },
    {
      message: "Arrival time is required",
      path: ["arrivalTime"],
    }
  );

const Cart = () => {
  const {createNewOrder} = useOrders()
  const { loggedInUser }  = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    items,
    cart,
    addItem,
    removeItem,
    deleteItem,
    clearRestaurantCart,
    totalItems,
  } = useCart(id);
  const { activeRestaurant } = useRestaurant();
  const { menuItems } = useMenu();
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderType: "delivery",
      deliveryAddress: "",
      arrivalTime: "",
      specialInstructions: "",
    },
  });

  const orderType = watch("orderType");
  const easypaisaScreenshot = watch("easypaisaScreenshot");

  const restaurantInfo = activeRestaurant;

  const cartItems = items.map((cartItem) => {
    const menuItem = menuItems.find((m) => m._id === cartItem.itemId);
    return { ...menuItem, quantity: cartItem.quantity };
  });

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = orderType === "delivery" ? 50 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  // Handle screenshot preview
  useEffect(() => {
    if (easypaisaScreenshot && easypaisaScreenshot.length > 0) {
      const file = easypaisaScreenshot[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshotPreview(null);
    }
  }, [easypaisaScreenshot]);

  const onSubmit = (data) => {
    setShowConfirmModal(true);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      const formValues = watch();

      // Create FormData object
      const formData = new FormData();

      // Append order details
      formData.append("restaurantId", id);
      formData.append("restaurantName", restaurantInfo?.name || "");
      formData.append("customerId", loggedInUser._id);
      formData.append("customerName", loggedInUser.fullname);
      formData.append("orderType", formValues.orderType);
      formData.append("subtotal", subtotal.toFixed(2));
      formData.append("deliveryFee", deliveryFee.toFixed(2));
      formData.append("tax", tax.toFixed(2));
      formData.append("total", total.toFixed(2));
      formData.append("totalItems", totalItems);
      formData.append("specialInstructions", formValues.specialInstructions || "");

      // Append order type specific fields
      if (formValues.orderType === "delivery") {
        formData.append("deliveryAddress", formValues.deliveryAddress);
      } else {
        formData.append("arrivalTime", formValues.arrivalTime);
      }

      // Append Easypaisa screenshot
      if (formValues.easypaisaScreenshot && formValues.easypaisaScreenshot.length > 0) {
        formData.append("easypaisaScreenshot", formValues.easypaisaScreenshot[0]);
      }

      // Append cart items as JSON string
      formData.append("items", JSON.stringify(cartItems));

      // Log FormData contents (for debugging)
      console.log("Order FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }



      await createNewOrder(formData)
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      clearRestaurantCart();
      reset();
      setShowConfirmModal(false);
      navigate("/order-success");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setValue("easypaisaScreenshot", null);
    setScreenshotPreview(null);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-[#FFA31A] mb-6 transition"
          >
            <ArrowLeft /> Back
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Add some delicious items to get started!
            </p>
            <button
              onClick={() => navigate("/customer")}
              className="bg-[#FFA31A] text-white px-8 py-3 rounded-lg hover:bg-[#FF8C00] transition"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-[#FFA31A] transition"
          >
            <ArrowLeft /> Back
          </button>
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <button
            onClick={clearRestaurantCart}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
          >
            <Trash2 size={20} /> Clear Cart
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {restaurantInfo && (
                <div className="bg-white rounded-xl shadow p-4 mb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {restaurantInfo.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-[#FFA31A]" />
                    <span>
                      {restaurantInfo.area}, {restaurantInfo.city}
                    </span>
                  </div>
                </div>
              )}

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FFA31A] to-[#FF8C00] flex items-center justify-center">
                          <ShoppingBag className="text-white" size={32} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteItem(item._id)}
                          className="text-red-500 hover:text-red-600 transition ml-4 cursor-pointer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <p className="flex gap-4 items-center bg-gray-100 px-3 py-1 rounded">
                          Quantity:
                          <span className="font-semibold">{item.quantity}</span>
                        </p>

                        <p className="text-xl font-bold text-[#FFA31A]">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Order Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">
                    Order Type <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        value="delivery"
                        {...register("orderType")}
                        className="w-4 h-4 text-[#FFA31A]"
                      />
                      <span>Delivery</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        value="selfPickup"
                        {...register("orderType")}
                        className="w-4 h-4 text-[#FFA31A]"
                      />
                      <span>Self Pickup</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        value="dining"
                        {...register("orderType")}
                        className="w-4 h-4 text-[#FFA31A]"
                      />
                      <span>Dining</span>
                    </label>
                  </div>
                  {errors.orderType && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.orderType.message}
                    </p>
                  )}
                </div>

                {/* Delivery Address - Only for Delivery */}
                {orderType === "delivery" && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <textarea
                        {...register("deliveryAddress")}
                        placeholder="Enter your delivery address..."
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA31A] resize-none ${
                          errors.deliveryAddress ? "border-red-500" : ""
                        }`}
                        rows="3"
                      />
                    </div>
                    {errors.deliveryAddress && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Arrival Time - Only for Self Pickup and Dining */}
                {(orderType === "selfPickup" || orderType === "dining") && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                      Arrival Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <input
                        type="datetime-local"
                        {...register("arrivalTime")}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA31A] ${
                          errors.arrivalTime ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.arrivalTime && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.arrivalTime.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Easypaisa Payment */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">
                    Pay via Easypaisa <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg mb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Account:{" "}
                      <span className="font-semibold">03XX-XXXXXXX</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount:{" "}
                      <span className="font-semibold text-[#FFA31A]">
                        ₹{total.toFixed(2)}
                      </span>
                    </p>
                  </div>

                  <label className="block">
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-[#FFA31A] transition ${
                        errors.easypaisaScreenshot
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        {...register("easypaisaScreenshot")}
                        className="hidden"
                      />
                      {screenshotPreview ? (
                        <div className="space-y-2">
                          <img
                            src={screenshotPreview}
                            alt="Screenshot preview"
                            className="max-h-40 mx-auto rounded-lg"
                          />
                          <p className="text-sm text-green-600 font-semibold">
                            Screenshot uploaded ✓
                          </p>
                          <button
                            type="button"
                            onClick={handleRemoveScreenshot}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm font-semibold text-gray-700">
                            Add Screenshot Here
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Click to upload payment screenshot
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            (JPG, PNG, WEBP - Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                  {errors.easypaisaScreenshot && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.easypaisaScreenshot.message}
                    </p>
                  )}
                </div>

                {/* Special Instructions */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    {...register("specialInstructions")}
                    placeholder="Any special requests? (optional)"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA31A] resize-none"
                    rows="2"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {orderType === "delivery" && (
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#FFA31A]">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FFA31A] text-white py-4 rounded-lg font-semibold hover:bg-[#FF8C00] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Confirm Your Order?</h2>
              <p className="text-gray-600">
                Please review your order details before confirming
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Items:</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Type:</span>
                <span className="font-semibold capitalize">
                  {orderType === "selfPickup" ? "Self Pickup" : orderType}
                </span>
              </div>
              {orderType === "delivery" && watch("deliveryAddress") && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-semibold text-right max-w-[60%]">
                    {watch("deliveryAddress").length > 30
                      ? watch("deliveryAddress").substring(0, 30) + "..."
                      : watch("deliveryAddress")}
                  </span>
                </div>
              )}
              {(orderType === "selfPickup" || orderType === "dining") &&
                watch("arrivalTime") && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival:</span>
                    <span className="font-semibold">
                      {new Date(watch("arrivalTime")).toLocaleString()}
                    </span>
                  </div>
                )}
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-[#FFA31A]">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment:</span>
                <span className="font-semibold">Easypaisa</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#FFA31A] text-white rounded-lg font-semibold hover:bg-[#FF8C00] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Placing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;