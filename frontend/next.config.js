/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ['backend', 'react-hot-toast'],
  webpack: (config, { isServer }) => {
    // Add support for TypeScript files outside src
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, '../backend/src')
      ],
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext'
            }
          }
        }
      ]
    });

    // Resolve extensions
    config.resolve.extensions.push('.ts', '.tsx');

    // Alias configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/utils': path.resolve(__dirname, '../backend/src/utils'),
      '@/middleware': path.resolve(__dirname, '../backend/src/middleware')
    };

    return config;
  }
};

module.exports = nextConfig;