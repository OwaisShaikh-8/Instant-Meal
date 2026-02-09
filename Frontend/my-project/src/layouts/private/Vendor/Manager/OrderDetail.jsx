import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  Calendar,
  ShoppingBag,
  AlertCircle,
  Loader2,
  Store,
  Navigation,
  CreditCard,
  FileText,
  Receipt,
  Image as ImageIcon,
} from "lucide-react";
import useOrders from "../../../../hooks/use-order";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // Use the custom hook to fetch order by ID
  const { activeOrder, isOrderByIdLoading, fetchOrderById, updateOrder, isUpdateOrderStatusLoading } = useOrders({
    orderId: orderId,
    shouldFetchOrderById: true
  });
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle order status update
  const handleStatusUpdate = async (newStatus) => {
    if (!activeOrder) return;
    
    const confirmMessages = {
      accepted: "Are you sure you want to accept this order?",
      cancelled: "Are you sure you want to cancel this order? This action cannot be undone.",
    //   : "Mark this order as completed?",
    };

    if (window.confirm(confirmMessages[newStatus])) {
      try {
        await updateOrder({orderId, status:newStatus});
        alert(`Order ${newStatus} successfully!`);
        
       fetchOrderById()
      } catch (error) {
        console.error("Error updating order:", error);
        alert("Failed to update order status");
      }
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-700 border-blue-300",
      completed: "bg-green-100 text-green-700 border-green-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  // Helper function to safely get restaurantId as string
  const getRestaurantId = () => {
    if (!activeOrder?.restaurantId) return "N/A";
    
    // If restaurantId is an object with _id
    if (typeof activeOrder.restaurantId === 'object' && activeOrder.restaurantId._id) {
      return activeOrder.restaurantId._id;
    }
    
    // If restaurantId is already a string
    if (typeof activeOrder.restaurantId === 'string') {
      return activeOrder.restaurantId;
    }
    
    return "N/A";
  };

  if (isOrderByIdLoading) {
    return (
      <div className="">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-[#FFA31A] animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24">
            <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Order Not Found
            </h4>
            <p className="text-gray-600 text-center max-w-md mb-6">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-[#FFA31A] text-white rounded-xl hover:bg-[#FF8C00] transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h3 className="text-3xl font-light text-gray-800">Order Details</h3>
            <p className="text-sm text-gray-500 mt-1">
              Order ID: #{activeOrder._id?.slice(-8) || activeOrder._id}
            </p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full border-2 font-semibold text-sm uppercase ${getStatusColor(activeOrder.status)}`}>
          {activeOrder.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Order Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] p-6">
              <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Order Items ({activeOrder.totalItems})
              </h4>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {activeOrder.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={item.image?.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-800 text-lg mb-1">
                        {item.name}
                      </h5>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-700">
                          Qty: <span className="font-semibold">{item.quantity}</span>
                        </span>
                        <span className="text-gray-700">
                          Price: <span className="font-semibold">Rs. {item.price}</span>
                        </span>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Instructions */}
              {activeOrder.specialInstructions && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Special Instructions
                      </p>
                      <p className="text-sm text-blue-700">
                        {activeOrder.specialInstructions}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">Rs. {activeOrder.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">Rs. {activeOrder.deliveryFee?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span className="font-semibold">Rs. {activeOrder.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                    <span>Total Amount</span>
                    <span className="text-[#FFA31A]">Rs. {activeOrder.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Screenshot */}
          {activeOrder.easypaisaScreenshot && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Verification
                </h4>
              </div>

              <div className="p-6">
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900 mb-1">
                        Payment Screenshot Submitted
                      </p>
                      <p className="text-sm text-yellow-700">
                        Please verify the Easypaisa payment screenshot before accepting the order.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                  <img
                    src={activeOrder.easypaisaScreenshot.url}
                    alt="Payment Screenshot"
                    className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowPaymentModal(true)}
                  />
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-all"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">View Full Size</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                <User className="w-6 h-6" />
                Customer Information
              </h4>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                  <p className="text-gray-800 font-semibold">
                    {activeOrder.customerName || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Receipt className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer ID</p>
                  <p className="text-gray-800 font-semibold text-xs">
                    {activeOrder.customerId || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                  <p className="text-gray-800 font-semibold">
                    {activeOrder.deliveryAddress || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Order Status & Actions */}
        <div className="space-y-6">
          
          {/* Restaurant Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                <Store className="w-6 h-6" />
                Restaurant
              </h4>
            </div>
            <div className="p-6">
              <p className="text-lg font-bold text-gray-800 mb-1">
                {activeOrder.restaurantName || "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Restaurant ID: {getRestaurantId()}
              </p>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
              <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Order Timeline
              </h4>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Placed</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {activeOrder.createdAt ? formatDate(activeOrder.createdAt) : "N/A"}
                  </p>
                </div>
              </div>

              {activeOrder.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDate(activeOrder.updatedAt)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Type</p>
                  <p className="text-sm font-semibold text-gray-800 capitalize">
                    {activeOrder.orderType || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                <Navigation className="w-6 h-6" />
                Actions
              </h4>
            </div>

            <div className="p-6 space-y-3">
              {activeOrder.status === "pending" && (
                <>
                  {activeOrder.easypaisaScreenshot && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800 font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Verify payment screenshot before accepting
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleStatusUpdate("accepted")}
                    disabled={isUpdateOrderStatusLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdateOrderStatusLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Accept Order
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={isUpdateOrderStatusLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Order
                  </button>
                </>
              )}

              {activeOrder.status === "accepted" && (
                <button
                  onClick={() => handleStatusUpdate("inKitchen")}
                  disabled={isUpdateOrderStatusLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdateOrderStatusLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Move to Kitchen 
                    </>
                  )}
                </button>
              )}

              {activeOrder.status === "completed" && (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700 font-semibold">Order Completed</p>
                  <p className="text-sm text-gray-600 mt-1">This order has been successfully completed</p>
                </div>
              )}

              {activeOrder.status === "cancelled" && (
                <div className="text-center py-4">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                  <p className="text-red-700 font-semibold">Order Cancelled</p>
                  <p className="text-sm text-gray-600 mt-1">This order has been cancelled</p>
                </div>
              )}

              <button
                onClick={() => navigate(-1)}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Back to Orders
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Screenshot Modal */}
      {showPaymentModal && activeOrder.easypaisaScreenshot && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaymentModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Payment Screenshot</h4>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img
                src={activeOrder.easypaisaScreenshot.url}
                alt="Payment Screenshot Full Size"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;