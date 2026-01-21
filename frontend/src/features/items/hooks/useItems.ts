import { useEffect, useState } from "react";
import { createItem, deleteItem, getItems, updateItem } from "../api/itemsApi";
import { itemNameMinLength } from "../constants";
import type { Item } from "../types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Something went wrong";
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingItemIds, setPendingItemIds] = useState(() => new Set<string>());

  const trimmedName = newItemName.trim();
  const canSubmit = trimmedName.length >= itemNameMinLength && !isCreating;

  useEffect(() => {
    let isActive = true;

    const loadItems = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getItems();
        if (isActive) {
          setItems(data);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      isActive = false;
    };
  }, []);

  function updatePending(id: string, pending: boolean) {
    setPendingItemIds((current) => {
      const next = new Set(current);
      if (pending) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  async function addItem() {
    if (!trimmedName) {
      setErrorMessage("Enter a product name");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);

    try {
      const createdItem = await createItem(trimmedName);
      setItems((current) => [createdItem, ...current]);
      setNewItemName("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  }

  async function toggleItem(item: Item) {
    updatePending(item.id, true);
    setErrorMessage(null);

    try {
      const updatedItem = await updateItem(item.id, !item.bought);
      setItems((current) =>
        current.map((currentItem) => {
          if (currentItem.id === updatedItem.id) {
            return updatedItem;
          }
          return currentItem;
        }),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      updatePending(item.id, false);
    }
  }

  async function removeItem(item: Item) {
    updatePending(item.id, true);
    setErrorMessage(null);

    try {
      await deleteItem(item.id);
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      updatePending(item.id, false);
    }
  }

  let purchasedCount = 0;
  for (const item of items) {
    if (item.bought) {
      purchasedCount += 1;
    }
  }

  return {
    items,
    newItemName,
    setNewItemName,
    errorMessage,
    isLoading,
    isCreating,
    canSubmit,
    pendingItemIds,
    addItem,
    toggleItem,
    removeItem,
    purchasedCount,
  };
}
