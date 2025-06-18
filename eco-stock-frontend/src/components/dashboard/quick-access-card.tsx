import React from "react";

interface Props {
  title: string;
  icon: string;
  href: string;
  color: string;
  disabled?: boolean;
}

export default function QuickAccessCard({
  title,
  icon,
  href,
  color,
  disabled = false,
}: Props) {
  const iconClass = `h-6 w-6 ${disabled ? "opacity-50" : ""}`;

  const iconMap: Record<string, React.JSX.Element> = {
    package: (
      <svg
        className={iconClass}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    truck: (
      <svg
        className={iconClass}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    "bar-chart": (
      <svg
        className={iconClass}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    clipboard: (
      <svg
        className={iconClass}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  };

  const bgClassMap: Record<string, string> = {
    primary: "bg-[#E0E2C5] text-[#838664]",
    accent: "bg-[#A3BA9D] text-[#2A3B29]",
    heading: "bg-[#4C5260] text-white",
    muted: "bg-[#E4E4E4] text-black",
  };

  const disabledClass = disabled
    ? "opacity-50 pointer-events-none cursor-not-allowed"
    : "";

  return (
    <a
      href={href}
      className={`p-4 rounded-lg flex items-center hover:shadow-md transition-all ${
        bgClassMap[color] ?? bgClassMap.primary
      } ${disabledClass}`}
    >
      <div className="mr-3">{iconMap[icon] ?? iconMap.package}</div>
      <h4 className="font-medium">{title}</h4>
    </a>
  );
}
