import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "supersecret";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized." });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden." });
    req.user = decoded;
    next();
  });
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden." });
    }
    next();
  };
}
