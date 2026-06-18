const relativeTo = (pkg, filenames) =>
  filenames
    .map((filename) => `"${filename.replace(new RegExp(`^${pkg}/`), "")}"`)
    .join(" ");

const eslintCommand = (pkg) => (filenames) =>
  `pnpm -C ${pkg} exec eslint --fix ${relativeTo(pkg, filenames)}`;

const prettierCommand = (pkg) => (filenames) =>
  `pnpm -C ${pkg} exec prettier --write ${relativeTo(pkg, filenames)}`;

const config = {
  "client/**/*.{js,jsx,ts,tsx,mjs,cjs}": [
    eslintCommand("client"),
    prettierCommand("client"),
  ],
  "client/**/*.{css,json,md,mdx,yml,yaml}": prettierCommand("client"),
  "server/**/*.{js,ts,mjs,cjs}": [
    eslintCommand("server"),
    prettierCommand("server"),
  ],
  "server/**/*.{json,md,yml,yaml}": prettierCommand("server"),
};

export default config;
