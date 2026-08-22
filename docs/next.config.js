const basePath = process.env.GITHUB_PAGES ? "/react-color-modal" : "";

/** @type {import('next').NextConfig} */
module.exports = {
  basePath,
  compiler: { styledComponents: true },
  env: { BASE_PATH: basePath },
  output: "export",
};
