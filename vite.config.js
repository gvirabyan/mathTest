import { defineConfig, loadEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";

import { createHtmlPlugin } from "vite-plugin-html";

process.env.TARGET = process.env.TARGET || "web";
const isCordova = process.env.TARGET === "cordova";

const SRC_DIR = path.resolve(__dirname, "./src");
const PUBLIC_DIR = path.resolve(__dirname, "./public");
const BUILD_DIR = path.resolve(__dirname, isCordova ? "./cordova/www" : "./www");

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      eslintPlugin(),
      vue(),
      createHtmlPlugin({
        minify: false,
        inject: {
          data: {
            TARGET: process.env.TARGET,
          },
        },
      }),
    ],
    root: SRC_DIR,
    base: "",
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
        output: {
          format: "iife",
          inlineDynamicImports: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
              @import url("https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap");
            `,
        },
      },
    },
    resolve: {
      alias: {
        "@": SRC_DIR,
      },
    },
    server: {
      host: true,
    },
  });
};
