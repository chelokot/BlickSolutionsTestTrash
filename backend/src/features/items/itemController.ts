import type { RequestHandler } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { ItemModel } from "./itemModel";
import { serializeItem } from "./itemSerializer";
import { parseCreateItemPayload, parseUpdateItemPayload } from "./itemValidation";

type ItemIdParams = {
  id: string;
};

export const getItems: RequestHandler = asyncHandler(async (_req, res) => {
  const items = await ItemModel.find().sort({ createdAt: -1 }).exec();
  res.json(items.map(serializeItem));
});

export const createItem: RequestHandler = asyncHandler(async (req, res) => {
  const payload = parseCreateItemPayload(req.body);
  const item = await ItemModel.create({
    name: payload.name,
  });
  res.status(201).json(serializeItem(item));
});

export const updateItem: RequestHandler<ItemIdParams> = asyncHandler(async (req, res) => {
  const payload = parseUpdateItemPayload(req.body);
  const item = await ItemModel.findById(req.params.id).exec();
  if (!item) {
    res.status(404).json({ message: "Item not found" });
    return;
  }
  item.bought = payload.bought;
  await item.save();
  res.json(serializeItem(item));
});

export const deleteItem: RequestHandler<ItemIdParams> = asyncHandler(async (req, res) => {
  const item = await ItemModel.findByIdAndDelete(req.params.id).exec();
  if (!item) {
    res.status(404).json({ message: "Item not found" });
    return;
  }
  res.status(204).send();
});
