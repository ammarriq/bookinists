import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind(), icon()],
  output: "server",
  adapter: cloudflare({
    runtime: {
      mode: "local",
      bindings: {
        SITE_DB: {
          type: "d1"
        }
      }
    }
  })
});