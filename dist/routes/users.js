"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get("/", auth_1.default, users_1.getUser);
router.post("/", users_1.create_user);
exports.default = router;
