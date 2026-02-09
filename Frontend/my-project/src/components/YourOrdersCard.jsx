import React from "react";
import useAuth from "../hooks/use-auth";
const YourOrdersCard = ({ order,onClick }) => {

  const {loggedInUser} = useAuth()
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format arrival time
  const formatArrivalTime = (dateString) => {

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get first item for display (primary item)
  const primaryItem = order.items[0];
  const additionalItemsCount = order.totalItems - 1;

  return (
    <div onClick={onClick} className="w-full cursor-pointer bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      
      {/* Order Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">
              {order.restaurantName}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Order placed: {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
              {order.orderType}
            </span>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="p-5 flex gap-4 items-start">
        
        {/* Left Image */}
        <div className="w-[100px] h-[100px] rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
          <img
            src={primaryItem.image.url}
            alt={primaryItem.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Middle Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {primaryItem.name}
          </h3>

          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {primaryItem.description}
          </p>

          <div className="flex flex-wrap gap-3 text-sm">
            <p className="text-gray-700">
              Qty: <span className="font-semibold">{primaryItem.quantity}</span>
            </p>
            <p className="text-gray-700">
              Price: <span className="font-semibold">Rs. {primaryItem.price}</span>
            </p>
            {additionalItemsCount > 0 && (
              <p className="text-blue-600 font-medium">
                +{additionalItemsCount} more item{additionalItemsCount > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {order.arrivalTime && (
            <p className="text-xs text-gray-500 mt-2">
              📅 Arrival: {formatArrivalTime(order.arrivalTime)}
            </p>
          )}
        </div>

        

      </div>

      {/* Order Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total Items: <span className="font-semibold text-gray-800">{order.totalItems}</span>
        </div>
        <div className="text-lg font-bold text-gray-800">
          Rs. {order.total.toFixed(2)}
        </div>
      </div>

    </div>
  );
};

export default YourOrdersCard;