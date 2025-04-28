import React from "react";
import Marquee from "../components/layout/Marquee/Marquee";
import Navbar from "../components/layout/Navbar/Navbar";
import Hero from "../components/layout/Hero/Hero";

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-glam-light">
    <Marquee />
    <Navbar />
    <Hero />
  </div>
);

export default HomePage;
