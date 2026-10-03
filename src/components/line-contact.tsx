export const LINE_CONTACT_URL = "https://line.me/ti/p/uyJpusOark";

export function LineIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M18 2.5C9.44 2.5 2.5 8.22 2.5 15.28c0 6.32 5.52 11.62 12.98 12.64l-1.04 5.38c-.12.62.52 1.1 1.08.79l7.2-5.1c7.44-1.83 12.78-7.16 12.78-13.71C35.5 8.22 28.56 2.5 20 2.5h-2Z"
        fill="#06C755"
      />
      <text
        x="18"
        y="19.7"
        fill="white"
        fontFamily="Arial, sans-serif"
        fontSize="9.4"
        fontWeight="700"
        letterSpacing="-0.7"
        textAnchor="middle"
      >
        LINE
      </text>
    </svg>
  );
}
