/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                'https://*-3000.usw3.devtunnels.ms'
            ]
        }
    }
}

export default nextConfig
