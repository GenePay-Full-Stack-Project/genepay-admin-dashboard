import React from 'react'

// Small Lucide-like icons copied from the Lucide designs (simple versions)
export const Eye = ({ size = 18, stroke = 1.5, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const EyeOff = ({ size = 18, stroke = 1.5, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8 1.73-3.31 4.99-5.91 8.7-7.04" />
    <path d="M1 1l22 22" />
    <path d="M9.88 9.88A3 3 0 0 0 14 14" />
    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
  </svg>
)

export default { Eye, EyeOff }
