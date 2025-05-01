import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {

  res.status(200).json({ message: "Authentication was successful" });
};

export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, payload) => {
    if (error) return res.status(403).json({ message: "Token is not valid" });
    
    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Not Authorized" });
    }
  });

  res.status(200).json({ message: "Authentication was successful" });
};
