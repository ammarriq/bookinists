// ../../../../../../../.wrangler/tmp/bundle-0WE5cs/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// ../../../../../wrangler@3.22.1/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}

// ../../transform.js
var o = async (t, r) => {
  switch (r.from) {
    case "buffer": {
      if (r.to === "blob")
        return new Blob([t]);
      if (r.to === "base64") {
        const f = new Uint8Array(t);
        let s = "";
        for (let n = 0; n < f.byteLength; n++)
          s += String.fromCharCode(f[n]);
        return btoa(s);
      }
      const e = new TextDecoder().decode(t);
      if (r.to === "text")
        return e;
      if (r.to === "json")
        return JSON.parse(e);
      break;
    }
    case "blob": {
      if (r.to === "base64") {
        const e = await t.arrayBuffer();
        return o(e, { from: "buffer", to: "base64" });
      }
      break;
    }
    case "stream": {
      if (r.to === "base64") {
        const e = await t.getReader().read();
        return o(e.value, {
          from: "buffer",
          to: "base64"
        });
      }
      break;
    }
    case "base64": {
      if (r.to === "buffer")
        return Uint8Array.from(atob(t), (e) => e.charCodeAt(0)).buffer;
      if (r.to === "blob") {
        const e = await o(t, {
          from: "base64",
          to: "buffer"
        });
        return new Blob([e]);
      }
      if (r.to === "stream") {
        const e = await o(t, {
          from: "base64",
          to: "buffer"
        }), { readable: f, writable: s } = new FixedLengthStream(e.byteLength), n = s.getWriter();
        return n.write(e), n.close(), f;
      }
      if (r.to === "url")
        return new URL(t);
      break;
    }
    case "url": {
      if (r.to === "text")
        return t.toString();
      break;
    }
    case "request": {
      if (r.to === "text") {
        const e = t;
        return JSON.stringify({
          url: e.url,
          method: e.method,
          headers: [...e.headers.entries()],
          body: await o(await e.arrayBuffer(), {
            from: "buffer",
            to: "base64"
          })
        });
      }
      break;
    }
    case "response": {
      if (r.to === "text") {
        const e = t;
        return JSON.stringify({
          status: e.status,
          statusText: e.statusText,
          headers: [...e.headers.entries()],
          body: await o(await e.arrayBuffer(), { from: "buffer", to: "base64" })
        });
      }
      break;
    }
    case "text": {
      if (r.to === "url")
        return new URL(t);
      if (r.to === "request") {
        const e = JSON.parse(t);
        return new Request(e.url, {
          method: e.method,
          headers: Object.fromEntries(e.headers),
          body: e.body ? await o(e.body, { from: "base64", to: "buffer" }) : void 0
        });
      }
      if (r.to === "response") {
        const e = JSON.parse(t);
        return new Response(
          e.body ? await o(e.body, { from: "base64", to: "buffer" }) : void 0,
          {
            status: e.status,
            statusText: e.statusText,
            headers: Object.fromEntries(e.headers)
          }
        );
      }
      break;
    }
  }
  return t;
};
var u = async (t, r) => t instanceof ArrayBuffer ? {
  transform: { from: "base64", to: "buffer" },
  data: await o(t, { from: "buffer", to: "base64" })
} : t instanceof Blob ? {
  transform: { from: "base64", to: "blob" },
  data: await o(t, { from: "blob", to: "base64" })
} : t instanceof URL ? {
  transform: { from: "text", to: "url" },
  data: await o(t, { from: "url", to: "text" })
} : t instanceof Request ? {
  transform: { from: "text", to: "request" },
  data: await o(t, { from: "request", to: "text" })
} : t instanceof Response ? {
  transform: { from: "text", to: "response" },
  data: await o(t, { from: "response", to: "text" })
} : t !== null && typeof t == "object" && "getReader" in t && typeof t.getReader == "function" ? {
  transform: { from: "base64", to: "stream" },
  data: await o(t, { from: "stream", to: "base64" })
} : r;

