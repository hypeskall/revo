"use client";
import { useState } from "react";
const brands: Record<string, [string, string, string]> = {
  NVDA: ["nvidia", "#000", "#76b900"],
  AAPL: ["apple", "#000", "#fff"],
  SPCX: ["spacex", "#241f21", "#fff"],
  AMZN: ["amazon", "#000", "#fff"],
  TSLA: ["tesla", "#e41c2d", "#fff"],
  TTWO: ["taketwointeractivesoftware", "#fff", "#151515"],
  MSFT: ["microsoft", "#0873bd", "#fff"],
  ONON: ["on", "#000", "#fff"],
  Uber: ["uber", "#000", "#fff"],
  Booking: ["bookingdotcom", "#1e3977", "#fff"],
  SHEIN: ["shein", "#fff", "#000"],
  Airbnb: ["airbnb", "#ff3764", "#fff"],
  "Wizz Air": ["wizzair", "#fff", "#c00079"],
  Glovo: ["glovo", "#ffc32a", "#00a783"],
  "Lounge by Zalando": ["zalando", "#4510ff", "#ff7500"],
  Nike: ["nike", "#000", "#fff"],
  "LEGO Store": ["lego", "#ef0000", "#fff"],
  Wolt: ["wolt", "#08bad4", "#fff"],
  Douglas: ["douglas", "#fff", "#000"],
  Kfc: ["kfc", "#ee0038", "#fff"],
  KFC: ["kfc", "#ee0038", "#fff"],
  Carrefour: ["carrefour", "#fff", "#1462aa"],
  Spotify: ["spotify", "#1ed760", "#000"],
};
export function BrandIcon({ brand }: { brand: string }) {
  const [failed, setFailed] = useState(false);
  const info = brands[brand];
  const textOnly = ["on", "shein", "lego", "wolt", "douglas"].includes(
    info?.[0] || "",
  );
  return (
    <i
      className={`brand-icon brand-${info?.[0] || "wordmark"}`}
      style={{
        background:
          info?.[1] ||
          (brand === "Superbet"
            ? "#f00000"
            : brand === "EXI2"
              ? "#59de24"
              : "#24242c"),
        color: info?.[2] || "#fff",
      }}
    >
      {brand === "MSFT" ? (
        <span className="microsoft-mark">
          <b />
          <b />
          <b />
          <b />
        </span>
      ) : info && !failed && !textOnly ? (
        <span
          style={{
            background: info[2],
            maskImage: `url(/icons/brands/${info[0]}.svg)`,
            WebkitMaskImage: `url(/icons/brands/${info[0]}.svg)`,
          }}
        >
          <img
            src={`/icons/brands/${info[0]}.svg`}
            alt=""
            onError={() => setFailed(true)}
          />
        </span>
      ) : brand === "MSFT" ? (
        <span className="microsoft-mark">
          <b />
          <b />
          <b />
          <b />
        </span>
      ) : brand === "Superbet" ? (
        <b className="superbet-mark">S</b>
      ) : (
        <b>
          {brand === "EXI2"
            ? "iShares."
            : brand === "AMZN"
              ? "amazon"
              : brand === "ONON"
                ? "on"
                : brand}
        </b>
      )}
    </i>
  );
}
