import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  AddLeave,
  getLeavesByUser,
  getLeave,
  getLeavesDetails,
  UpdateLeave,
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/add", authMiddleware, AddLeave);
router.get("/:userId", authMiddleware, getLeavesByUser);
router.put("/:id", authMiddleware, UpdateLeave);

router.get("/detail/:id", authMiddleware, getLeavesDetails);
router.get("/", authMiddleware, getLeave);

export default router;
