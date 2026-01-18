import React, { memo } from 'react';
import { MapPin, Star, Clock, Bike, TrendingUp } from 'lucide-react';

const RestroCard = memo(({ image, name, address, rating, deliveryTime, cuisines, promoted }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
    <div className="relative h-48 overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {promoted && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Promoted
        </div>
      )}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-semibold">{rating}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <div className="flex items-center gap-2 text-white text-sm">
          <Clock className="w-4 h-4" />
          <span>{deliveryTime}</span>
          <span className="mx-2">•</span>
          <Bike className="w-4 h-4" />
          <span>Rs.50</span>
        </div>
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#FFA31A] transition-colors">
        {name}
      </h3>
      <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#FFA31A]" />
        <span className="line-clamp-1">{address}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {cuisines.map((cuisine, idx) => (
          <span 
            key={idx}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
          >
            {cuisine}
          </span>
        ))}
      </div>
    </div>
  </div>
));

export default RestroCard;
