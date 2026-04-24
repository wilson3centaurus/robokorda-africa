"use client";

type QuantityControlProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantityControl({ value, onChange }: QuantityControlProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4d7499] transition hover:bg-[rgba(0,102,255,0.1)] hover:text-[#7eb8ff]"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm font-bold text-white">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4d7499] transition hover:bg-[rgba(0,102,255,0.1)] hover:text-[#7eb8ff]"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
