import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';


// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind()],
  output: 'server',
  adapter: cloudflare({
    runtime: {
      mode: 'local',
      type: 'pages',
      bindings: {
        SITE_DB: {
          type: 'd1'
        },
        SITE_BUCKET: {
          type: 'r2'
        }
      }
    }
  })
});