import status from "http-status";
import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const secretKey = process.env.SYSTEM_SECRET_KEY;
    const whiteList = [
      "/attendances",
      "/attendances/add",
      "/auth/login",
      "/auth/signup",
    ];

    if (whiteList.includes(req.path)) {
      return next();
    }

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];

      if (token) {
        jwt.verify(token, secretKey, (err, verifiedToken) => {
          if (err) {
            return res
              .status(status.FORBIDDEN)
              .json({ message: "Invalid token" });
          }
          res.locals.userId = verifiedToken.userId;
          next();
        });
      } else {
        return res.status(status.FORBIDDEN).json({ message: "Invalid token" });
      }
    } else {
      return res.status(status.FORBIDDEN).json({ message: "Invalid token" });
    }
  } catch (e) {
    throw new Error(e);
  }
};

export default authenticate;
