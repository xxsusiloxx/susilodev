const path = require('path');

// Fungsi untuk menjalankan ESLint dengan opsi --fix
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --write'], // Jalankan ESLint dan Prettier di file JS/TS
  '*.{json,css,md}': ['prettier --write'], // Jalankan Prettier di file JSON, CSS, Markdown
};
