import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", authMiddleware, getEmployees);
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId);
router.post("/add", authMiddleware, upload.single("image"), addEmployee);
router.get("/:id", authMiddleware, getEmployee);
router.put("/:id", authMiddleware, upload.single("image"), updateEmployee);

export default router;
