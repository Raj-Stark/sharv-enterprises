import type { NextConfig } from "next";

const fallbackStrapiUrl = "http://localhost:1337";

function resolveStrapiUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_STRAPI_URL?.trim() || fallbackStrapiUrl);
  } catch {
    return new URL(fallbackStrapiUrl);
  }
}

const strapiUrl = resolveStrapiUrl();
const isLocalStrapi = ["localhost", "127.0.0.1", "::1"].includes(
  strapiUrl.hostname,
);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: isLocalStrapi,
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
