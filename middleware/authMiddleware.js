// import jwt from "jsonwebtoken";
// import User from "../models/User.model.js";

// const verifyUser = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Token Not Provided" });
//     }
//     const decoded = await jwt.verify(token, process.env.JWT_KEY);
//     if (!decoded) {
//       return res.status(404).json({ success: false, error: "Token Not Valid" });
//     }

//     const user = await User.findById({ _id: decoded._id }).select("-password");
//     if (!user) {
//       return res.status(404).json({ success: false, error: "User Not Found" });
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("error:", error);
//     return res.status(404).json({ success: false, error: "Server Error" });
//   }
// };

// export default verifyUser;
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: "Token Not Provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, error: "Token Not Provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      return res.status(401).json({ success: false, error: "Token Not Valid" });
    }

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Server error in verifyUser:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export default verifyUser;
