/** @type {import('next').NextConfig} */
// next.config.js
module.exports = {
    async headers() {
      return [
        {
          source: '/:path*', // Replace with the actual path of your API route
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: 'bhc-client.vercel.app', // Replace with your actual front-end domain
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET,POST,PUT,DELETE',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'X-Requested-With, Content-Type, Authorization',
            },
            {
              key: 'Cache-Control',
              value: 'no-store, max-age=0',
            },
          ],
        },
      ];
    },
  };
  