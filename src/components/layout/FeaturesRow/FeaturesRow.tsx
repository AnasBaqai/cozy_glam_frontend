import React from "react";

const features = [
  {
    icon: (
      <svg
        className="h-8 w-8 mx-auto"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="7" width="20" height="13" rx="2" />
        <path d="M16 3h-8v4h8V3z" />
      </svg>
    ),
    title: "Free Shipping",
    desc: "Order today, receive tomorrow",
  },
  {
    icon: (
      <svg
        className="h-8 w-8 mx-auto"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Price-match guarantee",
    desc: "Save money when ordering with us",
  },
  {
    icon: (
      <svg
        className="h-8 w-8 mx-auto"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M19 12H5" />
        <path d="M12 5l-7 7 7 7" />
      </svg>
    ),
    title: "Hassle-free exchange",
    desc: "Receive a slip for exchanges",
  },
  {
    icon: (
      <svg
        className="h-8 w-8 mx-auto"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21.1 12 17.8 5.8 21.1 7 14.1 2 9.3 9 8.5 12 2" />
      </svg>
    ),
    title: "5.0 Google Reviews",
    desc: "Customer satisfaction #1 priority",
  },
];

const FeaturesRow: React.FC = () => (
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 py-8 border-b border-gray-200">
    {features.map((f) => (
      <div key={f.title} className="flex flex-col items-center text-center">
        {f.icon}
        <div className="font-bold mt-2 mb-1 text-gray-900">{f.title}</div>
        <div className="text-sm text-gray-500">{f.desc}</div>
      </div>
    ))}
  </div>
);

export default FeaturesRow;
