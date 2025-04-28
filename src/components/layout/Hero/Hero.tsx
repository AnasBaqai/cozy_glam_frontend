import React from "react";
import Button from "../../ui/Button/Button";

const Hero: React.FC = () => (
  <section className="relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
    {/* Video Background */}
    <video
      className="absolute inset-0 w-full h-full object-cover z-0"
      src={"/hero.mp4"}
      autoPlay
      loop
      muted
      playsInline
      poster="/placeholder-hero.jpg"
    />
    {/* Overlay */}
    <div className="relative z-10 flex flex-col items-start justify-center h-full w-full px-8 md:px-20">
      <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
        Stay Chic, Stay Confident!
      </h1>
      <Button
        variant="outline"
        className="rounded-full px-8 py-3 text-lg font-semibold"
      >
        Buy Now
      </Button>
    </div>
    {/* Overlay for darkening video for text readability */}
    <div className="absolute inset-0 bg-black bg-opacity-30 z-5" />
  </section>
);

export default Hero;
