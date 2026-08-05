"use client";

import { useId } from "react";

/** Classic Aqua LCD battery — full charge, glassy green gel. */
export function BatteryIcon({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const fillId = `battFill${uid}`;
  const glossId = `battGloss${uid}`;
  const shellId = `battShell${uid}`;
  const shineId = `battShine${uid}`;

  return (
    <svg
      viewBox="0 0 28 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={fillId}
          x1="14"
          y1="2.4"
          x2="14"
          y2="10.6"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#C5F8D6" />
          <stop offset="32%" stopColor="#5FE090" />
          <stop offset="48%" stopColor="#34C759" />
          <stop offset="52%" stopColor="#28B04D" />
          <stop offset="100%" stopColor="#178A3C" />
        </linearGradient>
        <linearGradient
          id={glossId}
          x1="14"
          y1="2.4"
          x2="14"
          y2="7"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={shellId}
          x1="12"
          y1="0.8"
          x2="12"
          y2="12.2"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#C8D6E8" />
        </linearGradient>
        <linearGradient
          id={shineId}
          x1="3"
          y1="4"
          x2="24"
          y2="4"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="35%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="65%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Tip */}
      <rect x="24.1" y="3.4" width="3.35" height="6.2" rx="1" fill="#2C3E58" />
      <rect
        x="24.35"
        y="3.75"
        width="2.2"
        height="2.15"
        rx="0.5"
        fill="#fff"
        fillOpacity="0.35"
      />

      {/* Shell */}
      <rect
        x="0.7"
        y="0.7"
        width="23.8"
        height="11.6"
        rx="2"
        fill={`url(#${shellId})`}
        stroke="#2C3E58"
        strokeWidth="1.4"
      />

      {/* Charge gel */}
      <rect
        x="2.35"
        y="2.35"
        width="20.5"
        height="8.3"
        rx="1.1"
        fill={`url(#${fillId})`}
      />

      {/* Upper-half Aqua specular */}
      <rect
        x="2.35"
        y="2.35"
        width="20.5"
        height="4.2"
        rx="1.1"
        fill={`url(#${glossId})`}
      />

      {/* Horizontal catch-light streak */}
      <rect
        x="3.4"
        y="3.15"
        width="18.3"
        height="1.15"
        rx="0.55"
        fill={`url(#${shineId})`}
      />
    </svg>
  );
}
