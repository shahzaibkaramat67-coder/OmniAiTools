/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com"                         },
      { protocol: "https", hostname: "lh3.googleusercontent.com"                  },
      { protocol: "https", hostname: "avatars.githubusercontent.com"               },
      { protocol: "https", hostname: "oaidalleapiprodscus.blob.core.windows.net"   },
      { protocol: "https", hostname: "replicate.delivery"                          },
    ],
  },
};

export default nextConfig;
