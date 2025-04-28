import React from "react";
import Marquee from "../components/layout/Marquee/Marquee";
import Navbar from "../components/layout/Navbar/Navbar";
import Hero from "../components/layout/Hero/Hero";
import FeaturesRow from "../components/layout/FeaturesRow/FeaturesRow";
import Footer from "../components/layout/Footer/Footer";

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-glam-light flex flex-col">
    <Marquee />
    <Navbar />
    <Hero />
    <FeaturesRow />
    <Footer />
  </div>
);

export default HomePage;
