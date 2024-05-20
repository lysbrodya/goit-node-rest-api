import jwt, { decode } from "jsonwebtoken";

// import User from "../models/user.js";

// export default function auth(req, res, next) {
//   const authorizationHeader = req.headers.authorization;
//   if (typeof authorizationHeader === "undefined") {
//     // console.log(authorizationHeader);
//     return res.status(401).json({ message: "Invalid token" });
//   }
//   const [bearer, token] = authorizationHeader.split(" ", 2);
//   console.log({ bearer, token });
//   if (bearer !== "Bearer") {
//     return res.status(401).json({ message: "Invalid token" });
//   }
//   jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
//     if (err) {
//       return res.status(401).json({ message: "Invalid" });
//     }

//     try {
//       const user = await User.findById(decode.id);
//       if (user === null) {
//         return res.status(401).json({ message: "Invalid token" });
//       }

//       if (user.token !== token) {
//         return res.status(401).json({ message: "Invalid token" });
//       }
//       console.log({ decode });

//       req.user = {
//         id: decode.id,
//         name: decode.name,
//       };
//     } catch (error) {
//       next(error);
//     }
//     next();
//   });
// }
export default function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === "undefined") {
    return res.status(401).json({ message: "Not authorized" });
  }
  const [bearer, token] = authorizationHeader.split(" ", 2);
  console.log({ bearer, token });
  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // console.log({ decode });
    req.user = {
      id: decode.id,
      email: decode.email,
    };
    next();
  });
}
