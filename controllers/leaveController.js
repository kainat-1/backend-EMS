import Leave from "../models/Leave.js"; 

const AddLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    const newLeave = new Leave({
      employeeId: userId,
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

export { AddLeave };
