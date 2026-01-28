import React, { useState, useEffect } from "react";
import {
  Store,
  X,
  AlertCircle,
  CheckCircle,
  Upload,
  Plus,
  Utensils,
  MapPin,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "../../../../hooks/use-auth";
import useRestaurant from "../../../../hooks/use-restaurant";
import AddMenuItem from "../../../../components/AddMenu";

const PAKISTANI_CITIES = [
  { id: 1, name: "Karachi", province: "Sindh" },
  { id: 2, name: "Lahore", province: "Punjab" },
  { id: 3, name: "Islamabad", province: "Federal Capital" },
  { id: 4, name: "Rawalpindi", province: "Punjab" },
  { id: 5, name: "Faisalabad", province: "Punjab" },
  { id: 6, name: "Multan", province: "Punjab" },
  { id: 7, name: "Peshawar", province: "Khyber Pakhtunkhwa" },
  { id: 8, name: "Quetta", province: "Balochistan" },
  { id: 9, name: "Sialkot", province: "Punjab" },
  { id: 10, name: "Gujranwala", province: "Punjab" },
];

const restaurantSchema = z.object({
  name: z
    .string()
    .min(3, "Restaurant name must be at least 3 characters")
    .max(50, "Name too long"),
  contact: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number too long"),
  email: z.string().email("Please enter a valid email address"),
  address: z
    .string()
    .min(10, "Please provide a complete address")
    .max(200, "Address too long"),
  city: z.string().min(1, "City is required"),
  description: z.string().max(500, "Description too long").optional(),
  banner: z
    .any()
    .refine((file) => file !== null, "Please upload a banner image"),
});

const ManageRestaurant = () => {
  const { loggedInUser } = useAuth();
  const {
    createNewRestaurant,
    isCreateRestaurantLoading,
    activeRestaurant,
    isMyRestaurantLoading,
  } = useRestaurant({ shouldFetchMyRestaurant: true });
  const [bannerPreview, setBannerPreview] = useState(null);
  const [addMenuActive, setAddMenuActive] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(restaurantSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      address: "",
      city: "",
      description: "",
      banner: null,
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setValue("banner", file);
      setBannerPreview(URL.createObjectURL(file));
      trigger("banner");
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("contact", data.contact);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("description", data.description || "");
    formData.append("banner", data.banner);

    await createNewRestaurant(formData);
  };

  // Show loading state while fetching restaurant data
  if (isMyRestaurantLoading) {
    return (
      <div className="">
        <div className="flex items-center gap-3 mb-6">
          <Store className="w-8 h-8 text-gray-700" />
          <h3 className="text-3xl font-light text-gray-800">
            Manage Restaurant
          </h3>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-[#FFA31A] animate-spin mb-4" />
            <p className="text-gray-600 font-medium">
              Loading restaurant details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center gap-3 mb-6">
        <Store className="w-8 h-8 text-gray-700" />
        <h3 className="text-3xl font-light text-gray-800">Manage Restaurant</h3>
      </div>

      {!activeRestaurant ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] p-6">
            <h4 className="text-2xl font-semibold text-white mb-1">
              Create Your Restaurant
            </h4>
            <p className="text-white/90 text-sm">
              Set up your restaurant profile with essential details
            </p>
          </div>

          <div className="p-8">
            {/* Banner Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Restaurant Banner Image *
              </label>
              <div className="relative">
                {bannerPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setBannerPreview(null);
                        setValue("banner", null);
                        trigger("banner");
                      }}
                      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-600 font-medium">
                        Click to upload banner image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              {errors.banner && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.banner.message}
                </p>
              )}
            </div>

            {/* Restaurant Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Restaurant Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name *
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter restaurant name"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20"
                      } outline-none focus:ring-2 transition-all duration-300`}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <Controller
                  name="contact"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      placeholder="Enter contact number"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.contact
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20"
                      } outline-none focus:ring-2 transition-all duration-300`}
                    />
                  )}
                />
                {errors.contact && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.contact.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="restaurant@example.com"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20"
                      } outline-none focus:ring-2 transition-all duration-300`}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter complete address"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.address
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20"
                      } outline-none focus:ring-2 transition-all duration-300`}
                    />
                  )}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>

              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.city
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20"
                    } outline-none focus:ring-2 transition-all duration-300 bg-white`}
                  >
                    <option value="">Select a city</option>
                    {PAKISTANI_CITIES.map((city) => (
                      <option key={city.id} value={city.name.toLowerCase()}>
                        {city.name} - {city.province}
                      </option>
                    ))}
                  </select>
                )}
              />

              {errors.city && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Tell customers about your restaurant..."
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FFA31A] focus:ring-2 focus:ring-[#FFA31A]/20 outline-none transition-all duration-300 resize-none"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isValid || isCreateRestaurantLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300
                ${
                  !isValid || isCreateRestaurantLoading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white hover:shadow-lg hover:scale-[1.02]"
                }`}
            >
              {isCreateRestaurantLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Restaurant...
                </>
              ) : (
                <>
                  <Store className="w-5 h-5" />
                  Create Restaurant
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        // <div className="space-y-6">
        //   {/* Restaurant Details Card */}
        //   <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        //     {/* Banner Image */}
        //     {activeRestaurant && (
        //       <div className="relative h-64 overflow-hidden">

        //         <img
        //           src={activeRestaurant.data.banner.url}
        //           alt="Restaurant banner"
        //           className="w-full h-full object-cover"
        //         />
        //         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        //         <div className="absolute bottom-6 left-6">
        //           <h2 className="text-3xl font-bold text-white mb-1">
        //             {activeRestaurant.data.name}
        //           </h2>
        //           <div className="flex items-center gap-2">
        //             <div className="bg-green-500 px-3 py-1 rounded-full">
        //               <span className="text-xs font-medium text-white flex items-center gap-1">
        //                 <CheckCircle className="w-3 h-3" />
        //                 Active
        //               </span>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     )}

        //     {/* Restaurant Info */}
        //     <div className="p-8">
        //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        //         <div className="flex items-start gap-3">
        //           <div className="bg-blue-100 p-2 rounded-lg">
        //             <Phone className="w-5 h-5 text-blue-600" />
        //           </div>
        //           <div>
        //             <p className="text-xs text-gray-500 mb-1">Contact</p>
        //             <p className="text-gray-800 font-semibold">
        //               {activeRestaurant?.data.contact}
        //             </p>
        //           </div>
        //         </div>

        //         <div className="flex items-start gap-3">
        //           <div className="bg-purple-100 p-2 rounded-lg">
        //             <Mail className="w-5 h-5 text-purple-600" />
        //           </div>
        //           <div>
        //             <p className="text-xs text-gray-500 mb-1">Email</p>
        //             <p className="text-gray-800 font-semibold">
        //               {activeRestaurant?.data.email}
        //             </p>
        //           </div>
        //         </div>

        //         <div className="flex items-start gap-3 md:col-span-2">
        //           <div className="bg-green-100 p-2 rounded-lg">
        //             <MapPin className="w-5 h-5 text-green-600" />
        //           </div>
        //           <div>
        //             <p className="text-xs text-gray-500 mb-1">Address</p>
        //             <p className="text-gray-800 font-semibold">
        //               {activeRestaurant?.data.address}
        //             </p>
        //           </div>
        //         </div>

        //         {activeRestaurant?.data.description && (
        //           <div className="md:col-span-2">
        //             <p className="text-xs text-gray-500 mb-2">Description</p>
        //             <p className="text-gray-700 leading-relaxed">
        //               {activeRestaurant.data.description}
        //             </p>
        //           </div>
        //         )}
        //       </div>
        //     </div>
        //   </div>

        //   {/* Add Menu Section */}
        //   <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200">
        //     <div className="flex items-start gap-4">
        //       <div className="bg-[#FFA31A] p-3 rounded-xl">
        //         <Utensils className="w-6 h-6 text-white" />
        //       </div>
        //       <div className="flex-1">
        //         <h4 className="text-xl font-semibold text-gray-800 mb-2">
        //           Menu Management
        //         </h4>
        //         <p className="text-gray-600 mb-4">
        //           Your restaurant is ready! Now you can add menu items,
        //           categories, and manage your offerings.
        //         </p>
        //         <button
        //           onClick={() => setAddMenuActive(true)}
        //           className="flex items-center gap-2 bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
        //         >
        //           <Plus className="w-5 h-5" />
        //           Add Menu Items
        //         </button>
        //       </div>
        //     </div>
        //   </div>

        //   {/* Info Box */}
        //   <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        //     <div className="flex items-start gap-3">
        //       <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        //       <div>
        //         <p className="text-sm font-medium text-blue-900 mb-1">
        //           Restaurant Successfully Created
        //         </p>
        //         <p className="text-xs text-blue-700">
        //           You can now manage your menu items, view orders, and update
        //           restaurant details anytime.
        //         </p>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div className="space-y-6">
          {/* Restaurant Details Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Banner Image */}
            {activeRestaurant && (
              <div className="relative h-64 overflow-hidden">
                <img
                  src={activeRestaurant.data.banner.url}
                  alt="Restaurant banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {activeRestaurant.data.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-white flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this restaurant? This action cannot be undone.",
                      )
                    ) {
                      // Call your delete function here
                      // deleteRestaurant(activeRestaurant.data._id);
                    }
                  }}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 gap-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center group"
                  title="Delete Restaurant"
                >
                  Delete
                </button>
              </div>
            )}

            {/* Restaurant Info */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Contact</p>
                    <p className="text-gray-800 font-semibold">
                      {activeRestaurant?.data.contact}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-gray-800 font-semibold">
                      {activeRestaurant?.data.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-gray-800 font-semibold">
                      {activeRestaurant?.data.address}
                    </p>
                  </div>
                </div>

                {activeRestaurant?.data.description && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-2">Description</p>
                    <p className="text-gray-700 leading-relaxed">
                      {activeRestaurant.data.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

         

<AddMenuItem/>
       
        </div>
      )}
    </div>
  );
};

export default ManageRestaurant;
