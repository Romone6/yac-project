import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hastingssecondarycollege-h.schools.nsw.gov.au",
        pathname: "/media_1f453bf2bec63fbd379a6fb97be6f03e62ad9793d.jpg",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default withMDX(nextConfig);
