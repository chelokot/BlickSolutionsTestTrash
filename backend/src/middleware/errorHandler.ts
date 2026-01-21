import type { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const firstError = err.issues[0];
    let message = "Invalid request";
    if (firstError) {
      message = firstError.message;
    }
    res.status(400).json({ message });
    return;
  }

  if (err instanceof MongooseError.ValidationError) {
    res.status(400).json({ message: err.message });
    return;
  }

  if (err instanceof MongooseError.CastError) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Server error" });
};
