"use client";

import HeroSection from "./HeroSection";
import FeaturedProducts from "./FeaturedProducts";
import ProductCategories from "./ProductCategories";
import DealsOfTheDay from "./DealsOfTheDay";
import BrandSlider from "./BrandSlider";
import TechNews from "./TechNews";
import NewsletterSignup from "./NewsletterSignup";

export default function Homepage(props: { data: any }) {
  console.log(JSON.parse(props.data));

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProducts />
      <ProductCategories />
      <DealsOfTheDay />
      <BrandSlider />
      <TechNews />
      <NewsletterSignup />
    </div>
  );
}
