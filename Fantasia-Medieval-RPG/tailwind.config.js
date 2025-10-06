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

// tailwind.config.js
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Medieval Sharp'", 'system-ui', 'sans-serif'],
      },
    },
  },
  // ...resto de la config
}

