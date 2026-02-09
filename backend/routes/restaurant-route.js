// routes/restaurantRoutes.js
import express from "express";
import {
  createRestaurant,
  getRestaurantByUserId,
  getRestaurantsByCity,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant, // 👈 add this if not already
} from "../controller/restaurant-controller.js";

import { upload } from "../config/cloudinary.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

/* ======================
   🌍 Public Routes
====================== */

router.post("/create", protect, upload.single("banner"), createRestaurant);
router.get("/getmyrestaurant", protect, getMyRestaurant);
router.get("/getrestaurantsbycity/:city", getRestaurantsByCity)
// router.get("/", getAllRestaurants);
// Get restaurant by userId (admin / public use-case)

// router.get("/user/:userId", getRestaurantByUserId);

// Get restaurant by restaurantId
router.get("/:id", getRestaurantById);

/* ======================
   🔐 Protected Routes
====================== */

// Get logged-in user's restaurant

// Create restaurant (logged-in user)

// Update restaurant

// Delete restaurant
router.delete("/:id", protect, deleteRestaurant);

export default router;
