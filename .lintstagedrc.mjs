const toClientRelative = (filenames) =>
  filenames
    .map((filename) => `"${filename.replace(/^client\//, "")}"`)
    .join(" ");

const eslintCommand = (filenames) =>
  `pnpm -C client exec eslint --fix ${toClientRelative(filenames)}`;

const prettierCommand = (filenames) =>
  `pnpm -C client exec prettier --write ${toClientRelative(filenames)}`;

const config = {
  "client/**/*.{js,jsx,ts,tsx,mjs,cjs}": [eslintCommand, prettierCommand],
  "client/**/*.{css,json,md,mdx,yml,yaml}": prettierCommand,
};

export default config;
