import dns from 'dns';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import orderRoute from './routes/order-route.js'
import userRoute from './routes/user.route.js';
import rolesRoute from './routes/business-role-route.js';
import restaurantRoutes from './routes/restaurant-route.js';
import menuRoute from "./routes/menu-item-route.js"
import connectDB from './config/connect-mongo.js';

// Set custom DNS servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "https://instant-meal-red.vercel.app", 
  // origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DB
connectDB();

// Routes
app.use('/api/auth', userRoute);
app.use('/api/roles', rolesRoute);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoute)
app.use('/api/orders', orderRoute)

// Error handling middleware (MUST be after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Maximum size is 5MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
