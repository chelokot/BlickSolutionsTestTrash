import type { CSSProperties } from "react";
import type { Item } from "../types";

type ItemRowProps = {
  item: Item;
  isPending: boolean;
  index: number;
  onToggle: (item: Item) => void;
  onDelete: (item: Item) => void;
};

const styles = {
  itemRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "18px",
    border: "1px solid #e7ddd1",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 10px 22px rgba(83, 66, 49, 0.08)",
  },
  itemRowPending: {
    opacity: 0.7,
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#c7724c",
  },
  itemName: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#2e231a",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemNameBought: {
    color: "#8a7b6f",
    textDecoration: "line-through",
  },
  deleteButton: {
    border: "1px solid #e0d0c3",
    background: "transparent",
    color: "#8a6d5a",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
} satisfies Record<string, CSSProperties>;

export function ItemRow({ item, isPending, index, onToggle, onDelete }: ItemRowProps) {
  const itemRowStyle = {
    ...styles.itemRow,
    animation: "rise 400ms ease both",
    animationDelay: `${index * 60}ms`,
  };
  if (isPending) {
    Object.assign(itemRowStyle, styles.itemRowPending);
  }

  const nameStyle = { ...styles.itemName };
  if (item.bought) {
    Object.assign(nameStyle, styles.itemNameBought);
  }

  const deleteButtonStyle = { ...styles.deleteButton };
  if (isPending) {
    Object.assign(deleteButtonStyle, styles.deleteButtonDisabled);
  }

  return (
    <div style={itemRowStyle}>
      <label style={styles.itemLeft}>
        <input
          style={styles.checkbox}
          type="checkbox"
          checked={item.bought}
          onChange={() => onToggle(item)}
          disabled={isPending}
          aria-label={`Mark ${item.name} as purchased`}
        />
        <span style={nameStyle}>{item.name}</span>
      </label>
      <button
        style={deleteButtonStyle}
        type="button"
        onClick={() => onDelete(item)}
        disabled={isPending}
      >
        Delete
      </button>
    </div>
  );
}
