const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; 

  // Log the token to help troubleshoot
  console.log("Token received:", token);

  // If there's no token, return an error
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // If token verification fails, return error
    if (err) {
      console.error("Token verification error:", err); // Log the error
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach user data to the request object
    req.user = user; 
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = { verifyToken };
