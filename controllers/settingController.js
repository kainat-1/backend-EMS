import bcrypt from "bcrypt";
import User from "../models/User.model.js"; 

const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Use User model (capital U) to find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong Password" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, { password: hashPassword });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ success: false, error: "Setting error" });
  }
};

export { changePassword };
