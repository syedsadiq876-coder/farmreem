import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@farmreem/types",
    "@farmreem/database",
    "@farmreem/auth",
    "@farmreem/ui",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
