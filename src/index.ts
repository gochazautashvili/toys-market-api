import express, { Request, Response, Application } from "express";
import compression from "compression";
import cors from "cors";
import toys_router from "./routes/toys";
import carts_router from "./routes/carts";
import users_router from "./routes/users";
import auth from "./middlewares/auth";
import "dotenv/config";

const app: Application = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin === process.env.FRONTEND_URL || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(compression());
app.use(express.json());

// routes
app.use("/api/toys", toys_router);
app.use("/api/carts", auth, carts_router);
app.use("/api/users", users_router);

// default route and connect database
const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Tyo Stor API");
});

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});
