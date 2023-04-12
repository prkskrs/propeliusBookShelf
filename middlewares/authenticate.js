import User from "../models/user.js";
import bigPromise from "./bigPromise.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = bigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");
//   console.log(token);
  if (!token) {
    return res.status(403).json({
      success: "false",
      message: "Login First to access this page",
    });
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decode);

  req.user = await User.findOne({ _id: decode.id });
//   console.log(req.user);

  if (!req.user) {
    return res.status(403).json({
      success: "false",
      message: "Login First to access this page",
    });
  }

  return next();
});
