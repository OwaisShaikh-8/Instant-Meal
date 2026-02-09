import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  ChevronDown,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import YourOrdersCard from "../../../../components/YourOrdersCard";
import useRestaurant from "../../../../hooks/use-restaurant";
import useOrders from "../../../../hooks/use-order";
import { useNavigate } from "react-router-dom";
const ManageOrders = () => {
  const { activeRestaurant } = useRestaurant({ shouldFetchMyRestaurant: true });
  const navigate = useNavigate();
  // Get orders from the custom hook
  const { orders, isRestaurantOrdersLoading } = useOrders({
    restaurantId: activeRestaurant?._id,
    shouldFetchRestaurantOrders: true
  });
  
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedOrderType, setSelectedOrderType] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Initialize filtered orders when orders change
  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  // Filter and search logic
  useEffect(() => {
    if (!orders) return;
    
    let result = [...orders];

    // Filter by status
    if (selectedFilter !== "all") {
      result = result.filter(order => order.status === selectedFilter);
    }

    // Filter by order type
    if (selectedOrderType !== "all") {
      result = result.filter(order => order.orderType === selectedOrderType);
    }

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter(
        (order) =>
          order.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items?.some(item => 
            item.name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredOrders(result);
  }, [orders, selectedFilter, selectedOrderType, searchQuery]);

  // Calculate statistics
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === "pending").length || 0,
    confirmed: orders?.filter(o => o.status === "confirmed").length || 0,
    completed: orders?.filter(o => o.status === "completed").length || 0,
    cancelled: orders?.filter(o => o.status === "cancelled").length || 0,
    totalRevenue: orders
      ?.filter(o => o.status === "completed")
      .reduce((sum, order) => sum + order.total, 0) || 0,
  };

  const filterOptions = [
    { value: "all", label: "All Orders", icon: Package },
    { value: "pending", label: "Pending", icon: Clock },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle },
    { value: "completed", label: "Completed", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  const orderTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "delivery", label: "Delivery" },
    { value: "pickup", label: "Pickup" },
  ];

  // If no restaurant exists
  if (!activeRestaurant) {
    return (
      <div className="">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="w-8 h-8 text-gray-700" />
          <h3 className="text-3xl font-light text-gray-800">Manage Orders</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24">
            <AlertCircle className="w-16 h-16 text-orange-400 mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              No Restaurant Found
            </h4>
            <p className="text-gray-600 text-center max-w-md">
              Please create a restaurant first to manage orders
            </p>
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
          <ClipboardList className="w-8 h-8 text-gray-700" />
          <h3 className="text-3xl font-light text-gray-800">Manage Orders</h3>
        </div>
        <div className="text-sm text-gray-600">
          {activeRestaurant?.name}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-8 h-8 opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.total}</p>
          <p className="text-sm opacity-90">All Orders</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
              Pending
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.pending}</p>
          <p className="text-sm opacity-90">Awaiting Action</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
              Success
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.completed}</p>
          <p className="text-sm opacity-90">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
              Revenue
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">Rs. {stats.totalRevenue.toFixed(0)}</p>
          <p className="text-sm opacity-90">Total Earnings</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by restaurant or item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA31A] focus:border-[#FFA31A] outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all min-w-[180px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {filterOptions.find(f => f.value === selectedFilter)?.label}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-10 min-w-[200px] overflow-hidden">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedFilter(option.value);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all text-left ${
                      selectedFilter === option.value ? "bg-orange-50 text-[#FFA31A]" : "text-gray-700"
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order Type Filter */}
          <select
            value={selectedOrderType}
            onChange={(e) => setSelectedOrderType(e.target.value)}
            className="px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA31A] focus:border-[#FFA31A] outline-none transition-all bg-white"
          >
            {orderTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Display */}
        {(selectedFilter !== "all" || selectedOrderType !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedFilter !== "all" && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                {filterOptions.find(f => f.value === selectedFilter)?.label}
              </span>
            )}
            {selectedOrderType !== "all" && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {orderTypeOptions.find(f => f.value === selectedOrderType)?.label}
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Search: "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedFilter("all");
                setSelectedOrderType("all");
                setSearchQuery("");
              }}
              className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Orders List */}
      {isRestaurantOrdersLoading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-[#FFA31A] animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading orders...</p>
          </div>
        </div>
      ) : !filteredOrders || filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Found
            </h4>
            <p className="text-gray-600 text-center max-w-md">
              {searchQuery || selectedFilter !== "all" || selectedOrderType !== "all"
                ? "No orders match your current filters. Try adjusting your search."
                : "You don't have any orders yet. Orders will appear here once customers place them."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-800">{filteredOrders.length}</span> of{" "}
              <span className="font-semibold text-gray-800">{orders?.length || 0}</span> orders
            </p>
          </div>
          
          {filteredOrders.map((order) => (
            <YourOrdersCard  onClick={() => navigate(`/orderdetails/${order._id}`)}  key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;