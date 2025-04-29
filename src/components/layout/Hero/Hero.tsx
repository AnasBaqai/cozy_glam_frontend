import React, { useEffect, useState } from "react";
import Button from "../../ui/Button/Button";

// Modern Hero component with video background and glassmorphic navbar
const Hero: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Nav scroll listener for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative isolate w-full h-[60vh] md:h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
      {/* Video Layer - Preload metadata only, lazy load full video */}
      {!prefersReducedMotion ? (
        <video
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          autoPlay
          muted
          loop
          playsInline
          poster="/placeholder-hero.jpg"
          preload="metadata"
          aria-hidden="true"
        >
          {/* MP4 is widely supported; WebM as fallback for better compression */}
          <source src="/hero.mp4" type="video/mp4" />
          <source src="/hero.webm" type="video/webm" />
        </video>
      ) : (
        <img
          src="/placeholder-hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          aria-hidden="true"
        />
      )}

      {/* Overlay - Dark gradient with brand tint for text contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent z-5"
        aria-hidden="true"
      />

      {/* Glassmorphic Navbar that changes on scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      ></div>

      {/* Content Stack - Centered on all screens */}
      <div className="relative z-10 text-center px-4 md:px-8 max-w-3xl mx-auto pb-4">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Stay Chic, Stay Confident!
        </h1>
        <p className="text-white/90 text-xl mb-6 max-w-2xl mx-auto">
          Discover our exclusive collection of premium quality products designed
          for your lifestyle.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            className="rounded-full px-8 py-3 text-lg font-semibold"
            aria-label="Shop our collection"
          >
            Shop Now
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-8 py-3 text-lg font-semibold border-white text-white bg-white/10 hover:bg-white/20 focus:bg-white/20 transition-colors"
            aria-label="Learn more about our products"
          >
            Learn More
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Hero;
