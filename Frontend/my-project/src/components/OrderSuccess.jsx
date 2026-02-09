import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Home, Receipt, Clock } from "lucide-react";
import CustomerHeader from "../components/CustomerHeader";

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Auto-redirect after some time
    const timer = setTimeout(() => {
      navigate("/customerhome");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="text-green-600" size={48} />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your delicious food is being prepared and
            will be delivered soon!
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="font-semibold">
                  #{Math.floor(Math.random() * 100000)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Estimated Time</p>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#FFA31A]" />
                  <p className="font-semibold">30-45 mins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/customer/orders")}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-[#FFA31A] text-white rounded-lg font-semibold hover:bg-[#FF8C00] transition"
            >
              <Receipt size={20} />
              Track Order
            </button>
            <button
              onClick={() => navigate("/customer")}
              className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              <Home size={20} />
              Back to Home
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t text-sm text-gray-500">
            <p>
              You will receive a confirmation email/SMS with your order details
              shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;