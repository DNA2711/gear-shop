"use client";

import React, { useState } from "react";
import CartIcon from "./CartIcon";
import CartDrawer from "./CartDrawer";

interface CartWidgetProps {
  className?: string;
}

export default function CartWidget({ className = "" }: CartWidgetProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <CartIcon onClick={handleOpenDrawer} className={className} />

      <CartDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
    </>
  );
}
