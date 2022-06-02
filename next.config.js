/** @type {import('next').NextConfig} */
const withYaml = require('next-plugin-yaml')

const nextConfig = {
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'fr', 'de-DE']
  },
  reactStrictMode: true
}

module.exports = withYaml(nextConfig)
