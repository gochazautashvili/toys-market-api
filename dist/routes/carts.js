"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const carts_1 = require("../controllers/carts");
const router = express_1.default.Router();
router.get("/", carts_1.getCart);
router.get("/count", carts_1.getCartCount);
router.get("/subtitle", carts_1.getCartSubtitle);
// POST
router.post("/", carts_1.addToCart);
router.post("/payment", carts_1.payment);
// PAtCH
router.patch("/update/:cartId", carts_1.updateCart);
// DELETE
router.delete("/remove/:cartId", carts_1.removeFromCart);
router.delete("/payment-success", carts_1.payment_success);
exports.default = router;
