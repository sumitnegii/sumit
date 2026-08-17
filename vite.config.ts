import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    command === "build" &&
      nitro({
        preset:
          process.env.NITRO_PRESET ||
          process.env.SERVER_PRESET ||
          (process.env.VERCEL ? "vercel" : "node-server"),
      }),
  ].filter(Boolean),
}));
