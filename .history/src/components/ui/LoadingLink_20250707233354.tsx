"use client";

import Link from "next/link";
import { useInstantLoading } from "@/hooks/useInstantLoading";
import { ComponentProps } from "react";

interface LoadingLinkProps extends ComponentProps<typeof Link> {
  loadingMessage?: string;
  children: React.ReactNode;
}

export function LoadingLink({
  loadingMessage = "Đang chuyển trang...",
  onClick,
  children,
  ...linkProps
}: LoadingLinkProps) {
  const { showInstantLoading } = useInstantLoading();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    showInstantLoading(loadingMessage);

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Link {...linkProps} onClick={handleClick}>
      {children}
    </Link>
  );
}
