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
exports.create_user = exports.getUser = void 0;
const db_1 = __importDefault(require("../lib/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.default.user.findUnique({
            where: { id: req.body.userId },
        });
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.getUser = getUser;
const create_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield db_1.default.user.findUnique({
            where: { email: req.body.email },
        });
        if (!existingUser) {
            const role = req.body.email == process.env.ADMIN_EMAIL;
            const user = yield db_1.default.user.create({
                data: { email: req.body.email, role: role ? "ADMIN" : "USER" },
            });
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
            return res.status(200).json(token);
        }
        const token = jsonwebtoken_1.default.sign({ userId: existingUser.id }, process.env.JWT_SECRET);
        return res.status(200).json(token);
    }
    catch (error) {
        return res.status(500).json("Internal server error!");
    }
});
exports.create_user = create_user;
