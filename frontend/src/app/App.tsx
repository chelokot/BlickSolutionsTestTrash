import type { CSSProperties } from "react";
import { ErrorBanner } from "../features/items/components/ErrorBanner";
import { ItemForm } from "../features/items/components/ItemForm";
import { ItemList } from "../features/items/components/ItemList";
import { ItemsStats } from "../features/items/components/ItemsStats";
import { itemInputPlaceholder, itemNameMaxLength } from "../features/items/constants";
import { useItems } from "../features/items/hooks/useItems";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 20px",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #f2e9de 0%, #f7f3ee 45%, #efe6da 100%)",
  },
  glowPrimary: {
    position: "absolute",
    top: "-120px",
    right: "-80px",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 30% 30%, rgba(226, 125, 95, 0.45), rgba(226, 125, 95, 0))",
    filter: "blur(6px)",
    animation: "float 8s ease-in-out infinite",
    zIndex: 0,
  },
  glowSecondary: {
    position: "absolute",
    bottom: "-160px",
    left: "-120px",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 70% 70%, rgba(114, 178, 146, 0.35), rgba(114, 178, 146, 0))",
    filter: "blur(8px)",
    animation: "float 10s ease-in-out infinite",
    zIndex: 0,
  },
  card: {
    width: "min(720px, 100%)",
    backgroundColor: "rgba(255, 255, 255, 0.78)",
    borderRadius: "28px",
    padding: "32px",
    boxShadow: "0 24px 60px rgba(53, 43, 34, 0.12)",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(18px)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "relative",
    zIndex: 1,
    animation: "rise 600ms ease both",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: "0.28em",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "#8b7360",
  },
  title: {
    fontFamily: "Fraunces, serif",
    fontSize: "2.4rem",
    margin: 0,
    color: "#2e231a",
  },
  subtitle: {
    margin: 0,
    color: "#5e5045",
    fontSize: "1rem",
    maxWidth: "520px",
  },
} satisfies Record<string, CSSProperties>;

export default function App() {
  const {
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
  } = useItems();

  let errorContent = null;
  if (errorMessage) {
    errorContent = <ErrorBanner message={errorMessage} />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.glowPrimary} />
      <div style={styles.glowSecondary} />
      <div style={styles.card}>
        <header style={styles.header}>
          <span style={styles.eyebrow}>Shopping ritual</span>
          <h1 style={styles.title}>Pantry Plan</h1>
          <p style={styles.subtitle}>
            Capture the essentials, tick them off as you go, and keep the list tidy as the week
            unfolds.
          </p>
        </header>

        {errorContent}

        <ItemForm
          value={newItemName}
          onChange={setNewItemName}
          onSubmit={addItem}
          isSubmitting={isCreating}
          canSubmit={canSubmit}
          maxLength={itemNameMaxLength}
          placeholder={itemInputPlaceholder}
        />

        <ItemList
          items={items}
          isLoading={isLoading}
          pendingItemIds={pendingItemIds}
          onToggle={toggleItem}
          onDelete={removeItem}
        />

        <ItemsStats total={items.length} purchased={purchasedCount} />
      </div>
    </div>
  );
}
