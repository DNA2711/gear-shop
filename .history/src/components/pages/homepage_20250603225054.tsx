"use client";

import HeroSection from "./homepage/HeroSection";
import FeaturedProducts from "./homepage/FeaturedProducts";
import ProductCategories from "./homepage/ProductCategories";
import DealsOfTheDay from "./homepage/DealsOfTheDay";
import NewsletterSignup from "./homepage/NewsletterSignup";

export default function Homepage(props: { data: any }) {
  console.log(JSON.parse(props.data));

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProducts />
      <ProductCategories />
      <DealsOfTheDay />
      <NewsletterSignup />
    </div>
  );
}
