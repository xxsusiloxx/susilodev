const path = require('path');

// Fungsi untuk menjalankan ESLint dengan opsi --fix
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`;

// Export konfigurasi lint-staged
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix --ext .js,.jsx,.ts,.tsx', 'prettier --write'], // Jalankan ESLint dan Prettier pada file JavaScript/TypeScript
  '*.{json,css,md}': ['prettier --write'], // Jalankan Prettier pada file JSON, CSS, dan Markdown
};
