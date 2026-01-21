import cors from "cors";
import express from "express";
import env from "./config/env";
import itemsRouter from "./features/items/itemRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin: env.clientOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json());

app.use("/items", itemsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

export default app;
