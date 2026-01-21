import type { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

type ItemIdParams = {
  id: string;
};

export const validateObjectId: RequestHandler<ItemIdParams> = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  next();
};
