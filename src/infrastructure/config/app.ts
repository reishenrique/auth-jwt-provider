import express, { type Express } from "express";
import authRouter from "../routes/authRoutes";

export const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", authRouter);
