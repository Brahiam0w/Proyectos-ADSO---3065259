import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://proyectos-adso-3065259.vercel.app/",
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    supportFile: false,
  },
});
