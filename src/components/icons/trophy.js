const TennisTrophyIcon = ({
  width = 64,
  height = 64,
  primaryColor = "gold",
  secondaryColor = "goldenrod",
  baseColor = "darkgoldenrod",
  ballColor = "lightgreen",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={width}
    height={height}
  >
    {/* Trophy Cup */}
    <path
      d="M16 10h32v10a16 16 0 0 1-32 0V10z"
      fill={primaryColor}
      stroke={secondaryColor}
      strokeWidth="2"
    />

    {/* Handles */}
    <path
      d="M16 10c-5 0-8 5-8 10s3 10 12 10M48 10c5 0 8 5 8 10s-3 10-12 10"
      stroke={secondaryColor}
      strokeWidth="3"
      fill="none"
    />

    {/* Tennis Ball */}
    <circle
      cx="32"
      cy="20"
      r="6"
      fill={ballColor}
      stroke="green"
      strokeWidth="2"
    />
    <path
      d="M28 16c3 3 2 8 0 8M36 16c-3 3-4 5 0 8"
      stroke="white"
      strokeWidth="1"
      fill="none"
    />

    {/* Curved Trophy Neck */}
    <path
      d="M26 35
         Q32 38 38 35
         L36 42
         Q32 46 28 42
         Z"
      fill={secondaryColor}
    />

    {/* Trophy Base (Top Layer) */}
    <rect x="22" y="42" width="20" height="6" fill={secondaryColor} />

    {/* Trophy Base (Bottom Layer) */}
    <rect x="18" y="45" width="28" height="4" fill={baseColor} />
  </svg>
);

export default TennisTrophyIcon;
