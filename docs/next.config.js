const basePath = process.env.GITHUB_PAGES ? "/react-color-modal" : "";
module.exports = {
  experimental: {
    basePath
  },
  env: { BASE_PATH: basePath }
}