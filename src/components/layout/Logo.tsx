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
  const config = {
    header: {
      imageSize: "w-12 h-12",
      width: 48,
      height: 48,
      textSize: "text-2xl",
      subtitleSize: "text-[10px]",
      containerClass: "flex items-center gap-3.5",
    },
    "header-mobile": {
      imageSize: "w-10 h-10",
      width: 40,
      height: 40,
      textSize: "text-xl",
      subtitleSize: "text-[9px]",
      containerClass: "flex items-center gap-2.5",
    },
    footer: {
      imageSize: "w-14 h-14",
      width: 56,
      height: 56,
      textSize: "text-3xl",
      subtitleSize: "text-xs",
      containerClass: "flex items-center gap-4",
    },
    auth: {
      imageSize: "w-24 h-24",
      width: 96,
      height: 96,
      textSize: "text-3xl",
      subtitleSize: "text-xs",
      containerClass: "flex flex-col items-center text-center gap-3",
    },
    hero: {
      imageSize: "w-28 h-28",
      width: 112,
      height: 112,
      textSize: "text-4xl",
      subtitleSize: "text-sm",
      containerClass: "flex flex-col items-center text-center gap-4",
    },
    compact: {
      imageSize: "w-9 h-9",
      width: 36,
      height: 36,
      textSize: "text-lg",
      subtitleSize: "text-[9px]",
      containerClass: "flex items-center gap-2.5",
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
      {/* Official FarmReem Emblem Badge - High Prominence */}
      <div className={`relative ${config.imageSize} rounded-full overflow-hidden shadow-lg flex-shrink-0 bg-white ring-2 ring-[#C59B27] group-hover:scale-105 transition-transform duration-300`}>
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
        <div className="flex flex-col leading-none">
          <span
            className={`font-extrabold ${config.textSize} tracking-tight ${
              variant === "footer"
                ? "text-white group-hover:text-[#FAF7F2]"
                : "text-[#0F2E23]"
            }`}
          >
            Farm<span className="text-[#C59B27]">Reem</span>
          </span>
          <span
            className={`uppercase tracking-widest ${config.subtitleSize} font-bold mt-1 ${
              variant === "footer"
                ? "text-[#FAF7F2]/75"
                : "text-[#4F5E57]"
            }`}
          >
            Foodservice Supply · India
          </span>
        </div>
      )}
    </div>
  );

  if (variant === "email") {
    return logoMarkup;
  }

  return <Link href="/">{logoMarkup}</Link>;
}
