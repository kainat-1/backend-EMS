import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

const addSalary = async (req, res) => {
  try {
    const {
      employeeId,
      basicSalary = 0,
      allowances = 0,
      deduction = 0,
      payDate,
    } = req.body;

    if (!employeeId || !payDate) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const parsedBasicSalary = Number(basicSalary) || 0;
    const parsedAllowances = Number(allowances) || 0;
    const parsedDeduction = Number(deduction) || 0;

    const netSalary = parsedBasicSalary + parsedAllowances - parsedDeduction;

    const newSalary = new Salary({
      employeeId,
      basicSalary: parsedBasicSalary,
      allowances: parsedAllowances,
      deduction: parsedDeduction,
      netSalary,
      payDate,
    });

    await newSalary.save();
    return res
      .status(200)
      .json({ success: true, message: "Salary added successfully" });
  } catch (error) {
    console.error("Add salary error:", error.stack || error);
    res
      .status(500)
      .json({ success: false, error: "Salary not added due to server error" });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;

    let salaries = await Salary.find({ employeeId: id }).populate("employeeId");

    if (!salaries || salaries.length === 0) {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }

      salaries = await Salary.find({ employeeId: employee._id }).populate("employeeId");
    }

    return res.status(200).json({ success: true, salary: salaries });
  } catch (error) {
    console.error("Get salary error:", error.stack || error);
    res.status(500).json({ success: false, error: "Salary server error" });
  }
};

export { addSalary, getSalary };
