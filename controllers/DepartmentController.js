import Department from "../models/Department.js";

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "got department server error" });
  }
};
const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    const newDep = new Department({
      dep_name,
      description,
    });

    await newDep.save();

    return res.status(200).json({ success: true, department: newDep });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Add department server error" });
  }
};
const editDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id });
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "got department server error" });
  }
};
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid department ID" });
    }

    const updatedDep = await Department.findByIdAndUpdate(
      id,
      { dep_name, description },
      { new: true }
    );

    if (!updatedDep) {
      return res
        .status(404)
        .json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department: updatedDep });
  } catch (error) {
    console.error("updateDepartment error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Update department server error" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDep = await Department.findByIdAndDelete({ _id: id });
    return res.status(200).json({ success: true, deleteDep });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error Deleting department " });
  }
};
export {
  addDepartment,
  getDepartments,
  editDepartment,
  updateDepartment,
  deleteDepartment,
};
