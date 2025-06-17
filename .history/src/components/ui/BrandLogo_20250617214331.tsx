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

  // CSS để xóa nền trắng nhẹ nhàng
  const getImageStyles = () => {
    if (!removeWhiteBackground) {
      return {};
    }

    return {
      filter: 'contrast(1.1) brightness(1.05)',
      mixBlendMode: 'multiply' as const,
      background: 'transparent',
    };
  };

  const getImageClasses = () => {
    const baseClasses = "w-full h-full object-contain";
    if (removeWhiteBackground) {
      return `${baseClasses} remove-white-bg`;
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
        <img
          src={base64Logo}
          alt={`${brandName} logo`}
          className={getImageClasses()}
          style={getImageStyles()}
          onError={handleImageError}
          loading="lazy"
        />
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
