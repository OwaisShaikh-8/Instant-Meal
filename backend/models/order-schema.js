import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Restaurant Information
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    // Order Type
    orderType: {
      type: String,
      enum: ["delivery", "selfPickup", "dining"],
      required: true,
    },

    // Delivery Address (only for delivery orders)
    deliveryAddress: {
      type: String,
      required: function () {
        return this.orderType === "delivery";
      },
    },

    // Arrival Time (only for selfPickup and dining)
    arrivalTime: {
      type: Date,
      required: function () {
        return this.orderType === "selfPickup" || this.orderType === "dining";
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "inKitchen",
        "beingCooked",
        "ready",
        "handedToDelivery",
        "outForDelivery",
        "cancelled"
      ],
      default: "pending",
    },
    // Order Items (from cart)
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        name: String,
        description: String,
        price: Number,
        quantity: Number,
        image: {
          url: String,
          publicId: String,
        },
      },
    ],

    // Pricing Information
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },

    // Payment Screenshot
    easypaisaScreenshot: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },

    // Special Instructions
    specialInstructions: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
