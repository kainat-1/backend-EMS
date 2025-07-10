import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { AddLeave, getLeavesByUser, getLeave } from "../controllers/leaveController.js";

const router = express.Router();

router.post("/add", authMiddleware, AddLeave);
router.get("/:userId", authMiddleware, getLeavesByUser);
router.get("/", authMiddleware, getLeave);

export default router;
