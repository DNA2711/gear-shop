import React, { useState, useEffect, useRef } from "react";

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
  const [processedImage, setProcessedImage] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizeClasses = {
    sm: "w-12 h-6",
    md: "w-20 h-8",
    lg: "w-32 h-12",
    xl: "w-40 h-16",
  };

  // Process image to remove white background
  useEffect(() => {
    if (base64Logo && removeWhiteBackground) {
      processImageToRemoveWhite(base64Logo);
    }
  }, [base64Logo, removeWhiteBackground]);

  const processImageToRemoveWhite = (imageSrc: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove white/light colored pixels
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // Check if pixel is white or very light
        const isWhiteish = red > 240 && green > 240 && blue > 240;
        const isLight = red > 200 && green > 200 && blue > 200;

        if (isWhiteish) {
          // Make completely transparent
          data[i + 3] = 0;
        } else if (isLight) {
          // Reduce opacity for light colors
          data[i + 3] = Math.max(0, data[i + 3] - 100);
        }
      }

      // Put processed data back
      ctx.putImageData(imageData, 0, 0);

      // Convert to base64
      const processedDataUrl = canvas.toDataURL("image/png");
      setProcessedImage(processedDataUrl);
    };

    img.onerror = () => {
      setProcessedImage(imageSrc); // Fallback to original
    };

    img.src = imageSrc;
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

  // Get the image source to use
  const getImageSrc = () => {
    if (removeWhiteBackground && processedImage) {
      return processedImage;
    }
    return base64Logo;
  };

  // CSS filters to remove white background as fallback
  const getImageStyle = () => {
    const baseStyle = {
      background: "transparent",
      backgroundColor: "transparent",
    };

    if (removeWhiteBackground && !processedImage) {
      return {
        ...baseStyle,
        filter: "contrast(1.3) brightness(0.85) saturate(1.2)",
        mixBlendMode: "multiply" as const,
      };
    }

    return baseStyle;
  };

  const imageSrc = getImageSrc();

  return (
    <div
      className={`relative brand-logo ${sizeClasses[size]} ${className} ${
        clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      }`}
      onClick={handleClick}
      title={clickable ? `Visit ${brandName} website` : brandName}
      style={{
        background: "transparent",
        backgroundColor: "transparent",
      }}
    >
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Base64 Image - Force transparent background and remove white */}
      {imageSrc && !imageError && (
        <img
          src={imageSrc}
          alt={`${brandName} logo`}
          className={`w-full h-full object-contain brand-logo-img transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
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
          !imageSrc || imageError ? "flex" : "hidden"
        } items-center justify-center 
                   bg-gradient-to-r from-gray-100 to-gray-200 rounded text-gray-700 
                   font-semibold text-xs uppercase tracking-wide`}
        style={{ display: !imageSrc || imageError ? "flex" : "none" }}
      >
        <span className="text-center px-1 leading-tight">{brandName}</span>
      </div>
    </div>
  );
};

export default BrandLogo;
