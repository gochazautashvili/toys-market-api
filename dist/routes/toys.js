"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const toys_1 = require("../controllers/toys");
const router = express_1.default.Router();
router.get("/", toys_1.getToys);
router.get("/single-toys/:slug", toys_1.getToysBySlug);
router.get("/wooden-toys", toys_1.getWoodenToys);
router.get("/stuffed-toys", toys_1.getStuffedToys);
// route handlers for admin
router.get("/admin/upload-image-auth", toys_1.upload_image_auth);
router.post("/admin/create", toys_1.create_toy);
router.patch("/admin/update/:toyId", toys_1.update_toy);
router.delete("/admin/delete/:toyId", toys_1.remove_toy);
router.delete("/admin/delete-uploaded-image/:fileId", toys_1.delete_uploaded_image);
router.delete("/admin/delete-all-toys", toys_1.delete_all_toys);
exports.default = router;
