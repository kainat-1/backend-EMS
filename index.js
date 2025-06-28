import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import departmentRouter from "./routes/Department.js";
import authRouter from "./routes/auth.js";
import { connect } from "mongoose";
import connectToDatabase from "./DataBase/DB.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);


// ✅ Connect to MongoDB
connectToDatabase();

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
