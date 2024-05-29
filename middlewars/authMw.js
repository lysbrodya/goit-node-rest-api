import jwt, { decode } from "jsonwebtoken";

import User from "../models/user.js";

export default function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === "undefined") {
    return res.status(401).json({ message: "Not authorized" });
  }
  const [bearer, token] = authorizationHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).json({ message: "Not authorized" });
    }
    try {
      const user = await User.findById(decode.id);
      if (user === null) {
        return res.status(401).json({ message: "Not authorized" });
      }
      if (user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.user = {
        id: decode.id,
        email: decode.email,
        token: user.token,
        subscription: user.subscription,
        // id: user._id,
        // email: user.email,
      };
    } catch (error) {
      next(error);
    }

    next();
  });
}
