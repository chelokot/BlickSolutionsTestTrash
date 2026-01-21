import type { ItemDocument } from "./itemModel";

export type ItemResponse = {
  id: string;
  name: string;
  bought: boolean;
};

export function serializeItem(item: ItemDocument): ItemResponse {
  return {
    id: item.id,
    name: item.name,
    bought: item.bought,
  };
}
