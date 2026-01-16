// import dns from 'dns';
// dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import rolesRoute from "./routes/business-role-route.js";
import cookieParser from 'cookie-parser';
import connectDB from './config/connect-mongo.js';
const app = express();


// Set custom DNS servers

app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true // allow cookie
}));

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

const PORT = process.env.PORT || 5000;

app.use('/api/auth', userRoute);
app.use('/api/roles', rolesRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
