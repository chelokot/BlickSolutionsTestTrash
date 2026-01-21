import type { CSSProperties, FormEvent } from "react";

type ItemFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  maxLength: number;
  placeholder: string;
};

const styles = {
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
  },
  input: {
    flex: "1 1 240px",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #e0d8ce",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  button: {
    padding: "14px 22px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(130deg, #e27d5f, #c9484b)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(201, 72, 75, 0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
} satisfies Record<string, CSSProperties>;

export function ItemForm({
  value,
  onChange,
  onSubmit,
  canSubmit,
  isSubmitting,
  maxLength,
  placeholder,
}: ItemFormProps) {
  const buttonStyle = { ...styles.button };
  if (!canSubmit) {
    Object.assign(buttonStyle, styles.buttonDisabled);
  }

  let buttonLabel = "Add item";
  if (isSubmitting) {
    buttonLabel = "Adding...";
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <input
        style={styles.input}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={isSubmitting}
        aria-label="Product name"
      />
      <button style={buttonStyle} type="submit" disabled={!canSubmit}>
        {buttonLabel}
      </button>
    </form>
  );
}
