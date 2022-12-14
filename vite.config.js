import { resolve } from 'path'
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let buildOptions = {};

  buildOptions = {
    minify: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.js'),
      },
      output: {},
    },
  }

  return {
    build: buildOptions,
  };
});
