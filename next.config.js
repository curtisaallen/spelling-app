/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// e.g. GH_PAGES_BASE="/spelling-app" (must start with a leading slash, no trailing slash)
const repo = process.env.GH_PAGES_BASE || '/spelling-app';

module.exports = {
  output: 'export',                 // needed for next export
  basePath: isProd ? repo : '',     // basePath for GitHub Pages
  assetPrefix: isProd ? `${repo}/` : '',
  images: { unoptimized: true },    // required if you use next/image with export
  trailingSlash: true,              // GH Pages often prefers this
  productionBrowserSourceMaps: false,
  // swcMinify was removed in Next 15 — do not include it
  // Optional: if you want faster GH Pages deploys with big repos
  // eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true },
};
