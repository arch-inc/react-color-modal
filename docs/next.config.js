const basePath = process.env.GITHUB_PAGES ? "/react-color-modal" : "";

/** @type {import('next').NextConfig} */
module.exports = {
  basePath,
  env: { BASE_PATH: basePath },
};
