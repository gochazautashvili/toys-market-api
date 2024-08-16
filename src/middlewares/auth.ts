import { NextFunction, Request, Response } from "express";
import verifyToken from "../lib/verifyToken";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res.status(404).json("Token not found");
    }

    const { userId } = verifyToken(token);

    if (!userId) {
      return res.status(404).json("User not found");
    }

    req.body.userId = userId;

    next();
  } catch (error) {
    return res.status(500).json("Internal server error auth");
  }
};

export default auth;
