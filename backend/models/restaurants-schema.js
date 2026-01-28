// models/Restaurant.js
import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
    
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      
    },
    address: {
      type: String,
      required: [true, "Address is required"],
     
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      
    },
    description: {
      type: String,
    },
    banner: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
    // rating: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    //   max: 5,
    // },
    // totalReviews: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for menu items
restaurantSchema.virtual("menuItems", {
  ref: "Menu",
  localField: "_id",
  foreignField: "restaurantId",
});

// Indexes
restaurantSchema.index({ userId: 1 });
restaurantSchema.index({ city: 1 });
restaurantSchema.index({ name: "text", description: "text" });

// Ensure one restaurant per user
restaurantSchema.index({ userId: 1 }, { unique: true });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
