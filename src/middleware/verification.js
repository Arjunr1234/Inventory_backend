import jwt from 'jsonwebtoken'

export const verify = (req, res, next) => {
  try {
    const token = req.cookies?.userToken;

    if (!token) {
      res.status(401).json({ 
        success: false,
        message: "Access denied. No token provided.",
      });
      return
    }
    
 
    const secretKey = process.env.JWT_SECRET_KEY;
    const decode = jwt.verify(token, secretKey);

    req.roleId = decode.id;
       
    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error.name === "TokenExpiredError") {
       res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
      return
    }

     res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
    return
  }
};
