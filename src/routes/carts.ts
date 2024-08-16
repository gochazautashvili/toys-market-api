import express, { Router } from "express";
import {
  addToCart,
  getCart,
  getCartCount,
  getCartSubtitle,
  payment,
  removeFromCart,
  updateCart,
  payment_success,
} from "../controllers/carts";

const router: Router = express.Router();

router.get("/", getCart);
router.get("/count", getCartCount);
router.get("/subtitle", getCartSubtitle);

// POST
router.post("/", addToCart);
router.post("/payment", payment);

// PAtCH
router.patch("/update/:cartId", updateCart);

// DELETE
router.delete("/remove/:cartId", removeFromCart);
router.delete("/payment-success", payment_success);

export default router;
