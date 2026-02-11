import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      sass: {
        // Suppress Dart Sass deprecation warnings for @import rules
        // This configuration silences the warnings until libraries like Quasar
        // migrate to the new @use/@forward syntax
        quietDeps: true,
        verbose: false,
        api: 'modern-compiler',
        silenceDeprecations: ['import']
      },
      scss: {
        quietDeps: true,
        verbose: false,
        api: 'modern-compiler',
        silenceDeprecations: ['import']
      }
    }
  }
})
