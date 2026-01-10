import express from "express";
import { createBusinessRole } from "../controller/business-role-controller.js";
const router = express.Router();

router.post("/create",createBusinessRole)

export default router;