import jwt from "jsonwebtoken";
import db from "../models/index.js";
const User = db.User;

export default async function AuthMiddleware(req, res, next, roles = []) {
  const authHeader = req.header("Authorization");
  const [prefix, token] = authHeader?.split(" ") || [null, undefined];

  if (prefix !== "Bearer") {
    return res.status(401).json({ error: "No Bearer token" });
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: "You must be authenticated to access this resource" });
  }

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!decoded?.email) {
      return res.status(401).json({ error: "Invalid Payload" });
    }

    let user;
    try {
      user = await User.findOne({ where: { email: decoded.email } });
    } catch (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (!user || (roles.length && !roles.includes(user.role))) {
      return res.status(401).json({
        error:
          "Permission denied, you are not authorized to access this resource",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}