// _worker.js
var y = async (o2, u2) => u2.reduce(async (t, { prop: s, args: d }) => (await t)[s](
  ...await Promise.all(
    d.map(async (e) => Array.isArray(e.data) ? Promise.all(
      e.data.map((n) => "__bindingId" in n ? y(o2, n.__calls) : n)
    ) : e.transform ? o(e.data, e.transform) : e.data)
  )
), Promise.resolve(o2));
var w = {
  async fetch(o2, u2) {
    if (o2.method !== "POST")
      return new Response("Method not allowed", { status: 405 });
    try {
      const { __original_call: t, __proxyType: s, __bindingId: d, __calls: e } = await o2.json(), n = t ? t.__bindingId : d;
      let i;
      switch (s) {
        case "caches": {
          const f = caches;
          i = n === "default" ? f.default : await f.open(n);
          break;
        }
        case "binding": {
          i = u2[n];
          break;
        }
        default:
          throw new Error("Unknown proxy type");
      }
      const p = t ? await y(i, t.__calls) : i, a = await y(p, e), r = { success: true, data: a, functions: {} };
      if (r.success) {
        const f = await u(a, { data: a });
        if (r.transform = f.transform, r.data = f.data, a && typeof a == "object" && !Array.isArray(a) && ![Response, Request, URL].find((c) => a instanceof c)) {
          if ("arrayBuffer" in a && typeof a.arrayBuffer == "function") {
            const c = await a.arrayBuffer();
            r.functions.arrayBuffer = await u(c, {
              data: c
            });
          }
          "blob" in a && typeof a.blob == "function" && (r.functions.blob = {
            takeDataFrom: "arrayBuffer",
            transform: { from: "buffer", to: "blob" }
          }), "text" in a && typeof a.text == "function" && (r.functions.text = {
            takeDataFrom: "arrayBuffer",
            transform: { from: "buffer", to: "text" }
          }), "json" in a && typeof a.json == "function" && (r.functions.json = {
            takeDataFrom: "arrayBuffer",
            transform: { from: "buffer", to: "json" }
          }), "body" in a && typeof a.body == "object" && (r.functions.body = {
            takeDataFrom: "arrayBuffer",
            asAccessor: true
          });
        }
      }
      return new Response(JSON.stringify(r), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (t) {
      console.error(t);
      const s = JSON.stringify({
        success: false,
        data: t instanceof Error ? t.message : "Failed to access binding"
      });
      return new Response(s, {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};

// ../../../../../wrangler@3.22.1/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
var jsonError = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default = jsonError;
var wrap = void 0;

// ../../../../../../../.wrangler/tmp/bundle-0WE5cs/middleware-insertion-facade.js
var envWrappers = [wrap].filter(Boolean);
var facade = {
  ...w,
  envWrappers,
  middleware: [
    middleware_miniflare3_json_error_default,
    ...w.middleware ? w.middleware : []
  ].filter(Boolean)
};
var middleware_insertion_facade_default = facade;

// ../../../../../../../.wrangler/tmp/bundle-0WE5cs/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
var __facade_modules_fetch__ = function(request, env, ctx) {
  if (middleware_insertion_facade_default.fetch === void 0)
    throw new Error("Handler does not export a fetch() function.");
  return middleware_insertion_facade_default.fetch(request, env, ctx);
};
function getMaskedEnv(rawEnv) {
  let env = rawEnv;
  if (middleware_insertion_facade_default.envWrappers && middleware_insertion_facade_default.envWrappers.length > 0) {
    for (const wrapFn of middleware_insertion_facade_default.envWrappers) {
      env = wrapFn(env);
    }
  }
  return env;
}
var registeredMiddleware = false;
var facade2 = {
  ...middleware_insertion_facade_default.tail && {
    tail: maskHandlerEnv(middleware_insertion_facade_default.tail)
  },
  ...middleware_insertion_facade_default.trace && {
    trace: maskHandlerEnv(middleware_insertion_facade_default.trace)
  },
  ...middleware_insertion_facade_default.scheduled && {
    scheduled: maskHandlerEnv(middleware_insertion_facade_default.scheduled)
  },
  ...middleware_insertion_facade_default.queue && {
    queue: maskHandlerEnv(middleware_insertion_facade_default.queue)
  },
  ...middleware_insertion_facade_default.test && {
    test: maskHandlerEnv(middleware_insertion_facade_default.test)
  },
  ...middleware_insertion_facade_default.email && {
    email: maskHandlerEnv(middleware_insertion_facade_default.email)
  },
  fetch(request, rawEnv, ctx) {
    const env = getMaskedEnv(rawEnv);
    if (middleware_insertion_facade_default.middleware && middleware_insertion_facade_default.middleware.length > 0) {
      if (!registeredMiddleware) {
        registeredMiddleware = true;
        for (const middleware of middleware_insertion_facade_default.middleware) {
          __facade_register__(middleware);
        }
      }
      const __facade_modules_dispatch__ = function(type, init) {
        if (type === "scheduled" && middleware_insertion_facade_default.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return middleware_insertion_facade_default.scheduled(controller, env, ctx);
        }
      };
      return __facade_invoke__(
        request,
        env,
        ctx,
        __facade_modules_dispatch__,
        __facade_modules_fetch__
      );
    } else {
      return __facade_modules_fetch__(request, env, ctx);
    }
  }
};
function maskHandlerEnv(handler) {
  return (data, env, ctx) => handler(data, getMaskedEnv(env), ctx);
}
var middleware_loader_entry_default = facade2;
export {
  middleware_loader_entry_default as default
};
//# sourceMappingURL=bundledWorker-0.6621119721152684.mjs.map
