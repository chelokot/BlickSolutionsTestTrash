import type { CSSProperties, ReactNode } from "react";
import type { Item } from "../types";
import { ItemRow } from "./ItemRow";

type ItemListProps = {
  items: Item[];
  isLoading: boolean;
  pendingItemIds: ReadonlySet<string>;
  onToggle: (item: Item) => void;
  onDelete: (item: Item) => void;
};

const styles = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  emptyState: {
    padding: "18px",
    borderRadius: "18px",
    border: "1px dashed #dfd4c8",
    color: "#7b6a5c",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
} satisfies Record<string, CSSProperties>;

export function ItemList({ items, isLoading, pendingItemIds, onToggle, onDelete }: ItemListProps) {
  let content: ReactNode = <div style={styles.emptyState}>Loading your list...</div>;

  if (!isLoading && items.length === 0) {
    content = (
      <div style={styles.emptyState}>No items yet. Add your first product to get started.</div>
    );
  }

  if (!isLoading && items.length > 0) {
    content = items.map((item, index) => (
      <ItemRow
        key={item.id}
        item={item}
        index={index}
        isPending={pendingItemIds.has(item.id)}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    ));
  }

  return <section style={styles.list}>{content}</section>;
}
