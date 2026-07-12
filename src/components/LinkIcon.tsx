type LinkIconProps = {
  className?: string
  style?: React.CSSProperties
}

export function LinkIcon({ className, style }: LinkIconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        d="M4 1H1v8h8V6M6 1h3v3M9 1L4.5 5.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
