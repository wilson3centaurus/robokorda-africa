"use client";

type QuantityControlProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantityControl({ value, onChange }: QuantityControlProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--electric-subtle)] hover:text-[var(--electric-bright)]"
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm font-bold text-[var(--text-primary)]">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--electric-subtle)] hover:text-[var(--electric-bright)]"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
