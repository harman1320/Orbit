import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "JWT token missing" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticateUser;
