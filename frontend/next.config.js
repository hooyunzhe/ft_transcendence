/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  images: {
    domains: ['upload.wikimedia.org'],
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
