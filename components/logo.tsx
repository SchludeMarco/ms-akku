/** MS-Akku-Logo aus shared/stitch_ms_akku_app_prototype/ms_akku_logo/code.html. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      role="img"
      aria-label="MS Akku Logo"
      className={className}
    >
      <rect width="100" height="100" rx="24" fill="#1F5F5B" />
      <rect
        x="22"
        y="32"
        width="50"
        height="36"
        rx="8"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M75 43 C77 43 78 44 78 47 L78 53 C78 56 77 57 75 57"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="27" y="37" width="30" height="26" rx="5" fill="#5EEAD4" opacity="0.9" />
      <circle cx="42" cy="50" r="4" fill="#1F5F5B" />
    </svg>
  );
}
