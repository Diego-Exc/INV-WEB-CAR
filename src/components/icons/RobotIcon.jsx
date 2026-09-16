export default function RobotIcon({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="4" r="2" fill="currentColor" />
      <line x1="24" y1="6" x2="24" y2="10" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="10" width="28" height="22" rx="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="21" r="2.4" fill="currentColor" />
      <circle cx="30" cy="21" r="2.4" fill="currentColor" />
      <path d="M16 26.5h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="18" width="5" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <rect x="39" y="18" width="5" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M19 33l5 3 5-3-5 6-5-6z" fill="currentColor" />
    </svg>
  )
}
