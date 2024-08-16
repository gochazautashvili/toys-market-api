"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payment_success = exports.payment = exports.updateCart = exports.removeFromCart = exports.addToCart = exports.getCartSubtitle = exports.getCartCount = exports.getCart = void 0;
const stripe_1 = require("stripe");
const db_1 = __importDefault(require("../lib/db"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const carts = yield db_1.default.cart.findMany({
            where: { userId },
            include: { toy: true },
        });
        return res.status(200).json(carts);
    }
    catch (error) {
        return res.status(500).json("Internal server error");
    }
});
exports.getCart = getCart;
const getCartCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const cartCount = yield db_1.default.cart.count({
            where: { userId },
        });
        return res.status(200).json(cartCount);
    }
    catch (error) {
        return res.status(500).json("Internal server error");
    }
});
exports.getCartCount = getCartCount;
const getCartSubtitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const cart = yield db_1.default.cart.findMany({
            where: { userId },
            include: { toy: true },
        });
        let sum = 0;
        for (let i = 0; i < cart.length; i++) {
            sum += cart[i].toy.price * cart[i].quantity;
        }
        return res.status(200).json(sum);
    }
    catch (error) {
        return res.status(500).json("Internal server error");
    }
});
exports.getCartSubtitle = getCartSubtitle;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, toyId } = req.body;
        const alreadyInCart = yield db_1.default.cart.findFirst({
            where: { userId, toyId },
        });
        if (alreadyInCart) {
            yield db_1.default.cart.update({
                where: { id: alreadyInCart.id },
                data: { quantity: { increment: 1 } },
            });
        }
        else {
            yield db_1.default.cart.create({
                data: {
                    quantity: 1,
                    toy: {
                        connect: {
                            id: toyId,
                        },
                    },
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
        }
        const cartCount = yield db_1.default.cart.count({
            where: { userId },
        });
        return res.status(200).json(cartCount);
    }
    catch (error) {
        return res.status(500).json("Internal server error");
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.params;
    try {
        const cart = yield db_1.default.cart.delete({
            where: { id: cartId },
            select: { id: true },
        });
        return res.status(200).json(cart);
    }
    catch (error) {
        return res.status(500).json("Internal server error");
    }
});
exports.removeFromCart = removeFromCart;
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.params;
    const { quantity, userId } = req.body;
    try {
        if (quantity < 1) {
            return res
                .status(500)
                .json("If you wont to remove this toy from the cart just click remove");
        }
        yield db_1.default.cart.update({
            where: { id: cartId },
            data: { quantity },
        });
        const cart = yield db_1.default.cart.findMany({
            where: { userId },
            include: { toy: true },
        });
        let sum = 0;
        for (let i = 0; i < cart.length; i++) {
            sum += cart[i].toy.price * cart[i].quantity;
        }
        return res.status(200).json(sum);
    }
    catch (error) {
        return res.status(500).json("Internal server error");
    }
});
exports.updateCart = updateCart;
// payment
const stripe = new stripe_1.Stripe(process.env.STRIPE_PUBLIC_KEY);
const payment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const cart = yield db_1.default.cart.findMany({
            where: { userId },
            include: { toy: true },
        });
        if (!cart || cart.length < 1) {
            return res.status(404).json("Cart is empty");
        }
        const session = yield stripe.checkout.sessions.create({
            line_items: cart.map((item) => {
                return {
                    quantity: item.quantity,
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.toy.name,
                            images: [item.toy.image],
                        },
                        unit_amount: item.toy.price * 100,
                    },
                };
            }),
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL}?success=false`,
        });
        if (!session.url) {
            return res.status(500).json("Payment Error!!!");
        }
        return res.status(200).json(session.url);
    }
    catch (error) {
        return res.status(500).json("Internal server error");
    }
});
exports.payment = payment;
const payment_success = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        yield db_1.default.cart.deleteMany({
            where: { userId },
        });
        return res.status(200).json("success");
    }
    catch (error) {
        return res.status(500).json("Internal server error");
    }
});
exports.payment_success = payment_success;
