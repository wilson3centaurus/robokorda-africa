"use client";

type QuantityControlProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantityControl({ value, onChange }: QuantityControlProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-brand-line bg-brand-soft p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full text-brand-blue transition hover:bg-white"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm font-semibold text-brand-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-brand-blue transition hover:bg-white"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
