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
exports.delete_all_toys = exports.delete_uploaded_image = exports.upload_image_auth = exports.update_toy = exports.remove_toy = exports.create_toy = exports.getToysBySlug = exports.getStuffedToys = exports.getWoodenToys = exports.getToys = void 0;
const db_1 = __importDefault(require("../lib/db"));
const imageKit_1 = __importDefault(require("../lib/imageKit"));
const getToys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.default.toy.findMany();
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.getToys = getToys;
const getWoodenToys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.default.toy.findMany({
            where: { type: "WOODEN" },
        });
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.getWoodenToys = getWoodenToys;
const getStuffedToys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.default.toy.findMany({
            where: { type: "STUFFED" },
        });
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.getStuffedToys = getStuffedToys;
const getToysBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const product = yield db_1.default.toy.findUnique({
            where: { slug },
        });
        if (!product) {
            return res.status(404).json("Product not found. invalid slug!");
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.getToysBySlug = getToysBySlug;
// route handlers for admin
const create_toy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.body.slug;
    const slugs = slug.split(" ");
    const generated_slug = slugs.join("-").toLocaleLowerCase();
    try {
        yield db_1.default.toy.create({
            data: Object.assign(Object.assign({}, req.body), { price: Number(req.body.price), slug: generated_slug }),
        });
        return res.status(200).json("success");
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.create_toy = create_toy;
const remove_toy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { toyId } = req.params;
    try {
        const toy = yield db_1.default.toy.delete({
            where: { id: toyId },
        });
        imageKit_1.default.deleteFile(toy.imageId);
        return res.status(200).json("success");
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.remove_toy = remove_toy;
const update_toy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { toyId } = req.params;
    const slug = req.body.slug;
    const slugs = slug.split(" ");
    const generated_slug = slugs.join("-").toLocaleLowerCase();
    try {
        yield db_1.default.toy.update({
            where: { id: toyId },
            data: Object.assign(Object.assign({}, req.body), { price: Number(req.body.price), slug: generated_slug }),
        });
        return res.status(200).json("success");
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.update_toy = update_toy;
const upload_image_auth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = imageKit_1.default.getAuthenticationParameters();
        return res.send(result);
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.upload_image_auth = upload_image_auth;
const delete_uploaded_image = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId } = req.params;
    if (!fileId) {
        return res.status(404).json("Image not found");
    }
    try {
        const result = imageKit_1.default.deleteFile(fileId);
        return res.send(result);
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.delete_uploaded_image = delete_uploaded_image;
const delete_all_toys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.toy.deleteMany();
        return res.status(200).json("success");
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.delete_all_toys = delete_all_toys;
