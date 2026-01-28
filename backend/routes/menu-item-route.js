import express from 'express';
import { 
  addMenuItem, 
  getMenuItems, 
  getMenuItem,
  deleteMenuItem,
  toggleAvailability,
} from '../controller/menu-item-controller.js';
import { protect } from '../middleware/auth-middleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router({ mergeParams: true }); // Important for nested routes

// POST - Create new menu item with image
router.post('/createmenuitem/:restaurantId', protect, upload.single('image'), addMenuItem);

// GET - Get all menu items for restaurant (with pagination & filters)
router.get('/getmenuitems/:restaurantId', protect, getMenuItems);

// GET - Get menu items by category

// GET - Get single menu item by ID
router.get('/:restaurantId/:id', protect, getMenuItem);

// PATCH - Toggle availability
router.patch('/:restaurantId/:id/toggle-availability', protect, toggleAvailability);

// DELETE - Delete menu item
router.delete('/:restaurantId/:id', protect, deleteMenuItem);

export default router;
