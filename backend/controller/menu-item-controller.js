import MenuItem from "../models/menu-item-schema.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * Add a new menu item
 */
export const addMenuItem = async (req, res) => {
  console.log("menu route hit")
  try {
    const { name, price, category, description, available } = req.body;
    const { restaurantId } = req.params;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ 
        success: false,
        message: "Name, price, and category are required" 
      });
    }

    // Validate image
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "Image is required" 
      });
    }

    // Validate price
    if (price <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Price must be greater than 0" 
      });
    }

    const menuItem = await MenuItem.create({
      name,
      price,
      category,
      description,
      available: available !== undefined ? available : true,
      image: {
        url: req.file.path, // Cloudinary URL
        publicId: req.file.filename, // Cloudinary public_id
      },
      restaurant: restaurantId,
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
    });
  } catch (error) {
    // Delete uploaded image if menu item creation fails
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error: " + error.message 
    });
  }
};

/**
 * Get all menu items for a restaurant
 */
export const getMenuItems = async (req, res) => {
  console.log("getmenuhit")
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10, category, available } = req.query;

    // Build filter query
    const filter = { restaurant: restaurantId };
    
    if (category) {
      filter.category = category;
    }
    
    if (available !== undefined) {
      filter.available = available === "true";
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get items with pagination
    const menuItems = await MenuItem.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination info
    const total = await MenuItem.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: menuItems.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      menuItems,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error: " + error.message 
    });
  }
};

/**
 * Get a single menu item by ID
 */
export const getMenuItem = async (req, res) => {
  try {
    const { restaurantId, id } = req.params;
    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Menu item not found" 
      });
    }

    // Check restaurant ownership
    if (item.restaurant.toString() !== restaurantId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access" 
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid menu item ID" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error: " + error.message 
    });
  }
};

/**
 * Update a menu item
 */
export const updateMenuItem = async (req, res) => {
  try {
    const { name, price, category, description, available } = req.body;
    const { restaurantId, id } = req.params;
    
    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Menu item not found" 
      });
    }

    // Check restaurant ownership
    if (item.restaurant.toString() !== restaurantId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access" 
      });
    }

    // Validate price if provided
    if (price !== undefined && price <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Price must be greater than 0" 
      });
    }

    // Update fields if provided
    if (name) item.name = name;
    if (price) item.price = price;
    if (category) item.category = category;
    if (description !== undefined) item.description = description;
    if (available !== undefined) item.available = available;
    
    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary
      if (item.image && item.image.publicId) {
        try {
          await cloudinary.uploader.destroy(item.image.publicId);
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err);
        }
      }
      
      // Update with new image
      item.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: item,
    });
  } catch (error) {
    // Delete uploaded image if update fails
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }

    if (error.name === "CastError") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid menu item ID" 
      });
    }
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error: " + error.message 
    });
  }
};

/**
 * Delete a menu item
 */
export const deleteMenuItem = async (req, res) => {
  try {
    const { restaurantId, id } = req.params;
    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Menu item not found" 
      });
    }

    // Check restaurant ownership
    if (item.restaurant.toString() !== restaurantId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access" 
      });
    }

    // Delete image from Cloudinary
    if (item.image && item.image.publicId) {
      try {
        await cloudinary.uploader.destroy(item.image.publicId);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
        // Continue with deletion even if image deletion fails
      }
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid menu item ID" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error: " + error.message 
    });
  }
};

/**
 * Toggle menu item availability
 */
export const toggleAvailability = async (req, res) => {
  try {
    const { restaurantId, id } = req.params;
    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Menu item not found" 
      });
    }

    // Check restaurant ownership
    if (item.restaurant.toString() !== restaurantId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access" 
      });
    }

    item.available = !item.available;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Menu item is now ${item.available ? "available" : "unavailable"}`,
      data: item,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid menu item ID" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error: " + error.message 
    });
  }
};

/**
 * Get menu items by category
 */
export const getMenuItemsByCategory = async (req, res) => {
  try {
    const { restaurantId, category } = req.params;

    const items = await MenuItem.find({
      restaurant: restaurantId,
      category,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      category,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error: " + error.message 
    });
  }
};