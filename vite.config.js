import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import eslintPlugin from "vite-plugin-eslint";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

import { createHtmlPlugin } from "vite-plugin-html";

process.env.TARGET = process.env.TARGET || "web";
const isCordova = process.env.TARGET === "cordova";

const SRC_DIR = fileURLToPath(new URL("./src", import.meta.url));
const PUBLIC_DIR = fileURLToPath(new URL("./public", import.meta.url));
const BUILD_DIR = fileURLToPath(new URL(isCordova ? "./cordova/www" : "./www", import.meta.url));

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      VueI18nPlugin({
        // include: [path.resolve(__dirname, "./locales/**")],
        include: [fileURLToPath(new URL("./locales/**", import.meta.url))],
      }),
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
        treeshake: true,
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
              @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');
            `,
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true,
    },
  });
};
