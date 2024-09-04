const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Authentication token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication token missing" });
    }

    console.log("Token:", token); // Log the token for debugging

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ error: "Authentication failed" });
      }

      req.user = { id: decodedToken.userId };
      next();
    });
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};
