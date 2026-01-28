import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    category: {
      type: String,
      required: true,
      lowercase: true,
      enum: [
        "appetizers",
        "main course",
        "desserts",
        "beverages",
        "fast food",
        "traditional",
        "bbq & grills",
        "seafood",
        "vegetarian",
        "breakfast",
      ],
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },

    available: {
      type: Boolean,
      default: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);