import { z } from "zod";
import { itemNameMaxLength, itemNameMinLength } from "./itemConstants";

const createItemSchema = z.object({
  name: z.string().trim().min(itemNameMinLength).max(itemNameMaxLength),
});

const updateItemSchema = z.object({
  bought: z.boolean(),
});

export type CreateItemPayload = z.infer<typeof createItemSchema>;
export type UpdateItemPayload = z.infer<typeof updateItemSchema>;

export function parseCreateItemPayload(data: unknown): CreateItemPayload {
  return createItemSchema.parse(data);
}

export function parseUpdateItemPayload(data: unknown): UpdateItemPayload {
  return updateItemSchema.parse(data);
}
