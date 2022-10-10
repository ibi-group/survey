/** @type {import('next').NextConfig} */
const fs = require('fs')

const withYaml = require('next-plugin-yaml')

const { CONFIG_YML_URL, LANGUAGES } = process.env

const nextConfig = {
  i18n: {
    defaultLocale: 'en-US',
    locales: LANGUAGES ? LANGUAGES.split(',') : ['en-US', 'fr', 'de-DE']
  },
  reactStrictMode: true
}

module.exports = async () => {
  if (CONFIG_YML_URL) {
    console.log(
      `Found CONFIG_YML_URL: ${CONFIG_YML_URL}. Downloading and replacing config.yaml`
    )
    const downloadedConfig = await fetch(CONFIG_YML_URL)
    const fileStream = fs.createWriteStream('./config.yaml')
    await downloadedConfig.body.pipe(fileStream)
    console.log(`Downloaded config.yaml`)
  }
  return withYaml(nextConfig)
}
