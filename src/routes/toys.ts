import express, { Router } from "express";
import {
  getToys,
  getStuffedToys,
  getToysBySlug,
  getWoodenToys,
  create_toy,
  remove_toy,
  update_toy,
  upload_image_auth,
  delete_all_toys,
  delete_uploaded_image,
} from "../controllers/toys";

const router: Router = express.Router();

router.get("/", getToys);
router.get("/single-toys/:slug", getToysBySlug);
router.get("/wooden-toys", getWoodenToys);
router.get("/stuffed-toys", getStuffedToys);

// route handlers for admin
router.get("/admin/upload-image-auth", upload_image_auth);

router.post("/admin/create", create_toy);

router.patch("/admin/update/:toyId", update_toy);

router.delete("/admin/delete/:toyId", remove_toy);
router.delete("/admin/delete-uploaded-image/:fileId", delete_uploaded_image);
router.delete("/admin/delete-all-toys", delete_all_toys);

export default router;
