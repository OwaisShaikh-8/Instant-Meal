import React, { useState } from 'react';
import { MapPin, Star, Clock, Bike, TrendingUp, Flame, Search, Filter } from 'lucide-react';
import CustomerHeader from "../../../components/CustomerHeader.jsx"
import RestroCard from '../../../components/RestroCard.jsx';


const DealsMarque = () => (
  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 overflow-hidden">
    <div className="animate-marquee whitespace-nowrap">
      <span className="mx-8">🔥 50% OFF on First Order!</span>
      <span className="mx-8">⚡ Free Delivery on Orders Above Rs.500</span>
      <span className="mx-8">🎉 Buy 1 Get 1 Free on Selected Items</span>
      <span className="mx-8">🍕 Special Weekend Deals Available</span>
    </div>
  </div>
);




const Customer = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const restroDeals = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      name: "Food Street Restaurant",
      address: "Shahrah-e-Faisal, Karachi",
      rating: 4.5,
      deliveryTime: "25-30 min",
      cuisines: ["Pakistani", "BBQ", "Fast Food"],
      promoted: true,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
      name: "BBQ Tonight",
      address: "Clifton Block 5, Karachi",
      rating: 4.8,
      deliveryTime: "30-35 min",
      cuisines: ["BBQ", "Grill", "Pakistani"],
      promoted: false,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1541542684-4a6d8e6c7c0f",
      name: "Kolachi Restaurant",
      address: "Do Darya, Phase 8, Karachi",
      rating: 4.6,
      deliveryTime: "35-40 min",
      cuisines: ["Pakistani", "Chinese", "Continental"],
      promoted: true,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      name: "Tuscany Courtyard",
      address: "Zamzama Boulevard, Karachi",
      rating: 4.7,
      deliveryTime: "20-25 min",
      cuisines: ["Italian", "Continental"],
      promoted: false,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
      name: "Student Biryani",
      address: "Multiple Locations, Karachi",
      rating: 4.4,
      deliveryTime: "15-20 min",
      cuisines: ["Biryani", "Pakistani", "Fast Food"],
      promoted: false,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      name: "Café Aylanto",
      address: "Main Clifton, Karachi",
      rating: 4.9,
      deliveryTime: "30-35 min",
      cuisines: ["Continental", "Mediterranean"],
      promoted: true,
    },
  ];

  const categories = [
    { id: 'all', label: 'All', icon: '🍽️' },
    { id: 'fast', label: 'Fast Food', icon: '🍔' },
    { id: 'bbq', label: 'BBQ', icon: '🍗' },
    { id: 'pakistani', label: 'Pakistani', icon: '🍛' },
    { id: 'italian', label: 'Italian', icon: '🍕' },
  ];

   const filteredRestaurants = useMemo(() => {
    return restroDeals.filter(restro => {
      const matchesSearch = restro.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
        restro.cuisines.some(c => c.toLowerCase().includes(filter.toLowerCase()));
      return matchesSearch && matchesFilter;
    });
  }, [restroDeals, filter, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <CustomerHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#FFA31A] to-[#FF8C00] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg">Hot Deals Today</span>
            </div>
            <h1 className="font-bold text-4xl md:text-6xl text-white mb-4 leading-tight">
              Order Your Favorite<br />Food in Minutes
            </h1>
            <p className="text-white/90 text-lg mb-8">
              Discover the best restaurants near you with amazing deals and fast delivery
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl flex items-center gap-3 max-w-2xl">
              <Search className="w-6 h-6 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search for restaurants or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-gray-700 text-lg py-2"
              />
              <button className="bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <DealsMarque />

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
                filter === cat.id
                  ? 'bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Top Restaurants Near You
            </h2>
            <p className="text-gray-600">
              {filteredRestaurants.length} restaurants found
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-[#FFA31A] transition-colors">
            <Filter className="w-5 h-5" />
            <span className="hidden md:inline">Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restro) => (
            <RestroCard
              key={restro.id}
              image={restro.image}
              name={restro.name}
              address={restro.address}
              rating={restro.rating}
              deliveryTime={restro.deliveryTime}
              cuisines={restro.cuisines}
              promoted={restro.promoted}
            />
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Customer;