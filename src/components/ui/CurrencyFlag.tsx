import { useId } from "react";
import { Currency } from "@/types";
export function CurrencyFlag({ currency }: { currency: Currency }) {
  const id = useId();
  return (
    <svg className="currency-flag" viewBox="0 0 24 24" aria-label={currency}>
      <defs>
        <clipPath id={id}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {currency === "RON" ? (
          <>
            <path fill="#002b7f" d="M0 0h8v24H0z" />
            <path fill="#fcd116" d="M8 0h8v24H8z" />
            <path fill="#ce1126" d="M16 0h8v24h-8z" />
          </>
        ) : currency === "EUR" ? (
          <>
            <path fill="#003399" d="M0 0h24v24H0z" />
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                fill="#ffcc00"
                d="m12 4 .45 1.2 1.3.06-1 .8.35 1.2-1.1-.7-1.1.7.35-1.2-1-.8 1.3-.06z"
                transform={`rotate(${i * 30} 12 12)`}
              />
            ))}
          </>
        ) : currency === "USD" ? (
          <>
            <path fill="#fff" d="M0 0h24v24H0z" />
            {Array.from({ length: 7 }, (_, i) => (
              <rect
                key={i}
                fill="#b22234"
                y={(i * 24) / 6.5}
                width="24"
                height={24 / 13}
              />
            ))}
            <path fill="#3c3b6e" d="M0 0h12v13H0z" />
            {Array.from({ length: 50 }, (_, i) => (
              <circle
                key={i}
                fill="white"
                cx={1 + (i % 6) * 1.9}
                cy={1 + Math.floor(i / 6) * 1.4}
                r=".32"
              />
            ))}
          </>
        ) : (
          <>
            <path fill="#012169" d="M0 0h24v24H0z" />
            <path stroke="#fff" strokeWidth="5" d="m0 0 24 24M24 0 0 24" />
            <path stroke="#c8102e" strokeWidth="2" d="m0 0 24 24M24 0 0 24" />
            <path stroke="#fff" strokeWidth="7" d="M12 0v24M0 12h24" />
            <path stroke="#c8102e" strokeWidth="4" d="M12 0v24M0 12h24" />
          </>
        )}
      </g>
    </svg>
  );
}
