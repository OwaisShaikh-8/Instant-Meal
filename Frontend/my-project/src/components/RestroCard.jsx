import React, { memo } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const RestroCard = memo(({ restaurant }) => {
  const {
    name,
    address,
    city,
    contact,
    email,
    banner,
    description,
  } = restaurant;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
      {/* Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={banner?.url}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Address */}
        <div className="flex items-start gap-2 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 text-[#FFA31A] mt-0.5" />
          <span className="line-clamp-2">
            {address}, {city}
          </span>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone className="w-4 h-4 text-blue-500" />
          <span>{contact}</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Mail className="w-4 h-4 text-purple-500" />
          <span className="truncate">{email}</span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
});

export default RestroCard;
