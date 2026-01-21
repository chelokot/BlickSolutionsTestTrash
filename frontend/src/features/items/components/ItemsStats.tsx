import type { CSSProperties } from "react";

type ItemsStatsProps = {
  total: number;
  purchased: number;
};

const styles = {
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#8b7360",
    fontSize: "0.9rem",
  },
} satisfies Record<string, CSSProperties>;

export function ItemsStats({ total, purchased }: ItemsStatsProps) {
  return (
    <footer style={styles.footer}>
      <span>{total} items total</span>
      <span>{purchased} purchased</span>
    </footer>
  );
}
