import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { AddLeave } from "../controllers/leaveController.js";
import mongoose from "mongoose";



const router = express.Router();
router.post("/add", authMiddleware, AddLeave);


export default router;
