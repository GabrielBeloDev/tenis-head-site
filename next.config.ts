import type { NextConfig } from 'next';

// next/image rejeita hostname não declarado, e as fotos do painel vêm do storage do Supabase.
const hostnameDoStorage = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: hostnameDoStorage
      ? [{ protocol: 'https', hostname: hostnameDoStorage, pathname: '/storage/v1/object/public/**' }]
      : [],
  },
};

export default nextConfig;
