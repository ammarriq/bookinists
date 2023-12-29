// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/",
    "/_image"
  ],
  exclude: []
};

// node_modules/.pnpm/wrangler@3.22.1/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "D:\\Projects\\bookinists\\.wrangler\\tmp\\pages-FORTRN\\bundledWorker-0.10579035523333769.mjs";
export * from "D:\\Projects\\bookinists\\.wrangler\\tmp\\pages-FORTRN\\bundledWorker-0.10579035523333769.mjs";
import { isRoutingRuleMatch } from "D:\\Projects\\bookinists\\node_modules\\.pnpm\\wrangler@3.22.1\\node_modules\\wrangler\\templates\\pages-dev-util.ts";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        if (worker.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return worker.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=zdt08a7rtac.js.map
