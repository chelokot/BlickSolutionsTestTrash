import { Router } from "express";
import { validateObjectId } from "../../middleware/validateObjectId";
import { createItem, deleteItem, getItems, updateItem } from "./itemController";

const itemsRouter = Router();

itemsRouter.get("/", getItems);
itemsRouter.post("/", createItem);
itemsRouter.put("/:id", validateObjectId, updateItem);
itemsRouter.delete("/:id", validateObjectId, deleteItem);

export default itemsRouter;
