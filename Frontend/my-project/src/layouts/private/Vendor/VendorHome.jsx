import React, { useState } from "react";
import {
  LogOut,
  Shield,
  Users,
  ChefHat,
  Truck,
  AlertCircle,
} from "lucide-react";



import useAuth from "../../../hooks/use-auth";
const VendorHome = () => {
  const [hoveredRole, setHoveredRole] = useState(null);

  const roles = [
    {
      id: "admin",
      name: "Admin",
      icon: Shield,
      description: "Full system access and control",
    },
    {
      id: "manager",
      name: "Manager",
      icon: Users,
      description: "Oversee operations and staff",
    },
    {
      id: "chef",
      name: "Chef",
      icon: ChefHat,
      description: "Kitchen and menu management",
    },
    {
      id: "delivery",
      name: "Delivery Partner",
      icon: Truck,
      description: "Handle deliveries and logistics",
    },
  ];

  const { logoutUser, isLogoutLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#fff9f0]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <img src="" alt="" />
          <button
            onClick={() => {
              logoutUser();
            }}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-medium">
              {isLogoutLoading ? "logging out.... " : "Logout"}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 ">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Welcome to Your Business
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select your role to get started and access the tools you need
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            const isHovered = hoveredRole === role.id;

            return (
              <div
                key={role.id}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                className="group cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#FFA31A] hover:-translate-y-2"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isHovered
                        ? "bg-[#FFA31A] scale-110"
                        : "bg-slate-100 group-hover:bg-orange-100"
                    }`}
                  >
                    <Icon
                      size={40}
                      className={`transition-colors duration-300 ${
                        isHovered ? "text-white" : "text-slate-700"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {role.name}
                    </h3>
                    <p className="text-sm text-slate-600">{role.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 flex items-start space-x-4">
          <AlertCircle className="text-blue-500 flex-shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">New User?</h4>
            <p className="text-blue-800">
              If you're a new user, select <strong>Admin</strong> and use the
              key <strong>"admin"</strong>. You can update your credentials
              later in Settings.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorHome;
