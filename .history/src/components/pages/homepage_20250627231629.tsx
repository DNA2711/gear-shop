"use client";

import HeroSection from "./homepage/HeroSection";
import FeaturedProducts from "./homepage/FeaturedProducts";
import DealsOfTheDay from "./homepage/DealsOfTheDay";
import BrandSlider from "./homepage/BrandSlider";
import TechNews from "./homepage/TechNews";
import NewsletterSignup from "./homepage/NewsletterSignup";

export default function Homepage(props: { data: any }) {
  console.log(JSON.parse(props.data));

  return (
    <div className="min-h-screen seamless-background">
      <div className="space-y-0">
        <HeroSection />
        <FeaturedProducts />
        <DealsOfTheDay />
        <BrandSlider />
        <TechNews />
        <NewsletterSignup />
      </div>
    </div>
  );
}
