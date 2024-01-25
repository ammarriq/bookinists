/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Depending on your adapter mode
// use `AdvancedRuntime<ENV>` for advance runtime mode
// use `DirectoryRuntime<ENV>` for directory runtime mode

type ENV = {
  SITE_DB: import('@cloudflare/workers-types').D1Database
  SITE_BUCKET: import('@cloudflare/workers-types').R2Bucket
}

type Runtime = import('@astrojs/cloudflare').AdvancedRuntime<ENV>
declare namespace App {
  interface Locals extends Runtime {
    session: import('lucia').Session | null
    user: import('lucia').User | null
  }
}
