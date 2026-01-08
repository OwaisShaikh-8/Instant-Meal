import express from "express";
import { allUsers, login, logout, registerCustomer, registerVendor } from "../controller/user.controller.js";
const router = express.Router();

router.post('/customersignin',registerCustomer)
router.post('/vendorsignin',registerVendor)
router.post('/login',login)
router.post('/logout',logout)
router.get('/allusers',allUsers)

export default router;