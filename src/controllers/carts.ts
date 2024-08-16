import { Request, Response } from "express";
import { Stripe } from "stripe";
import db from "../lib/db";

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const carts = await db.cart.findMany({
      where: { userId },
      include: { toy: true },
    });

    return res.status(200).json(carts);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

export const getCartCount = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const cartCount = await db.cart.count({
      where: { userId },
    });

    return res.status(200).json(cartCount);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

export const getCartSubtitle = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const cart = await db.cart.findMany({
      where: { userId },
      include: { toy: true },
    });

    let sum = 0;

    for (let i = 0; i < cart.length; i++) {
      sum += cart[i].toy.price * cart[i].quantity;
    }

    return res.status(200).json(sum);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, toyId } = req.body;

    const alreadyInCart = await db.cart.findFirst({
      where: { userId, toyId },
    });

    if (alreadyInCart) {
      await db.cart.update({
        where: { id: alreadyInCart.id },
        data: { quantity: { increment: 1 } },
      });
    } else {
      await db.cart.create({
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

    const cartCount = await db.cart.count({
      where: { userId },
    });

    return res.status(200).json(cartCount);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;

  try {
    const cart = await db.cart.delete({
      where: { id: cartId },
      select: { id: true },
    });

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

export const updateCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  const { quantity, userId } = req.body;

  try {
    if (quantity < 1) {
      return res
        .status(500)
        .json("If you wont to remove this toy from the cart just click remove");
    }

    await db.cart.update({
      where: { id: cartId },
      data: { quantity },
    });

    const cart = await db.cart.findMany({
      where: { userId },
      include: { toy: true },
    });

    let sum = 0;

    for (let i = 0; i < cart.length; i++) {
      sum += cart[i].toy.price * cart[i].quantity;
    }

    return res.status(200).json(sum);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

// payment

const stripe = new Stripe(process.env.STRIPE_PUBLIC_KEY!);

export const payment = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const cart = await db.cart.findMany({
      where: { userId },
      include: { toy: true },
    });

    if (!cart || cart.length < 1) {
      return res.status(404).json("Cart is empty");
    }

    const session = await stripe.checkout.sessions.create({
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
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

export const payment_success = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    await db.cart.deleteMany({
      where: { userId },
    });

    return res.status(200).json("success");
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};
