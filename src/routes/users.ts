import express, { Router } from "express";
import { create_user, getUser } from "../controllers/users";
import auth from "../middlewares/auth";

const router: Router = express.Router();

router.get("/", auth, getUser);
router.post("/", create_user);

export default router;
