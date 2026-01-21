import { type HydratedDocument, type InferSchemaType, model, Schema } from "mongoose";
import { itemNameMaxLength, itemNameMinLength } from "./itemConstants";

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: itemNameMinLength,
      maxlength: itemNameMaxLength,
    },
    bought: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

type ItemSchema = InferSchemaType<typeof itemSchema>;
export type ItemDocument = HydratedDocument<ItemSchema>;
export const ItemModel = model<ItemSchema>("Item", itemSchema);
