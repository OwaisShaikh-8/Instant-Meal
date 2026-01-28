import React, { useState, useRef, useEffect, useMemo } from "react";
import { Menu, X, MapPin, User, Settings, LogOut, Search, ShoppingCart, Package, Home } from "lucide-react";
import Avatar from "react-avatar";
import useAuth from "../hooks/use-auth";
import useRestaurant from "../hooks/use-restaurant";




const CustomerHeader = () => {
  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [location, setLocation] = useState("sialkot");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount] = useState(3);

  const locationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const cityname = location.toLowerCase();

 const {restaurants,fetchRestaurantsByCity} = useRestaurant({city:cityname ,shouldFetchByCity:true })




 const filteredRestaurants = useMemo(() => {
  return restaurants?.filter((restaurant) =>
    restaurant.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );
}, [restaurants, search]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchRestaurantsByCity()
  }, [location])
  



  const {logoutUser, isLogoutLoading} = useAuth()
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Package, label: "Your Orders", path: "/orders" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Left side - Brand */}
            <div className="hidden md:flex items-center gap-2">
              <div className="text-[#FFA31A] font-bold text-xl">🍔 FoodHub</div>
            </div>

            {/* Right side - Location & Profile */}
            <div className="flex items-center gap-6 ml-auto">
              {/* Location Dropdown */}
              <div className="relative z-50" ref={locationRef}>
                <button
                  onClick={() => setLocationOpen(!locationOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <MapPin className="w-4 h-4 text-[#FFA31A]" />
                  <span className="text-sm hidden md:block">{location}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${locationOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {locationOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white font-semibold text-sm">
                      Select Location
                    </div>
                    {["Hyderabad", "Karachi", "Lahore", "Islamabad"].map(
                      (city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setLocation(city);
                            setLocationOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-[#FFA31A]" />
                          <span className="text-sm">{city}</span>
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative z-50" ref={profileRef}>
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <Avatar
                    name="Owais Shaikh"
                    size="38"
                    round
                    className="ring-2 ring-[#FFA31A] ring-offset-2 ring-offset-gray-800"
                  />
                </div>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <Avatar name="Owais Shaikh" size="40" round />
                        <div>
                          <p className="font-semibold text-sm">Owais Shaikh</p>
                          <p className="text-xs text-gray-500">owais@example.com</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                        <User className="w-4 h-4 text-gray-600" />
                        <span>My Profile</span>
                      </button>
                      <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span>Settings</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-200">
                      <button
                        onClick={() => logoutUser()}
                        disabled={isLogoutLoading}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isLogoutLoading ? "Logging out..." : "Logout"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>

            {/* Mobile Brand */}
            <div className="md:hidden text-[#FFA31A] font-bold text-xl">🍔 FoodHub</div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex gap-8">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.label}>
                      <a
                        href={item.path}
                        className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#FFA31A] transition-colors duration-300 group"
                      >
                        <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Search & Cart */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative" ref={searchRef}>
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors">
                  <Search className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search restaurants..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    className="bg-transparent outline-none text-gray-700 placeholder-gray-500 w-32 md:w-48"
                  />
                </div>

                {searchOpen && search && (
                  <div className="absolute right-0 mt-2 w-64 md:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto animate-fadeIn">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Search Results</p>
                    </div>
                    {filteredRestaurants.length > 0 ? (
                      filteredRestaurants.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setSearch(item);
                            setSearchOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-[#FFA31A] to-[#FF8C00] rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">🍽️</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{item}</p>
                            <p className="text-xs text-gray-500">Restaurant</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No restaurants found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slideDown">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.label}>
                    <a
                      href={item.path}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <IconComponent className="w-5 h-5 text-[#FFA31A]" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default CustomerHeader;