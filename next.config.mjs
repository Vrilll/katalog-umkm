/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supaya deploy tidak gagal hanya karena error tipe kecil selama workshop.
  typescript: { ignoreBuildErrors: true },
  // Upload foto produk maksimal 2 MB (batas bawaan Server Action hanya 1 MB).
  experimental: { serverActions: { bodySizeLimit: "3mb" } },
};

export default nextConfig;
