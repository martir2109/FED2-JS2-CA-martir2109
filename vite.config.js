import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5500,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "auth/login/index.html"),
        register: resolve(__dirname, "auth/register/index.html"),
        profile: resolve(__dirname, "profile/index.html"),
        settings: resolve(__dirname, "settings/index.html"),
        search: resolve(__dirname, "search/index.html"),
        post: resolve(__dirname, "post/view/index.html"),
      },
    },
  },
});
