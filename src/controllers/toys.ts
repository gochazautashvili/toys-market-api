import { Request, Response } from "express";
import db from "../lib/db";
import imageKit from "../lib/imageKit";

export const getToys = async (req: Request, res: Response) => {
  try {
    const products = await db.toy.findMany();

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

export const getWoodenToys = async (req: Request, res: Response) => {
  try {
    const products = await db.toy.findMany({
      where: { type: "WOODEN" },
    });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

export const getStuffedToys = async (req: Request, res: Response) => {
  try {
    const products = await db.toy.findMany({
      where: { type: "STUFFED" },
    });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

export const getToysBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const product = await db.toy.findUnique({
      where: { slug },
    });

    if (!product) {
      return res.status(404).json("Product not found. invalid slug!");
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

// route handlers for admin
export const create_toy = async (req: Request, res: Response) => {
  const slug: string = req.body.slug;
  const slugs = slug.split(" ");
  const generated_slug = slugs.join("-").toLocaleLowerCase();

  try {
    await db.toy.create({
      data: {
        ...req.body,
        price: Number(req.body.price),
        slug: generated_slug,
      },
    });

    return res.status(200).json("success");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

export const remove_toy = async (req: Request, res: Response) => {
  const { toyId } = req.params;

  try {
    const toy = await db.toy.delete({
      where: { id: toyId },
    });

    imageKit.deleteFile(toy.imageId);

    return res.status(200).json("success");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

export const update_toy = async (req: Request, res: Response) => {
  const { toyId } = req.params;

  const slug: string = req.body.slug;
  const slugs = slug.split(" ");
  const generated_slug = slugs.join("-").toLocaleLowerCase();

  try {
    await db.toy.update({
      where: { id: toyId },
      data: {
        ...req.body,
        price: Number(req.body.price),
        slug: generated_slug,
      },
    });

    return res.status(200).json("success");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

export const upload_image_auth = async (req: Request, res: Response) => {
  try {
    const result = imageKit.getAuthenticationParameters();

    return res.send(result);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

export const delete_uploaded_image = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(404).json("Image not found");
  }

  try {
    const result = imageKit.deleteFile(fileId);

    return res.send(result);
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

export const delete_all_toys = async (req: Request, res: Response) => {
  try {
    await db.toy.deleteMany();

    return res.status(200).json("success");
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};
