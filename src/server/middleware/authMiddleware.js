const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const cookieToken = req.cookies?.token;
  const token = (authHeader && authHeader.split(" ")[1]) || cookieToken;


  console.log("Token:", token);

  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;

    console.log("Decoded user from token:", user);

    next();
  });
}


module.exports = authenticateToken;
