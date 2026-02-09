import express from "express";
import {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
} from "../controller/order-controller.js";
import { upload } from "../config/cloudinary.js"; // Your multer middleware
// import { authenticate } from "../middleware/auth.js"; // Your auth middleware (if needed)

const router = express.Router();

// Create order (with file upload for easypaisa screenshot)
router.post("/create", upload.single("easypaisaScreenshot"), createOrder);

// Get customer orders
router.get("/customer/:customerId", getCustomerOrders);

// Get restaurant orders
router.get("/restaurant/:restaurantId", getRestaurantOrders);

// Get order by ID
router.get("/:orderId", getOrderById);

// Update order status
router.patch("/:orderId/status", updateOrderStatus);

// Delete order
router.delete("/:orderId", deleteOrder);

// Get all orders (admin)
router.get("/", getAllOrders);

export default router;