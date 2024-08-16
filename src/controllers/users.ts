import { Request, Response } from "express";
import db from "../lib/db";
import jwt from "jsonwebtoken";

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.body.userId },
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

export const create_user = async (req: Request, res: Response) => {
  try {
    const existingUser = await db.user.findUnique({
      where: { email: req.body.email },
    });

    if (!existingUser) {
      const role = req.body.email == process.env.ADMIN_EMAIL

      const user = await db.user.create({
        data: { email: req.body.email, role: role ? "ADMIN" : "USER" },
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

      return res.status(200).json(token);
    }

    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET!
    );

    return res.status(200).json(token);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};
