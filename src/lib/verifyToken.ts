import jwt from "jsonwebtoken";

interface DecodedType {
  userId: string;
}

const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedType;

    return {
      valid: true,
      expired: false,
      userId: decoded.userId,
    };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return { valid: false, expired: true };
    }
    return { valid: false, expired: false };
  }
};

export default verifyToken;
