import {defineConfig, loadEnv} from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';

const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(__dirname, './www',);

export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [
      vue(),
    ],
    root: SRC_DIR,
    base: '',
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
      },
    },
    resolve: {
      alias: {
        '@': SRC_DIR,
      },
    },
    server: {
      host: true,
    },
  })
}

// export default {
//   plugins: [
//     vue(),
//   ],
//   root: SRC_DIR,
//   base: '',
//   publicDir: PUBLIC_DIR,
//   build: {
//     outDir: BUILD_DIR,
//     assetsInlineLimit: 0,
//     emptyOutDir: true,
//     rollupOptions: {
//       treeshake: false,
//     },
//   },
//   resolve: {
//     alias: {
//       '@': SRC_DIR,
//     },
//   },
//   server: {
//     host: true,
//   },
// };
