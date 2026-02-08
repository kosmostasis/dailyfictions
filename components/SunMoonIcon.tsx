/**
 * Half sun (left) / half moon (right) — single icon for theme toggle.
 */
export function SunMoonIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* Left half: sun — circle + rays */}
      <circle cx="9" cy="12" r="3.5" fill="currentColor" />
      <line x1="9" y1="3" x2="9" y2="5" />
      <line x1="9" y1="19" x2="9" y2="21" />
      <line x1="3" y1="12" x2="5" y2="12" />
      <line x1="13" y1="12" x2="15" y2="12" />
      <line x1="5.8" y1="5.8" x2="7.2" y2="7.2" />
      <line x1="10.8" y1="10.8" x2="12.2" y2="12.2" />
      <line x1="5.8" y1="18.2" x2="7.2" y2="16.8" />
      <line x1="10.8" y1="13.2" x2="12.2" y2="14.6" />
      {/* Right half: moon — filled semicircle */}
      <path d="M12 3A9 9 0 0 1 12 21L12 3Z" fill="currentColor" />
    </svg>
  );
}
