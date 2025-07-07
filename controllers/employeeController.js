import multer from "multer";
import path from "path";
import Employee from "../models/Employee.js";
import User from "../models/User.model.js";
import Department from "../models/Department.js";
import bcrypt from "bcrypt";

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Add employee
const addEmployee = async (req, res) => {
  try {
    const { name, email, employeeId, dob, department, salary, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });

    const savedUser = await newUser.save();

    // Create new employee
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      department,
      salary,
    });

    await newEmployee.save();

    return res.status(200).json({ success: true, message: "Employee created successfully" });
  } catch (error) {
    console.error("Add employee error:", error);
    return res.status(500).json({ success: false, error: "Server error in adding employee" });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get employees server error" });
  }
};

// Get single employee by ID
const getEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id)
      .populate("userId", { password: 0 })
      .populate("department");

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get employee server error" });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, salary } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee Not Found" });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    // Update user
    const userUpdateData = { name };
    if (req.file) {
      userUpdateData.profileImage = req.file.filename;
    }

    await User.findByIdAndUpdate(user._id, userUpdateData);
    await Employee.findByIdAndUpdate(id, { department, salary });

    return res.status(200).json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error("Update employee error:", error);
    return res.status(500).json({ success: false, error: "Update failed, employee server error" });
  }
};

// Get employees by department ID
const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;

  try {
    const employees = await Employee.find({ department: id }).populate("userId").populate("department");

    if (!employees || employees.length === 0) {
      return res.status(404).json({ success: false, error: "No employees found in this department" });
    }

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Fetch employees by department error:", error);
    return res.status(500).json({ success: false, error: "get employee server error" });
  }
};

export { addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId };
