import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keine Herkunftsangabe an verlinkte Seiten (z. B. Quellen im
  // Symptomkatalog) und keine unnötigen Browser-Berechtigungen.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
