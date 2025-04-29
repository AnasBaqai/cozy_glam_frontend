import React from "react";
import Hero from "../components/layout/Hero/Hero";
import ProductCollectionCarousel from "../components/collections/ProductCollectionCarousel";
import FeaturesRow from "../components/layout/FeaturesRow/FeaturesRow";
import Footer from "../components/layout/Footer/Footer";
import SectionDivider from "../components/ui/SectionDivider/SectionDivider";

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-glam-light flex flex-col">
    <Hero />
    <SectionDivider variant="dots" />
    <ProductCollectionCarousel />
    <SectionDivider variant="line" />
    <FeaturesRow />
    <SectionDivider variant="dots" />
    <Footer />
  </div>
);

export default HomePage;
