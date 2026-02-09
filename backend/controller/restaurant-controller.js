// controllers/restaurantController.js
import Restaurant from "../models/restaurants-schema.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";

/* ============================
   CREATE RESTAURANT
============================ */
// @desc    Create a new restaurant
// @route   POST /api/restaurants/create
// @access  Private
export const createRestaurant = async (req, res) => {
  try {
    const { name, contact, email, address, city, description } = req.body;

    // Logged-in user from auth middleware
    const userId = req.user._id;

    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ userId });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "You already have a restaurant registered",
      });
    }

    // Banner validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a banner image",
      });
    }

    const restaurant = await Restaurant.create({
      name,
      contact,
      email,
      address,
      city: city.toLowerCase(),
      description,
      userId,
      banner: {
        public_id: req.file.filename,
        url: req.file.path,
      },
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);

    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }

    res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
    });
  }
};

/* ============================
   GET MY RESTAURANT (NEW ✅)
============================ */
// @desc    Get logged-in user's restaurant
// @route   GET /api/restaurants/my
// @access  Private
export const getMyRestaurant = async (req, res) => {
  try {
    const activeRestaurant = await Restaurant.findOne({
      userId: req.user._id,
    });

    if (!activeRestaurant) {
      return res.status(404).json({
        success: false,
        message: "No restaurant found for this user",
      });
    }

    res.status(200).json({
      success: true,
      activeRestaurant,
    });
  } catch (error) {
    console.error("Get my restaurant error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant",
    });
  }
};

/* ============================
   GET RESTAURANT BY USER ID
============================ */
// @desc    Get restaurant by user ID
// @route   GET /api/restaurants/user/:userId
// @access  Public / Admin

export const getRestaurantsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const restaurants = await Restaurant.find({
      city: city.toLowerCase(),
      // isActive: true,
    }).sort({ createdAt: -1 });

    if (!restaurants.length) {
      return res.status(404).json({
        success: false,
        message: `No restaurants found in ${city}`,
      });
    }

    res.status(200).json({
      success: true,
      restaurants,
    });
  } catch (error) {
    console.error("Get restaurants by city error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants by city",
    });
  }
};






export const getRestaurantByUserId = async (req, res) => {
  
  try {
    const restaurant = await Restaurant.findOne({
      userId: req.params.userId,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      activeRestaurant: restaurant,
    });
  } catch (error) {
    console.error("Get restaurant error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant",
    });
  }
};

/* ============================
   DELETE RESTAURANT
============================ */
// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Authorization check
    if (restaurant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this restaurant",
      });
    }

    await deleteFromCloudinary(restaurant.banner.public_id);
    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Delete restaurant error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete restaurant",
    });
  }
};

/* ============================
   GET ALL RESTAURANTS
============================ */
// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getAllRestaurants = async (req, res) => {
  try {
    const { city, search, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (city) query.city = city.toLowerCase();
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Restaurant.countDocuments(query);

    res.status(200).json({
      success: true,
      data: restaurants,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants",
    });
  }
};

/* ============================
   GET RESTAURANT BY ID
============================ */
// @desc    Get restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res) => {
  console.log("getbyid hit")
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Get restaurant by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant",
    });
  }
};
