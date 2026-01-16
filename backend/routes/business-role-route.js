import express from "express";
import { createBusinessRole, getBusinessRoleByUser, verifyRoleSecretKey } from "../controller/business-role-controller.js";
const router = express.Router();

router.post("/create", createBusinessRole)
router.get("/get", getBusinessRoleByUser)
router.post("/verifyrole", verifyRoleSecretKey)
export default router;