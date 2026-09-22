import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "header" | "header-mobile" | "footer" | "email" | "hero" | "compact" | "auth";
  className?: string;
  showText?: boolean;
}

export default function Logo({
  variant = "header",
  className = "",
  showText = true,
}: LogoProps) {
  // Variant sizing configurations
  const config = {
    header: {
      imageSize: "w-11 h-11",
      width: 44,
      height: 44,
      textSize: "text-xl",
      subtitleSize: "text-[9px]",
      containerClass: "flex items-center gap-3",
    },
    "header-mobile": {
      imageSize: "w-9 h-9",
      width: 36,
      height: 36,
      textSize: "text-lg",
      subtitleSize: "text-[8px]",
      containerClass: "flex items-center gap-2",
    },
    footer: {
      imageSize: "w-12 h-12",
      width: 48,
      height: 48,
      textSize: "text-2xl",
      subtitleSize: "text-[10px]",
      containerClass: "flex items-center gap-3",
    },
    auth: {
      imageSize: "w-20 h-20",
      width: 80,
      height: 80,
      textSize: "text-3xl",
      subtitleSize: "text-xs",
      containerClass: "flex flex-col items-center text-center gap-2",
    },
    hero: {
      imageSize: "w-24 h-24",
      width: 96,
      height: 96,
      textSize: "text-4xl",
      subtitleSize: "text-sm",
      containerClass: "flex flex-col items-center text-center gap-3",
    },
    compact: {
      imageSize: "w-8 h-8",
      width: 32,
      height: 32,
      textSize: "text-base",
      subtitleSize: "text-[8px]",
      containerClass: "flex items-center gap-2",
    },
    email: {
      imageSize: "w-16 h-16",
      width: 64,
      height: 64,
      textSize: "text-2xl",
      subtitleSize: "text-xs",
      containerClass: "flex items-center gap-3",
    },
  }[variant];

  const logoMarkup = (
    <div className={`${config.containerClass} group focus:outline-none ${className}`}>
      {/* Official FarmReem Emblem Badge */}
      <div className={`relative ${config.imageSize} rounded-full overflow-hidden shadow-md flex-shrink-0 bg-white ring-2 ring-[#C59B27]/40 group-hover:scale-105 transition-transform`}>
        <Image
          src="/images/farmreem-logo.png"
          alt="FarmReem"
          width={config.width}
          height={config.height}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-extrabold ${config.textSize} tracking-tight ${
              variant === "footer" || variant === "header" || variant === "header-mobile"
                ? "text-white group-hover:text-[#FAF7F2]"
                : "text-[#0F2E23]"
            }`}
          >
            Farm<span className="text-[#C59B27]">Reem</span>
          </span>
          <span
            className={`uppercase tracking-widest ${config.subtitleSize} font-bold ${
              variant === "footer" || variant === "header" || variant === "header-mobile"
                ? "text-[#FAF7F2]/75"
                : "text-[#4F5E57]"
            }`}
          >
            Foodservice Supply · Dehradun
          </span>
        </div>
      )}
    </div>
  );

  // Email variant returns non-link markup
  if (variant === "email") {
    return logoMarkup;
  }

  return <Link href="/">{logoMarkup}</Link>;
}
