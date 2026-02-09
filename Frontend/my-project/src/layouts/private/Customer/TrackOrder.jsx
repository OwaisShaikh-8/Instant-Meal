import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomerHeader from '../../../components/CustomerHeader';
import useOrders from '../../../hooks/use-order';
import { Loader2, AlertCircle, Package, CheckCircle } from 'lucide-react';

const TrackOrder = () => {
  const { orderId } = useParams();
  const { activeOrder, isOrderByIdLoading } = useOrders({
    orderId: orderId,
    shouldFetchOrderById: true
  });

  // Define all order statuses in sequence
  const orderStatuses = [
    { key: "pending", label: "Order Placed" },
    { key: "accepted", label: "Order Accepted" },
    { key: "inKitchen", label: "In Kitchen" },
    { key: "beingCooked", label: "Being Cooked" },
    { key: "ready", label: "Ready" },
    { key: "handedToDelivery", label: "Handed to Delivery" },
    { key: "outForDelivery", label: "Out for Delivery" },
  ];

  // Get current status index
  const getCurrentStatusIndex = () => {
    if (!activeOrder) return -1;
    return orderStatuses.findIndex(status => status.key === activeOrder.status);
  };

  const currentStatusIndex = getCurrentStatusIndex();

  // Check if status is completed (blue) or pending (gray)
  const isStatusCompleted = (index) => {
    if (activeOrder?.status === "cancelled") return false;
    return index <= currentStatusIndex;
  };

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

  if (isOrderByIdLoading) {
    return (
      <>
        <CustomerHeader />
        <div className='pt-[200px] pb-[100px] container flex justify-center items-center'>
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-[#FFA31A] animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading order details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!activeOrder) {
    return (
      <>
        <CustomerHeader />
        <div className='pt-[200px] pb-[100px] container flex justify-center items-center'>
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h4>
            <p className="text-gray-600">The order you're looking for doesn't exist.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomerHeader />
      <div className='pt-[200px] pb-[100px] container'>
        {/* Order Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className='font-hegarty text-2xl md:text-4xl text-[#3a3a3a]'>
              Order ID: #{activeOrder._id?.slice(-8)}
            </h2>
            <p className="text-gray-500 mt-2">
              Placed on {formatDate(activeOrder.createdAt)}
            </p>
          </div>
          
          {/* Order Status Badge */}
          {activeOrder.status === "cancelled" ? (
            <div className="px-6 py-3 bg-red-100 text-red-700 rounded-full font-bold text-lg border-2 border-red-300">
              ORDER CANCELLED
            </div>
          ) : (
            <div className="px-6 py-3 bg-green-100 text-green-700 rounded-full font-bold text-lg border-2 border-green-300">
              {orderStatuses[currentStatusIndex]?.label.toUpperCase()}
            </div>
          )}
        </div>

        {/* Order Status Timeline */}
        {activeOrder.status !== "cancelled" && (
          <div className="mb-12">
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 z-0"></div>
              
              {/* Progress Bar Fill */}
              <div 
                className="absolute top-6 left-0 h-1 bg-blue-500 z-0 transition-all duration-500"
                style={{ width: `${(currentStatusIndex / (orderStatuses.length - 1)) * 100}%` }}
              ></div>

              {/* Status Steps */}
              <ul className='flex justify-between relative z-10'>
                {orderStatuses.map((status, index) => (
                  <li key={status.key} className='flex flex-col items-center'>
                    {/* Circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 mb-3 transition-all duration-300 ${
                      isStatusCompleted(index) 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-white border-gray-300'
                    }`}>
                      {isStatusCompleted(index) ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={`text-sm md:text-base font-semibold text-center max-w-[120px] ${
                      isStatusCompleted(index) 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`}>
                      {status.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Cancelled Message */}
        {activeOrder.status === "cancelled" && (
          <div className="mb-12 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <h4 className="text-lg font-bold text-red-800">Order Cancelled</h4>
                <p className="text-red-600 mt-1">This order has been cancelled and will not be processed.</p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Information */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="text-lg font-semibold text-gray-800">{activeOrder.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Type</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{activeOrder.orderType}</p>
            </div>
            {activeOrder.deliveryAddress && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Delivery Address</p>
                <p className="text-lg font-semibold text-gray-800">{activeOrder.deliveryAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Order Items ({activeOrder.totalItems})
          </h3>
          
          <div className="space-y-6">
            {activeOrder.items?.map((item, index) => (
              <div key={index} className='flex gap-6 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
                {/* Item Image */}
                <div className="w-[200px] h-[200px] rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image?.url || "https://via.placeholder.com/200"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {item.name}
                  </h3>

                  <p className="text-base text-gray-600 mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-6">
                    <p className="text-lg font-semibold text-gray-700">
                      Quantity: <span className="text-[#FFA31A]">{item.quantity}</span>
                    </p>
                    <p className="text-lg font-semibold text-gray-700">
                      Price: <span className="text-[#FFA31A]">Rs. {item.price}</span>
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      Total: <span className="text-[#FFA31A]">Rs. {item.price * item.quantity}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        {activeOrder.specialInstructions && (
          <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <h4 className="text-lg font-bold text-blue-900 mb-2">Special Instructions</h4>
            <p className="text-blue-700">{activeOrder.specialInstructions}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">Rs. {activeOrder.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span className="font-semibold">Rs. {activeOrder.deliveryFee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span className="font-semibold">Rs. {activeOrder.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t-2 border-gray-300">
              <span>Total Amount</span>
              <span className="text-[#FFA31A]">Rs. {activeOrder.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOrder;