import type { CSSProperties } from "react";

type ErrorBannerProps = {
  message: string;
};

const styles = {
  error: {
    padding: "12px 16px",
    borderRadius: "14px",
    backgroundColor: "rgba(201, 72, 75, 0.12)",
    color: "#8d2f32",
    fontWeight: 500,
  },
} satisfies Record<string, CSSProperties>;

export function ErrorBanner({ message }: ErrorBannerProps) {
  return <div style={styles.error}>{message}</div>;
}
