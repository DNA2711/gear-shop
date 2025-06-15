"use client";

import React from "react";
import CartIcon from "./CartIcon";

interface CartWidgetProps {
  className?: string;
}

export default function CartWidget({ className = "" }: CartWidgetProps) {
  return <CartIcon className={className} />;
}
