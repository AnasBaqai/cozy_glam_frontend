import { useUser } from "../../context/UserContext";
import React, { useState } from "react";
import Marquee from "../layout/Marquee/Marquee";
import Navbar from "../layout/Navbar/Navbar";
import Footer from "../layout/Footer/Footer";
import BusinessInfoFields from "./BusinessInfoFields";
import SocialLinksSetup from "./SocialLinksSetup";

export default function BusinessInfoForm() {
  const { setIsStoreCreated } = useUser();
  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    storeLogo: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    country: "",
    city: "",
    state: "",
    website: "",
    instagram: "",
    facebook: "",
    tiktok: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setSocial = (
    platform: "instagram" | "facebook" | "tiktok",
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [platform]: value }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStoreCreated(true);
  };

  return (
    <div className="min-h-screen bg-glam-light flex flex-col">
      <Marquee />
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 ">
        <section className="grid max-w-6xl w-full gap-10 lg:grid-cols-2 items-center">
          {/* ── Illustration ─────────────────────────────── */}
          <div className="hidden lg:flex items-center justify-center">
            <img
              src="/illustrations/shop_1.png"
              alt="Cozy Glam boutique illustration"
              className="max-w-md w-full opacity-90"
            />
          </div>

          {/* ── Form Card ────────────────────────────────── */}
          <form
            onSubmit={handleContinue}
            className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-sm px-6 py-8 w-full max-w-xl mx-auto"
          >
            {/* Header */}
            <h1 className="font-serif text-3xl font-semibold text-glam-dark mb-1">
              Business&nbsp;Info
            </h1>
            <p className="text-xs text-gray-500 mb-4">Step 2 of 3</p>

            {/* Progress bar */}
            <div className="mb-6 h-1 w-full rounded bg-glam-primary/20">
              <div className="h-full w-2/3 rounded bg-glam-primary" />
            </div>

            {/* Modularized Fields */}
            <BusinessInfoFields form={form} onChange={handleChange} />
            <SocialLinksSetup
              socials={{
                instagram: form.instagram,
                facebook: form.facebook,
                tiktok: form.tiktok,
              }}
              setSocial={setSocial}
            />

            {/* Continue */}
            <button
              type="submit"
              className="mt-2 w-full h-12 rounded-xl bg-glam-primary text-white font-medium text-lg hover:bg-glam-dark active:translate-y-px transition"
            >
              Continue
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
