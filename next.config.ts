import type { NextConfig } from "next";

const developmentScriptPolicy =
  process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${developmentScriptPolicy} https://js.stripe.com https://checkout.stripe.com`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.stripe.com",
              "font-src 'self' data:",
              "connect-src 'self' https://api.stripe.com https://r.stripe.com https://checkout.stripe.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://*.paypal.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(self \"https://js.stripe.com\" \"https://checkout.stripe.com\")",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
