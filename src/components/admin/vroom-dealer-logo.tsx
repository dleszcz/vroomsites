import React from "react";

interface VroomDealerLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

export function VroomDealerLogo({
  className = "",
  size = "md",
  inverted = true,
}: VroomDealerLogoProps) {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} fill-blue-500 shrink-0`}
        aria-hidden="true"
      >
        <path
          transform="translate(3.0 -3.6) scale(0.94)"
          fillRule="evenodd"
          d="M30 20H70L78.4 34H91L92 40L85 43L95 47L97 62L96 79L93 94H73L71 84H29L27 94H7L4 79L3 62L5 47L15 43L8 40L9 34H21.6Z M34 26H66L75 40H25Z M10 52L17 47L33 54L17 58Z M90 52L83 47L67 54L83 58Z M36 52H47L50 66L53 52H64L56 78H44Z M12 67H29L26 73H14Z M88 67H71L74 73H86Z"
        />
      </svg>
      <span className={`${textSizes[size]} font-extrabold tracking-tight font-heading`}>
        <span className={inverted ? "text-slate-100" : "text-zinc-950"}>Vroom</span>
        <span className="text-blue-500">Dealer</span>
      </span>
    </span>
  );
}
