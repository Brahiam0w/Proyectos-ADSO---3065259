// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{astro,html,js,ts,jsx,tsx}", // incluye archivos .astro
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        medieval: ['"Medieval Sharp"', 'serif'], // debe coincidir exactamente con @font-face
      },
    },
  },
  plugins: [],
};

