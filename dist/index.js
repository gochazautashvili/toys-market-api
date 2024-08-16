"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const toys_1 = __importDefault(require("./routes/toys"));
const carts_1 = __importDefault(require("./routes/carts"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./middlewares/auth"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
// routes
app.use("/api/toys", toys_1.default);
app.use("/api/carts", auth_1.default, carts_1.default);
app.use("/api/users", users_1.default);
// default route and connect database
const PORT = process.env.PORT;
app.get("/", (req, res) => {
    res.send("Tyo Stor API");
});
app.listen(PORT, () => {
    console.log(`Server is Fire at http://localhost:${PORT}`);
});
