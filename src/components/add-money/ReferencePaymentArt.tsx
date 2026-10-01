// Repo-native illustration of the reference's decorative card face; fictional card data.
export function ReferencePaymentArt() {
  return (
    <span className="reference-amex-art">
      <svg
        viewBox="0 0 380 240"
        aria-label="Decorative American Express presentation card"
        role="img"
      >
        <defs>
          <pattern
            id="amex-rim"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 7 7 0l7 7-7 7Z"
              fill="none"
              stroke="#b4b4a9"
              strokeWidth="1.2"
            />
            <circle cx="7" cy="7" r="3" fill="none" stroke="#8e8e83" />
          </pattern>
          <radialGradient id="amex-bg">
            <stop stopColor="#112a10" />
            <stop offset="1" stopColor="#010601" />
          </radialGradient>
          <linearGradient id="amex-metal">
            <stop stopColor="#ebe7d6" />
            <stop offset=".45" stopColor="#807e70" />
            <stop offset=".6" stopColor="#e3dcc1" />
            <stop offset="1" stopColor="#999782" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="378"
          height="238"
          rx="10"
          fill="#111"
          stroke="#b0b1a6"
        />
        <rect
          x="5"
          y="5"
          width="370"
          height="230"
          rx="6"
          fill="url(#amex-rim)"
        />
        <rect
          x="15"
          y="17"
          width="350"
          height="206"
          rx="4"
          fill="url(#amex-bg)"
        />
        {Array.from({ length: 36 }, (_, i) => {
          const x = 195 + ((i * 41) % 167),
            y = 40 + ((i * 29) % 170);
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${i * 29})`}>
              <path
                d="M0 0Q-19-25-12-34Q8-20 0 0Z"
                fill={
                  i % 3 === 0 ? "#4e9e43" : i % 3 === 1 ? "#286f27" : "#19481b"
                }
              />
              <path d="M0 0Q21-28 27-13Q22 0 0 0Z" fill="#348540" />
              <path d="M0 0v-25" stroke="#b2c55e" strokeWidth=".7" />
            </g>
          );
        })}
        <text
          x="190"
          y="37"
          textAnchor="middle"
          fill="#e4dfd1"
          fontFamily="Arial,sans-serif"
          fontSize="17"
          fontWeight="900"
        >
          AMERICAN EXPRESS
        </text>
        <rect
          x="36"
          y="66"
          width="59"
          height="43"
          rx="9"
          fill="url(#amex-metal)"
        />
        <path
          d="M36 83h59M52 66l14 17v13l-14 13M80 66 66 83M80 109 66 96"
          fill="none"
          stroke="#70694f"
          strokeWidth="1"
        />
        <ellipse
          cx="185"
          cy="119"
          rx="45"
          ry="62"
          fill="#10110c"
          stroke="url(#amex-metal)"
          strokeWidth="3"
        />
        <ellipse
          cx="185"
          cy="119"
          rx="40"
          ry="56"
          fill="none"
          stroke="#c5c0aa"
        />
        <path
          d="m155 111 13-36 28-9 28 32-20-2-10-14-18 6 13 29-11 21 3 18 19 18-27 11-19-24 10-32Z"
          fill="url(#amex-metal)"
          stroke="#303129"
        />
        <path
          d="m170 89 9 14 8 4-3 9 11 3-7 12h-12M192 143l13 19-19 8M152 111l-6-13 10-24 14-15 25 2 22 18-12-4-17-9-17 5-10 14-3 20"
          fill="none"
          stroke="#e2dfc6"
          strokeWidth="2"
        />
        <path
          d="m159 145 19-5 10 16-12 21M196 66l6 19 15 11"
          fill="none"
          stroke="#c7c2ac"
        />
        <text
          x="36"
          y="195"
          fill="#e6e6d9"
          fontFamily="Arial,sans-serif"
          fontSize="12"
        >
          MIHAI
        </text>
        <text
          x="36"
          y="218"
          fill="#e6e6d9"
          fontFamily="Arial,sans-serif"
          fontSize="20"
        >
          •••• 0177
        </text>
        <rect
          x="282"
          y="168"
          width="65"
          height="29"
          rx="3"
          fill="#8b96784d"
          stroke="#b5bc98"
        />
        <text
          x="315"
          y="178"
          textAnchor="middle"
          fill="#d5dac8"
          fontFamily="Arial"
          fontSize="6"
        >
          MEMBER SINCE
        </text>
        <text
          x="315"
          y="191"
          textAnchor="middle"
          fill="#e6eadb"
          fontFamily="Arial"
          fontSize="13"
        >
          95
        </text>
      </svg>
    </span>
  );
}
