import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

// POST: Add a new leave request
const AddLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Find the employee based on userId
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found for the given user ID",
      });
    }

    // Create new leave
    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    return res.status(200).json({ success: true, leave: newLeave });
  } catch (error) {
    console.error("Add leave error:", error.stack || error);
    res.status(500).json({
      success: false,
      error: "Leave not added due to server error",
    });
  }
};

// GET: Fetch all leaves by userId (from Employee model)
const getLeavesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the employee using userId
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    const leaves = await Leave.find({ employeeId: employee._id });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Get leaves by user error:", error.stack || error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch leave data",
    });
  }
};

// GET: Fetch all leaves with employee and department info
const getLeave = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employeeId",
        populate: [
          { path: "userId", select: "name" },
          { path: "department", select: "dep_name" }
        ]
      });

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No leave records found",
      });
    }

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Get leave error:", error.stack || error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch leave data",
    });
  }
};

export { AddLeave, getLeavesByUser, getLeave };
