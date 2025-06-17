import React from "react";

interface BrandLogoProps {
  brandCode: string;
  brandName: string;
  base64Logo?: string;
  website?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: boolean;
  clickable?: boolean;
  removeWhiteBackground?: boolean;
  whiteBgMethod?: "multiply" | "screen" | "advanced";
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  brandCode,
  brandName,
  base64Logo,
  website,
  className = "",
  size = "md",
  fallback = true,
  clickable = false,
  removeWhiteBackground = false,
  whiteBgMethod = "multiply",
}) => {
  const sizeClasses = {
    sm: "w-12 h-6",
    md: "w-20 h-8",
    lg: "w-32 h-12",
    xl: "w-40 h-16",
  };

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallback) {
      const target = e.currentTarget;
      target.style.display = "none";
      // Show text fallback
      const fallbackDiv = target.nextElementSibling as HTMLElement;
      if (fallbackDiv) {
        fallbackDiv.style.display = "flex";
      }
    }
  };

  const handleClick = () => {
    if (clickable && website) {
      window.open(website, "_blank", "noopener,noreferrer");
    }
  };

  // CSS để xóa nền trắng với nhiều phương pháp
  const getImageStyles = () => {
    if (!removeWhiteBackground) {
      return { background: "transparent" };
    }

    switch (whiteBgMethod) {
      case "multiply":
        return {
          filter: "contrast(1.1) brightness(1.05)",
          mixBlendMode: "multiply" as const,
          background: "transparent",
        };

      case "screen":
        return {
          filter: "contrast(1.2) brightness(0.9)",
          mixBlendMode: "screen" as const,
          background: "transparent",
        };

      case "advanced":
        return {
          filter: "contrast(1.15) brightness(1.1) saturate(1.1)",
          background: "transparent",
          // Sử dụng CSS mask để loại bỏ pixel trắng
          WebkitMask: `
            radial-gradient(circle at center, black 60%, transparent 70%),
            linear-gradient(to right, black, black)
          `,
          WebkitMaskComposite: "intersect",
          mask: `
            radial-gradient(circle at center, black 60%, transparent 70%),
            linear-gradient(to right, black, black)
          `,
          maskComposite: "intersect",
        };

      default:
        return { background: "transparent" };
    }
  };

  const getImageClasses = () => {
    const baseClasses = "w-full h-full object-contain";
    if (removeWhiteBackground) {
      return `${baseClasses} remove-white-bg remove-white-bg-${whiteBgMethod}`;
    }
    return baseClasses;
  };

  return (
    <div
      className={`relative brand-logo ${sizeClasses[size]} ${className} ${
        clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      }`}
      onClick={handleClick}
      title={clickable ? `Visit ${brandName} website` : brandName}
    >
      {/* Brand Logo Image */}
      {base64Logo && (
        <div className="relative w-full h-full">
          <img
            src={base64Logo}
            alt={`${brandName} logo`}
            className={getImageClasses()}
            style={getImageStyles()}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Overlay để enhance white removal nếu cần */}
          {removeWhiteBackground && whiteBgMethod === "advanced" && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: `
                  radial-gradient(circle at 20% 20%, transparent 40%, rgba(255,255,255,0.1) 41%, rgba(255,255,255,0.1) 60%, transparent 61%),
                  radial-gradient(circle at 80% 80%, transparent 40%, rgba(255,255,255,0.1) 41%, rgba(255,255,255,0.1) 60%, transparent 61%)
                `,
                mixBlendMode: "difference",
              }}
            />
          )}
        </div>
      )}

      {/* Text Fallback - Only show when no logo */}
      <div
        className={`absolute inset-0 ${
          !base64Logo ? "flex" : "hidden"
        } items-center justify-center 
                   bg-gradient-to-r from-gray-100 to-gray-200 rounded text-gray-700 
                   font-semibold text-xs uppercase tracking-wide`}
        style={{ display: !base64Logo ? "flex" : "none" }}
      >
        <span className="text-center px-1 leading-tight">{brandName}</span>
      </div>
    </div>
  );
};

export default BrandLogo;
