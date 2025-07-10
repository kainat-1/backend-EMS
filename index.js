import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import departmentRouter from "./routes/Department.js";
import employeeRouter from "./routes/employees.js";
import authRouter from "./routes/auth.js";
import salaryRouter from "./routes/salary.js";
import leaveRouter from "./routes/leave.js";
import settingRouter from "./routes/setting.js";

import connectToDatabase from "./DataBase/DB.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public/uploads", express.static("public/uploads"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leaves", leaveRouter);
app.use("/api/setting", settingRouter);

// Connect to MongoDB
connectToDatabase();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
