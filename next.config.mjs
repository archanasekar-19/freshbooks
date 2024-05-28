/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_FRESHBOOKS_CLIENT_ID: process.env.NEXT_PUBLIC_FRESHBOOKS_CLIENT_ID || 'default_client_id',
      NEXT_PUBLIC_FRESHBOOKS_CLIENT_SECRET: process.env.NEXT_PUBLIC_FRESHBOOKS_CLIENT_SECRET || 'default_client_secret',
      NEXT_PUBLIC_FRESHBOOKS_REDIRECT_URI: process.env.NEXT_PUBLIC_FRESHBOOKS_REDIRECT_URI || 'default_redirect_uri',
      NEXT_PUBLIC_FRESHBOOKS_SCOPE: process.env.NEXT_PUBLIC_FRESHBOOKS_SCOPE || 'default_scope'
    },
  };
  export default nextConfig
  
