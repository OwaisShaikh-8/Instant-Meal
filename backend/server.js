import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
import rolesRoute from "./routes/business-role-route.js"
import cookieParser from 'cookie-parser';
const app = express();
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true // allow cookie
}));

dotenv.config();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
const URI = process.env.MONGODB_URI;

try {
  mongoose.connect(URI)
    .then(console.log("connected to mongodb"))
} catch (err) {
  console.error("Mongodb connection ", err)
}

app.use('/api/auth', userRoute)
app.use('/api/roles', rolesRoute)

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
