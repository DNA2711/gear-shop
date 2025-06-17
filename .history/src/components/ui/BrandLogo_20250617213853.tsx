import React, { useState } from "react";

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
  removeWhiteBackground = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-12 h-6",
    md: "w-20 h-8",
    lg: "w-32 h-12",
    xl: "w-40 h-16",
  };

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleClick = () => {
    if (clickable && website) {
      window.open(website, "_blank", "noopener,noreferrer");
    }
  };

  // CSS filters to remove white background
  const getImageStyle = () => {
    const baseStyle = {
      background: 'transparent',
      backgroundColor: 'transparent',
    };

    if (removeWhiteBackground) {
      return {
        ...baseStyle,
        filter: 'contrast(1.2) brightness(0.9) saturate(1.1)',
        mixBlendMode: 'multiply' as const,
        // CSS mask to remove white pixels
        WebkitMask: 'radial-gradient(circle, black 70%, transparent 100%)',
        mask: 'radial-gradient(circle, black 70%, transparent 100%)',
      };
    }

    return baseStyle;
  };

  return (
    <div
      className={`relative brand-logo ${sizeClasses[size]} ${className} ${
        clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      }`}
      onClick={handleClick}
      title={clickable ? `Visit ${brandName} website` : brandName}
      style={{ 
        background: 'transparent',
        backgroundColor: 'transparent'
      }}
    >
      {/* Base64 Image - Force transparent background and remove white */}
      {base64Logo && !imageError && (
        <img
          src={base64Logo}
          alt={`${brandName} logo`}
          className={`w-full h-full object-contain brand-logo-img transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={getImageStyle()}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      )}

      {/* Text Fallback - Only show when no logo or error */}
      <div
        className={`absolute inset-0 ${
          !base64Logo || imageError ? "flex" : "hidden"
        } items-center justify-center 
                   bg-gradient-to-r from-gray-100 to-gray-200 rounded text-gray-700 
                   font-semibold text-xs uppercase tracking-wide`}
        style={{ display: !base64Logo || imageError ? "flex" : "none" }}
      >
        <span className="text-center px-1 leading-tight">{brandName}</span>
      </div>
    </div>
  );
};

export default BrandLogo;
