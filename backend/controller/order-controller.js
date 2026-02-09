import Order from "../models/order-schema.js";

// Create a new order
export const createOrder = async (req, res) => {
    console.log("create order hit")
  try {
    const {
      restaurantId,
      restaurantName,
      customerId,
      customerName,
      orderType,
      deliveryAddress,
      arrivalTime,
      subtotal,
      deliveryFee,
      tax,
      total,
      totalItems,
      specialInstructions,
      items, // JSON string from cart
    } = req.body;

    // Get the uploaded file from multer (already uploaded to Cloudinary)
    const easypaisaScreenshot = req.file;

    // Validate required fields
    if (!restaurantId || !orderType || !easypaisaScreenshot) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate order type specific fields
    if (orderType === "delivery" && !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required for delivery orders",
      });
    }

    if (
      (orderType === "selfPickup" || orderType === "dining") &&
      !arrivalTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Arrival time is required for pickup/dining orders",
      });
    }

    // Parse items from JSON string
    let parsedItems;
    try {
      parsedItems = JSON.parse(items);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid items format",
      });
    }

    // Create order object
    const orderData = {
      restaurantId,
      restaurantName,
      customerId,
      customerName,
      orderType,
      items: parsedItems,
      subtotal: parseFloat(subtotal),
      deliveryFee: parseFloat(deliveryFee),
      tax: parseFloat(tax),
      total: parseFloat(total),
      totalItems: parseInt(totalItems),
      easypaisaScreenshot: {
        url: easypaisaScreenshot.path, // Cloudinary URL
        publicId: easypaisaScreenshot.filename, // Cloudinary public_id
      },
      specialInstructions: specialInstructions || "",
    };

    // Add order type specific fields
    if (orderType === "delivery") {
      orderData.deliveryAddress = deliveryAddress;
    } else {
      orderData.arrivalTime = new Date(arrivalTime);
    }

    // Create and save order
    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "restaurantId",
      "name area city phone image"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Get customer orders
export const getCustomerOrders = async (req, res) => {
  console.log('get route hit')
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customerId })
      .populate("restaurantId", "name area city phone image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer orders",
      error: error.message,
    });
  }
};

// Get restaurant orders
export const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const orders = await Order.find({ restaurantId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant orders",
      error: error.message,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  console.log("updateOrderStatus hit");
  
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(status)
    console.log(orderId)
    
    // Validate orderId
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Validate status - matching your schema enum exactly
    const validStatuses = [
      "pending",
      "accepted",
      "inKitchen",
      "beingCooked",
      "ready",
      "handedToDelivery",
      "outForDelivery",
      "cancelled"
    ];
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Valid statuses: ${validStatuses.join(", ")}`,
      });
    }

    // Find the order first to validate business logic
    const existingOrder = await Order.findById(orderId);
    
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Business logic validations based on order type
    if (existingOrder.orderType !== "delivery") {
      // For selfPickup and dining, prevent delivery-related statuses
      if (["handedToDelivery", "outForDelivery"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot set status to '${status}' for ${existingOrder.orderType} orders`,
        });
      }
    }

    // Prevent changing status if already cancelled
    if (existingOrder.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot change status of a cancelled order",
      });
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    ).populate("restaurantId", "name area city phone image address");

    // Log status change
    console.log(`Order ${orderId} status changed from ${existingOrder.status} to ${status}`);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("Update order status error:", error);
    
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

// Get all orders (admin/internal use)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("restaurantId", "name area city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export default {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
};