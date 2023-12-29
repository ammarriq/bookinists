// .wrangler/tmp/bundle-iMjSml/checked-fetch.js
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

// node_modules/.pnpm/wrangler@3.22.1/node_modules/wrangler/templates/middleware/common.ts
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

// .wrangler/tmp/pages-FORTRN/bundledWorker-0.10579035523333769.mjs
var urls2 = /* @__PURE__ */ new Set();
function checkURL2(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls2.has(url.toString())) {
      urls2.add(url.toString());
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
    checkURL2(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
globalThis.process = {
  argv: [],
  env: {}
};
var yn = Object.defineProperty;
var M = (e2, t) => () => (e2 && (t = e2(e2 = 0)), t);
var Q = (e2, t) => {
  for (var r in t)
    yn(e2, r, { get: t[r], enumerable: true });
};
function bn(e2) {
  return e2.replace(/\r\n|\r(?!\n)|\n/g, `
`);
}
function vn(e2, t) {
  if (!t || t.line === void 0 || t.column === void 0)
    return "";
  let r = bn(e2).split(`
`).map((i) => i.replace(/\t/g, "  ")), n = [];
  for (let i = -2; i <= 2; i++)
    r[t.line + i] && n.push(t.line + i);
  let s = 0;
  for (let i of n) {
    let o = `> ${i}`;
    o.length > s && (s = o.length);
  }
  let a = "";
  for (let i of n) {
    let o = i === t.line - 1;
    a += o ? "> " : "  ", a += `${i + 1} | ${r[i]}
`, o && (a += `${Array.from({ length: s }).join(" ")}  | ${Array.from({ length: t.column }).join(" ")}^
`);
  }
  return a;
}
function re(e2, t) {
  let r = new RegExp(`\\x1b\\[${t}m`, "g"), n = `\x1B[${e2}m`, s = `\x1B[${t}m`;
  return function(a) {
    return !xn.enabled || a == null ? a : n + (~("" + a).indexOf(s) ? a.replace(r, s + n) : a) + s;
  };
}
function Sn(e2) {
  return !(e2.length !== 3 || !e2[0] || typeof e2[0] != "object");
}
function sr(e2, t, r) {
  let n = t?.split("/").pop()?.replace(".astro", "") ?? "", s = (...a) => {
    if (!Sn(a))
      throw new f({ ...kt, message: kt.message(n) });
    return e2(...a);
  };
  return Object.defineProperty(s, "name", { value: n, writable: false }), s.isAstroComponentFactory = true, s.moduleId = t, s.propagation = r, s;
}
function An(e2) {
  return sr(e2.factory, e2.moduleId, e2.propagation);
}
function V(e2, t, r) {
  return typeof e2 == "function" ? sr(e2, t, r) : An(e2);
}
function $n() {
  return (t) => {
    if (typeof t == "string")
      throw new f({ ..._t, message: _t.message(JSON.stringify(t)) });
    let r = [...Object.values(t)];
    if (r.length === 0)
      throw new f({ ...Ot, message: Ot.message(JSON.stringify(t)) });
    return Promise.all(r.map((n) => n()));
  };
}
function z(e2) {
  return { site: e2 ? new URL(e2) : void 0, generator: `Astro v${st}`, glob: $n() };
}
function jn(e2, t) {
  if (e2[t])
    return e2[t];
  if (e2.ALL)
    return e2.ALL;
}
async function at(e2, t, r, n) {
  let { request: s, url: a } = t, i = s.method?.toUpperCase(), o = jn(e2, i);
  if (!r && r === false && i && i !== "GET" && n.warn(null, `${a.pathname} ${rt(i)} requests are not available for a static site. Update your config to \`output: 'server'\` or \`output: 'hybrid'\` to enable.`), !o || typeof o != "function")
    return new Response(null, { status: 404, headers: { "X-Astro-Response": "Not-Found" } });
  let l = new Proxy(t, { get(p, c) {
    if (c in p)
      return Reflect.get(p, c);
  } });
  return o.call(e2, l, s);
}
function it(e2) {
  return !!e2 && typeof e2 == "object" && typeof e2.then == "function";
}
function In(e2) {
  return Object.prototype.toString.call(e2) === "[object HTMLString]";
}
function Ct(e2) {
  return e2 && typeof e2 == "object" && e2[ar];
}
function ot(e2) {
  return Object.defineProperty(e2, ir, { value: true });
}
function Mn(e2) {
  return e2 && typeof e2 == "object" && e2[ir];
}
function or(e2) {
  var t, r, n = "";
  if (typeof e2 == "string" || typeof e2 == "number")
    n += e2;
  else if (typeof e2 == "object")
    if (Array.isArray(e2))
      for (t = 0; t < e2.length; t++)
        e2[t] && (r = or(e2[t])) && (n && (n += " "), n += r);
    else
      for (t in e2)
        e2[t] && (n && (n += " "), n += t);
  return n;
}
function cr() {
  for (var e2, t, r = 0, n = ""; r < arguments.length; )
    (e2 = arguments[r++]) && (t = or(e2)) && (n && (n += " "), n += t);
  return n;
}
function ke(e2, t = {}, r = /* @__PURE__ */ new WeakSet()) {
  if (r.has(e2))
    throw new Error(`Cyclic reference detected while serializing props for <${t.displayName} client:${t.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  r.add(e2);
  let n = e2.map((s) => pr(s, t, r));
  return r.delete(e2), n;
}
function lr(e2, t = {}, r = /* @__PURE__ */ new WeakSet()) {
  if (r.has(e2))
    throw new Error(`Cyclic reference detected while serializing props for <${t.displayName} client:${t.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  r.add(e2);
  let n = Object.fromEntries(Object.entries(e2).map(([s, a]) => [s, pr(a, t, r)]));
  return r.delete(e2), n;
}
function pr(e2, t = {}, r = /* @__PURE__ */ new WeakSet()) {
  switch (Object.prototype.toString.call(e2)) {
    case "[object Date]":
      return [$.Date, e2.toISOString()];
    case "[object RegExp]":
      return [$.RegExp, e2.source];
    case "[object Map]":
      return [$.Map, ke(Array.from(e2), t, r)];
    case "[object Set]":
      return [$.Set, ke(Array.from(e2), t, r)];
    case "[object BigInt]":
      return [$.BigInt, e2.toString()];
    case "[object URL]":
      return [$.URL, e2.toString()];
    case "[object Array]":
      return [$.JSON, ke(e2, t, r)];
    case "[object Uint8Array]":
      return [$.Uint8Array, Array.from(e2)];
    case "[object Uint16Array]":
      return [$.Uint16Array, Array.from(e2)];
    case "[object Uint32Array]":
      return [$.Uint32Array, Array.from(e2)];
    default:
      return e2 !== null && typeof e2 == "object" ? [$.Value, lr(e2, t, r)] : e2 === void 0 ? [$.Value] : [$.Value, e2];
  }
}
function ur(e2, t) {
  return JSON.stringify(lr(e2, t));
}
function kn(e2, t) {
  let r = { isPage: false, hydration: null, props: {}, propsWithoutTransitionAttributes: {} };
  for (let [n, s] of Object.entries(e2))
    if (n.startsWith("server:") && n === "server:root" && (r.isPage = true), n.startsWith("client:"))
      switch (r.hydration || (r.hydration = { directive: "", value: "", componentUrl: "", componentExport: { value: "" } }), n) {
        case "client:component-path": {
          r.hydration.componentUrl = s;
          break;
        }
        case "client:component-export": {
          r.hydration.componentExport.value = s;
          break;
        }
        case "client:component-hydration":
          break;
        case "client:display-name":
          break;
        default: {
          if (r.hydration.directive = n.split(":")[1], r.hydration.value = s, !t.has(r.hydration.directive)) {
            let a = Array.from(t.keys()).map((i) => `client:${i}`).join(", ");
            throw new Error(`Error: invalid hydration directive "${n}". Supported hydration methods: ${a}`);
          }
          if (r.hydration.directive === "media" && typeof r.hydration.value != "string")
            throw new f(wn);
          break;
        }
      }
    else
      r.props[n] = s, dr.includes(n) || (r.propsWithoutTransitionAttributes[n] = s);
  for (let n of Object.getOwnPropertySymbols(e2))
    r.props[n] = e2[n], r.propsWithoutTransitionAttributes[n] = e2[n];
  return r;
}
async function _n(e2, t) {
  let { renderer: r, result: n, astroId: s, props: a, attrs: i } = e2, { hydrate: o, componentUrl: l, componentExport: p } = t;
  if (!p.value)
    throw new f({ ...Mt, message: Mt.message(t.displayName) });
  let c = { children: "", props: { uid: s } };
  if (i)
    for (let [u, m] of Object.entries(i))
      c.props[u] = ee(m);
  c.props["component-url"] = await n.resolve(decodeURI(l)), r.clientEntrypoint && (c.props["component-export"] = p.value, c.props["renderer-url"] = await n.resolve(decodeURI(r.clientEntrypoint)), c.props.props = ee(ur(a, t))), c.props.ssr = "", c.props.client = o;
  let d = await n.resolve("astro:scripts/before-hydration.js");
  return d.length && (c.props["before-hydration-url"] = d), c.props.opts = ee(JSON.stringify({ name: t.displayName, value: t.hydrateArgs || "" })), dr.forEach((u) => {
    a[u] && (c.props[u] = a[u]);
  }), c;
}
function On(e2) {
  let t = 0;
  if (e2.length === 0)
    return t;
  for (let r = 0; r < e2.length; r++) {
    let n = e2.charCodeAt(r);
    t = (t << 5) - t + n, t = t & t;
  }
  return t;
}
function Cn(e2) {
  let t, r = "", n = On(e2), s = n < 0 ? "Z" : "";
  for (n = Math.abs(n); n >= _e; )
    t = n % _e, n = Math.floor(n / _e), r = Ne[t] + r;
  return n > 0 && (r = Ne[n] + r), s + r;
}
function fr(e2) {
  return e2 == null ? false : e2.isAstroComponentFactory === true;
}
function Nn(e2, t) {
  let r = t.propagation || "none";
  return t.moduleId && e2.componentMetadata.has(t.moduleId) && r === "none" && (r = e2.componentMetadata.get(t.moduleId).propagation), r === "in-tree" || r === "self";
}
function ct(e2) {
  return typeof e2 == "object" && !!e2[Dn];
}
function Fn(e2) {
  return e2._metadata.hasHydrationScript ? false : e2._metadata.hasHydrationScript = true;
}
function Wn(e2, t) {
  return e2._metadata.hasDirectives.has(t) ? false : (e2._metadata.hasDirectives.add(t), true);
}
function Nt(e2, t) {
  let n = e2.clientDirectives.get(t);
  if (!n)
    throw new Error(`Unknown directive: ${t}`);
  return n;
}
function qn(e2, t, r) {
  switch (t) {
    case "both":
      return `${Un}<script>${Nt(e2, r)};${Hn}<\/script>`;
    case "directive":
      return `<script>${Nt(e2, r)}<\/script>`;
  }
  return "";
}
function Kn(e2) {
  let t = "";
  for (let [r, n] of Object.entries(e2))
    t += `const ${Jn(r)} = ${JSON.stringify(n)?.replace(/<\/script>/g, "\\x3C/script>")};
`;
  return v(t);
}
function Ht(e2) {
  return e2.length === 1 ? e2[0] : `${e2.slice(0, -1).join(", ")} or ${e2[e2.length - 1]}`;
}
function P(e2, t, r = true) {
  if (e2 == null)
    return "";
  if (e2 === false)
    return zn.test(t) || Bn.test(t) ? v(` ${t}="false"`) : "";
  if (Gn.has(t))
    return console.warn(`[astro] The "${t}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${t}={value}\`) instead of the dynamic spread syntax (\`{...{ "${t}": value }}\`).`), "";
  if (t === "class:list") {
    let n = F(cr(e2), r);
    return n === "" ? "" : v(` ${t.slice(0, -5)}="${n}"`);
  }
  if (t === "style" && !(e2 instanceof D)) {
    if (Array.isArray(e2) && e2.length === 2)
      return v(` ${t}="${F(`${Dt(e2[0])};${e2[1]}`, r)}"`);
    if (typeof e2 == "object")
      return v(` ${t}="${F(Dt(e2), r)}"`);
  }
  return t === "className" ? v(` class="${F(e2, r)}"`) : e2 === true && (t.startsWith("data-") || Vn.test(t)) ? v(` ${t}`) : v(` ${t}="${F(e2, r)}"`);
}
function De(e2, t = true) {
  let r = "";
  for (let [n, s] of Object.entries(e2))
    r += P(s, n, t);
  return v(r);
}
function Z(e2, { props: t, children: r = "" }, n = true) {
  let { lang: s, "data-astro-id": a, "define:vars": i, ...o } = t;
  return i && (e2 === "style" && (delete o["is:global"], delete o["is:scoped"]), e2 === "script" && (delete o.hoist, r = Kn(i) + `
` + r)), (r == null || r == "") && lt.test(e2) ? `<${e2}${De(o, n)} />` : `<${e2}${De(o, n)}>${r}</${e2}>`;
}
function mr(e2) {
  let t = [], r = { write: (s) => t.push(s) }, n = e2(r);
  return { async renderToFinalDestination(s) {
    for (let a of t)
      s.write(a);
    r.write = (a) => s.write(a), await n;
  } };
}
function Ut(e2) {
  e2._metadata.hasRenderedHead = true;
  let t = Array.from(e2.styles).filter(Oe).map((a) => a.props.rel === "stylesheet" ? Z("link", a) : Z("style", a));
  e2.styles.clear();
  let r = Array.from(e2.scripts).filter(Oe).map((a) => Z("script", a, false)), n = Array.from(e2.links).filter(Oe).map((a) => Z("link", a, false)), s = t.join(`
`) + n.join(`
`) + r.join(`
`);
  if (e2._metadata.extraHead.length > 0)
    for (let a of e2._metadata.extraHead)
      s += a;
  return v(s);
}
function* hr() {
  yield ot({ type: "head" });
}
function* B() {
  yield ot({ type: "maybe-head" });
}
function Yn(e2) {
  return !!e2[He];
}
function fe(e2, t, r) {
  return !t && r ? fe(e2, r) : { async render(n) {
    await W(n, typeof t == "function" ? t(e2) : t);
  } };
}
async function H(e2, t, r) {
  let n = "", s = null, a = { write(o) {
    o instanceof Response || (typeof o == "object" && "type" in o && typeof o.type == "string" ? (s === null && (s = []), s.push(o)) : n += _(e2, o));
  } };
  return await fe(e2, t, r).render(a), v(new ie(n, s));
}
async function gr(e2, t = {}) {
  let r = null, n = {};
  return t && await Promise.all(Object.entries(t).map(([s, a]) => H(e2, a).then((i) => {
    i.instructions && (r === null && (r = []), r.push(...i.instructions)), n[s] = i;
  }))), { slotInstructions: r, children: n };
}
function pt(e2, t) {
  if (Mn(t)) {
    let r = t;
    switch (r.type) {
      case "directive": {
        let { hydration: n } = r, s = n && Fn(e2), a = n && Wn(e2, n.directive), i = s ? "both" : a ? "directive" : null;
        if (i) {
          let o = qn(e2, i, n.directive);
          return v(o);
        } else
          return "";
      }
      case "head":
        return e2._metadata.hasRenderedHead || e2.partial ? "" : Ut(e2);
      case "maybe-head":
        return e2._metadata.hasRenderedHead || e2._metadata.headInTree || e2.partial ? "" : Ut(e2);
      default:
        throw new Error(`Unknown chunk type: ${t.type}`);
    }
  } else {
    if (t instanceof Response)
      return "";
    if (Yn(t)) {
      let r = "", n = t;
      if (n.instructions)
        for (let s of n.instructions)
          r += pt(e2, s);
      return r += t.toString(), r;
    }
  }
  return t.toString();
}
function _(e2, t) {
  return ArrayBuffer.isView(t) ? Zn.decode(t) : pt(e2, t);
}
function es(e2, t) {
  if (ArrayBuffer.isView(t))
    return t;
  {
    let r = pt(e2, t);
    return oe.encode(r.toString());
  }
}
function ts(e2) {
  return !!e2 && typeof e2 == "object" && "render" in e2 && typeof e2.render == "function";
}
async function W(e2, t) {
  if (t = await t, t instanceof ie)
    e2.write(t);
  else if (In(t))
    e2.write(t);
  else if (Array.isArray(t)) {
    let r = t.map((n) => mr((s) => W(s, n)));
    for (let n of r)
      n && await n.renderToFinalDestination(e2);
  } else if (typeof t == "function")
    await W(e2, t());
  else if (typeof t == "string")
    e2.write(v(ee(t)));
  else if (!(!t && t !== 0))
    if (ts(t))
      await t.render(e2);
    else if (br(t))
      await t.render(e2);
    else if (ss(t))
      await t.render(e2);
    else if (ArrayBuffer.isView(t))
      e2.write(t);
    else if (typeof t == "object" && (Symbol.asyncIterator in t || Symbol.iterator in t))
      for await (let r of t)
        await W(e2, r);
    else
      e2.write(t);
}
function rs(e2, t) {
  if (e2 != null)
    for (let r of Object.keys(e2))
      r.startsWith("client:") && console.warn(`You are attempting to render <${t} ${r} />, but ${t} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`);
}
function ns(e2, t, r, n, s = {}) {
  rs(n, t);
  let a = new Ue(e2, n, s, r);
  return Nn(e2, r) && e2._metadata.propagators.add(a), a;
}
function ss(e2) {
  return typeof e2 == "object" && !!e2[yr];
}
function br(e2) {
  return typeof e2 == "object" && !!e2[wr];
}
function L(e2, ...t) {
  return new Fe(e2, t);
}
async function vr(e2, t, r, n, s = false, a) {
  let i = await xr(e2, t, r, n, a);
  if (i instanceof Response)
    return i;
  let o = "", l = false, p = { write(c) {
    if (s && !l && (l = true, !e2.partial && !/<!doctype html/i.test(String(c)))) {
      let d = e2.compressHTML ? "<!DOCTYPE html>" : `<!DOCTYPE html>
`;
      o += d;
    }
    c instanceof Response || (o += _(e2, c));
  } };
  return await i.render(p), o;
}
async function as(e2, t, r, n, s = false, a) {
  let i = await xr(e2, t, r, n, a);
  if (i instanceof Response)
    return i;
  let o = false;
  return s && await is(e2), new ReadableStream({ start(l) {
    let p = { write(c) {
      if (s && !o && (o = true, !e2.partial && !/<!doctype html/i.test(String(c)))) {
        let u = e2.compressHTML ? "<!DOCTYPE html>" : `<!DOCTYPE html>
`;
        l.enqueue(oe.encode(u));
      }
      if (c instanceof Response)
        throw new f({ ...pe });
      let d = es(e2, c);
      l.enqueue(d);
    } };
    (async () => {
      try {
        await i.render(p), l.close();
      } catch (c) {
        f.is(c) && !c.loc && c.setLocation({ file: a?.component }), setTimeout(() => l.error(c), 0);
      }
    })();
  } });
}
async function xr(e2, t, r, n, s) {
  let a = await t(e2, r, n);
  if (a instanceof Response)
    return a;
  if (!br(a))
    throw new f({ ...Tt, message: Tt.message(s?.route, typeof a), location: { file: s?.component } });
  return ct(a) ? a.content : a;
}
async function is(e2) {
  let t = e2._metadata.propagators.values();
  for (; ; ) {
    let { value: r, done: n } = t.next();
    if (n)
      break;
    let s = await r.init(e2);
    ct(s) && e2._metadata.extraHead.push(s.head);
  }
}
function os(e2) {
  return typeof HTMLElement < "u" && HTMLElement.isPrototypeOf(e2);
}
async function cs(e2, t, r, n) {
  let s = ls(t), a = "";
  for (let i in r)
    a += ` ${i}="${F(await r[i])}"`;
  return v(`<${s}${a}>${await H(e2, n?.default)}</${s}>`);
}
function ls(e2) {
  let t = customElements.getName(e2);
  return t || e2.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
}
function us(e2) {
  switch (e2?.split(".").pop()) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue", "@astrojs/svelte", "@astrojs/lit"];
  }
}
function ds(e2) {
  return e2 === Qn;
}
function fs(e2) {
  return e2 && e2["astro:html"] === true;
}
function gs(e2, t) {
  let r = t ? hs : ms;
  return e2.replace(r, "");
}
async function ys(e2, t, r, n, s = {}) {
  if (!r && !n["client:only"])
    throw new Error(`Unable to render ${t} because it is ${r}!
Did you forget to import the component or is it possible there is a typo?`);
  let { renderers: a, clientDirectives: i } = e2, o = { astroStaticSlot: true, displayName: t }, { hydration: l, isPage: p, props: c, propsWithoutTransitionAttributes: d } = kn(n, i), u = "", m;
  l && (o.hydrate = l.directive, o.hydrateArgs = l.value, o.componentExport = l.componentExport, o.componentUrl = l.componentUrl);
  let b = us(o.componentUrl), w = a.filter((h) => h.name !== "astro:jsx"), { children: g, slotInstructions: S } = await gr(e2, s), y;
  if (o.hydrate !== "only") {
    let h = false;
    try {
      h = r && r[Ft];
    } catch {
    }
    if (h) {
      let x = r[Ft];
      y = a.find(({ name: A }) => A === x);
    }
    if (!y) {
      let x;
      for (let A of a)
        try {
          if (await A.ssr.check.call({ result: e2 }, r, c, g)) {
            y = A;
            break;
          }
        } catch (Y) {
          x ??= Y;
        }
      if (!y && x)
        throw x;
    }
    if (!y && typeof HTMLElement == "function" && os(r)) {
      let x = await cs(e2, r, n, s);
      return { render(A) {
        A.write(x);
      } };
    }
  } else {
    if (o.hydrateArgs) {
      let h = o.hydrateArgs, x = Wt.has(h) ? Wt.get(h) : h;
      y = a.find(({ name: A }) => A === `@astrojs/${x}` || A === x);
    }
    if (!y && w.length === 1 && (y = w[0]), !y) {
      let h = o.componentUrl?.split(".").pop();
      y = a.filter(({ name: x }) => x === `@astrojs/${h}` || x === h)[0];
    }
  }
  if (y)
    o.hydrate === "only" ? u = await H(e2, s?.fallback) : { html: u, attrs: m } = await y.ssr.renderToStaticMarkup.call({ result: e2 }, r, d, g, o);
  else {
    if (o.hydrate === "only")
      throw new f({ ...Me, message: Me.message(o.displayName), hint: Me.hint(b.map((h) => h.replace("@astrojs/", "")).join("|")) });
    if (typeof r != "string") {
      let h = w.filter((A) => b.includes(A.name)), x = w.length > 1;
      if (h.length === 0)
        throw new f({ ...Ie, message: Ie.message(o.displayName, o?.componentUrl?.split(".").pop(), x, w.length), hint: Ie.hint(Ht(b.map((A) => "`" + A + "`"))) });
      if (h.length === 1)
        y = h[0], { html: u, attrs: m } = await y.ssr.renderToStaticMarkup.call({ result: e2 }, r, d, g, o);
      else
        throw new Error(`Unable to render ${o.displayName}!

This component likely uses ${Ht(b)},
but Astro encountered an error during server-side rendering.

Please ensure that ${o.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
    }
  }
  if (y && !y.clientEntrypoint && y.name !== "@astrojs/lit" && o.hydrate)
    throw new f({ ...It, message: It.message(t, o.hydrate, y.name) });
  if (!u && typeof r == "string") {
    let h = ws(r), x = Object.values(g).join(""), A = L`<${h}${De(c)}${v(x === "" && lt.test(h) ? "/>" : `>${x}</${h}>`)}`;
    u = "";
    let Y = { write(Lt) {
      Lt instanceof Response || (u += _(e2, Lt));
    } };
    await A.render(Y);
  }
  if (!l)
    return { render(h) {
      if (S)
        for (let x of S)
          h.write(x);
      p || y?.name === "astro:jsx" ? h.write(u) : u && u.length > 0 && h.write(v(gs(u, y?.ssr?.supportsAstroStaticSlot ?? false)));
    } };
  let T = Cn(`<!--${o.componentExport.value}:${o.componentUrl}-->
${u}
${ur(c, o)}`), R = await _n({ renderer: y, result: e2, astroId: T, props: c, attrs: m }, o), I = [];
  if (u) {
    if (Object.keys(g).length > 0)
      for (let h of Object.keys(g)) {
        let x = y?.ssr?.supportsAstroStaticSlot ? o.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot", A = h === "default" ? `<${x}>` : `<${x} name="${h}">`;
        u.includes(A) || I.push(h);
      }
  } else
    I = Object.keys(g);
  let E = I.length > 0 ? I.map((h) => `<template data-astro-template${h !== "default" ? `="${h}"` : ""}>${g[h]}</template>`).join("") : "";
  return R.children = `${u ?? ""}${E}`, R.children && (R.props["await-children"] = "", R.children += "<!--astro:end-->"), { render(h) {
    if (S)
      for (let x of S)
        h.write(x);
    h.write(ot({ type: "directive", hydration: l })), h.write(v(Z("astro-island", R, false)));
  } };
}
function ws(e2) {
  let t = /[&<>'"\s]+/g;
  return t.test(e2) ? e2.trim().split(t)[0].trim() : e2;
}
async function bs(e2, t = {}) {
  let r = await H(e2, t?.default);
  return { render(n) {
    r != null && n.write(r);
  } };
}
async function vs(e2, t, r, n = {}) {
  let { slotInstructions: s, children: a } = await gr(e2, n), i = t({ slots: a }), o = s ? s.map((l) => _(e2, l)).join("") : "";
  return { render(l) {
    l.write(v(o + i));
  } };
}
function xs(e2, t, r, n, s = {}) {
  let a = ns(e2, t, r, n, s);
  return { async render(i) {
    await a.render(i);
  } };
}
async function ut(e2, t, r, n, s = {}) {
  return it(r) && (r = await r), ds(r) ? await bs(e2, s) : (n = Ss(n), fs(r) ? await vs(e2, r, n, s) : fr(r) ? xs(e2, t, r, n, s) : await ys(e2, t, r, n, s));
}
function Ss(e2) {
  if (e2["class:list"] !== void 0) {
    let t = e2["class:list"];
    delete e2["class:list"], e2.class = cr(e2.class, t), e2.class === "" && delete e2.class;
  }
  return e2;
}
async function We(e2, t, r, n, s = {}, a = false, i) {
  let o = "", l = false, p = "";
  if (As(r))
    for (let c of B())
      p += _(e2, c);
  try {
    let c = { write(u) {
      if (a && !l && (l = true, !e2.partial && !/<!doctype html/i.test(String(u)))) {
        let m = e2.compressHTML ? "<!DOCTYPE html>" : `<!DOCTYPE html>
`;
        o += m + p;
      }
      u instanceof Response || (o += _(e2, u));
    } };
    await (await ut(e2, t, r, n, s)).render(c);
  } catch (c) {
    throw f.is(c) && !c.loc && c.setLocation({ file: i?.component }), c;
  }
  return o;
}
function As(e2) {
  return !!e2?.[ps];
}
async function k(e2, t) {
  switch (true) {
    case t instanceof D:
      return t.toString().trim() === "" ? "" : t;
    case typeof t == "string":
      return v(ee(t));
    case typeof t == "function":
      return t;
    case (!t && t !== 0):
      return "";
    case Array.isArray(t):
      return v((await Promise.all(t.map((n) => k(e2, n)))).join(""));
  }
  let r;
  return t.props ? t.props[N.symbol] ? r = t.props[N.symbol] : r = new N(t) : r = new N(t), Ve(e2, t, r);
}
async function Ve(e2, t, r) {
  if (Ct(t)) {
    switch (true) {
      case !t.type:
        throw new Error(`Unable to render ${e2.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      case t.type === Symbol.for("astro:fragment"):
        return k(e2, t.props.children);
      case t.type.isAstroComponentFactory: {
        let n = {}, s = {};
        for (let [o, l] of Object.entries(t.props ?? {}))
          o === "children" || l && typeof l == "object" && l.$$slot ? s[o === "children" ? "default" : o] = () => k(e2, l) : n[o] = l;
        let a = await vr(e2, t.type, n, s);
        if (a instanceof Response)
          throw a;
        return v(a);
      }
      case (!t.type && t.type !== 0):
        return "";
      case (typeof t.type == "string" && t.type !== qt):
        return v(await $s(e2, t.type, t.props ?? {}));
    }
    if (t.type) {
      let n = function(c) {
        if (Array.isArray(c))
          return c.map((d) => n(d));
        if (!Ct(c)) {
          i.default.push(c);
          return;
        }
        if ("slot" in c.props) {
          i[c.props.slot] = [...i[c.props.slot] ?? [], c], delete c.props.slot;
          return;
        }
        i.default.push(c);
      };
      if (typeof t.type == "function" && t.type["astro:renderer"] && r.increment(), typeof t.type == "function" && t.props["server:root"]) {
        let c = await t.type(t.props ?? {});
        return await k(e2, c);
      }
      if (typeof t.type == "function")
        if (r.haveNoTried() || r.isCompleted()) {
          Rs();
          try {
            let c = await t.type(t.props ?? {}), d;
            if (c?.[ar])
              return d = await Ve(e2, c, r), d;
            if (!c)
              return d = await Ve(e2, c, r), d;
          } catch (c) {
            if (r.isCompleted())
              throw c;
            r.increment();
          } finally {
            Es();
          }
        } else
          r.increment();
      let { children: s = null, ...a } = t.props ?? {}, i = { default: [] };
      n(s);
      for (let [c, d] of Object.entries(a))
        d.$$slot && (i[c] = d, delete a[c]);
      let o = [], l = {};
      for (let [c, d] of Object.entries(i))
        o.push(k(e2, d).then((u) => {
          u.toString().trim().length !== 0 && (l[c] = () => u);
        }));
      await Promise.all(o), a[N.symbol] = r;
      let p;
      return t.type === qt && t.props["client:only"] ? p = await We(e2, t.props["client:display-name"] ?? "", null, a, l) : p = await We(e2, typeof t.type == "function" ? t.type.name : t.type, t.type, a, l), v(p);
    }
  }
  return v(`${t}`);
}
async function $s(e2, t, { children: r, ...n }) {
  return v(`<${t}${O(n)}${v((r == null || r == "") && lt.test(t) ? "/>" : `>${r == null ? "" : await k(e2, js(t, r))}</${t}>`)}`);
}
function js(e2, t) {
  return typeof t == "string" && (e2 === "style" || e2 === "script") ? v(t) : t;
}
function Rs() {
  if (dt++, !qe) {
    qe = console.error;
    try {
      console.error = Ps;
    } catch {
    }
  }
}
function Es() {
  dt--;
}
function Ps(e2, ...t) {
  dt > 0 && typeof e2 == "string" && e2.includes("Warning: Invalid hook call.") && e2.includes("https://reactjs.org/link/invalid-hook-call") || qe(e2, ...t);
}
async function Sr(e2, t, r, n, s, a) {
  if (!fr(t)) {
    e2._metadata.headInTree = e2.componentMetadata.get(t.moduleId)?.containsHead ?? false;
    let c = { ...r ?? {}, "server:root": true }, d = await We(e2, t.name, t, c, {}, true, a), u = oe.encode(d);
    return new Response(u, { headers: new Headers([["Content-Type", "text/html; charset=utf-8"], ["Content-Length", u.byteLength.toString()]]) });
  }
  e2._metadata.headInTree = e2.componentMetadata.get(t.moduleId)?.containsHead ?? false;
  let i;
  if (s ? i = await as(e2, t, r, n, true, a) : i = await vr(e2, t, r, n, true, a), i instanceof Response)
    return i;
  let o = e2.response, l = new Headers(o.headers);
  return !s && typeof i == "string" && (i = oe.encode(i), l.set("Content-Length", i.byteLength.toString())), a?.component.endsWith(".md") && l.set("Content-Type", "text/html; charset=utf-8"), new Response(i, { ...o, headers: l });
}
function O(e2 = {}, t, { class: r } = {}) {
  let n = "";
  r && (typeof e2.class < "u" ? e2.class += ` ${r}` : typeof e2["class:list"] < "u" ? e2["class:list"] = [e2["class:list"], r] : e2.class = r);
  for (let [s, a] of Object.entries(e2))
    n += P(a, s, true);
  return v(n);
}
var te;
var ze;
var ce;
var Tt;
var wn;
var Ie;
var It;
var Me;
var Be;
var Ge;
var Vt;
var Je;
var zt;
var Xe;
var Mt;
var kt;
var Ke;
var Ye;
var Bt;
var Qe;
var Ze;
var Gt;
var le;
var q;
var et;
var Jt;
var pe;
var Xt;
var ue;
var de;
var tt;
var _t;
var Ot;
var Kt;
var f;
var Ce;
var Yt;
var Qt;
var Zt;
var er;
var xn;
var rt;
var nt;
var tr;
var rr;
var nr;
var st;
var Rn;
var En;
var Pn;
var Ln;
var Tn;
var ee;
var D;
var v;
var ar;
var ir;
var $;
var dr;
var Ne;
var _e;
var Dn;
var Hn;
var Un;
var lt;
var Vn;
var zn;
var Bn;
var Gn;
var Jn;
var F;
var Xn;
var Dt;
var Oe;
var He;
var ie;
var Qn;
var Ft;
var oe;
var Zn;
var yr;
var Ue;
var wr;
var Fe;
var ps;
var Wt;
var ms;
var hs;
var qt;
var N;
var qe;
var dt;
var G = M(() => {
  "use strict";
  te = { name: "ClientAddressNotAvailable", title: "`Astro.clientAddress` is not available in current adapter.", message: (e2) => `\`Astro.clientAddress\` is not available in the \`${e2}\` adapter. File an issue with the adapter to add support.` }, ze = { name: "StaticClientAddressNotAvailable", title: "`Astro.clientAddress` is not available in static mode.", message: "`Astro.clientAddress` is only available when using `output: 'server'` or `output: 'hybrid'`. Update your Astro config if you need SSR features.", hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information on how to enable SSR." }, ce = { name: "NoMatchingStaticPathFound", title: "No static path found for requested path.", message: (e2) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${e2}\`.`, hint: (e2) => `Possible dynamic routes being matched: ${e2.join(", ")}.` }, Tt = { name: "OnlyResponseCanBeReturned", title: "Invalid type returned by Astro page.", message: (e2, t) => `Route \`${e2 || ""}\` returned a \`${t}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`, hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information." }, wn = { name: "MissingMediaQueryDirective", title: "Missing value for `client:media` directive.", message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided' }, Ie = { name: "NoMatchingRenderer", title: "No matching renderer found.", message: (e2, t, r, n) => `Unable to render \`${e2}\`.

${n > 0 ? `There ${r ? "are" : "is"} ${n} renderer${r ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${r ? "none were" : "it was not"} able to server-side render \`${e2}\`.` : `No valid renderer was found ${t ? `for the \`.${t}\` file extension.` : "for this file extension."}`}`, hint: (e2) => `Did you mean to enable the ${e2} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.` }, It = { name: "NoClientEntrypoint", title: "No client entrypoint specified in renderer.", message: (e2, t, r) => `\`${e2}\` component has a \`client:${t}\` directive, but no client entrypoint was provided by \`${r}\`.`, hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer." }, Me = { name: "NoClientOnlyHint", title: "Missing hint on client:only directive.", message: (e2) => `Unable to render \`${e2}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`, hint: (e2) => `Did you mean to pass \`client:only="${e2}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only` }, Be = { name: "InvalidGetStaticPathsEntry", title: "Invalid entry inside getStaticPath's return value", message: (e2) => `Invalid entry returned by getStaticPaths. Expected an object, got \`${e2}\``, hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths." }, Ge = { name: "InvalidGetStaticPathsReturn", title: "Invalid value returned by getStaticPaths.", message: (e2) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${e2}\``, hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths." }, Vt = { name: "GetStaticPathsExpectedParams", title: "Missing params property on `getStaticPaths` route.", message: "Missing or empty required `params` property on `getStaticPaths` route.", hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths." }, Je = { name: "GetStaticPathsInvalidRouteParam", title: "Invalid value for `getStaticPaths` route parameter.", message: (e2, t, r) => `Invalid getStaticPaths route parameter for \`${e2}\`. Expected undefined, a string or a number, received \`${r}\` (\`${t}\`)`, hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths." }, zt = { name: "GetStaticPathsRequired", title: "`getStaticPaths()` function required for dynamic routes.", message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.", hint: 'See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.\n\nAlternatively, set `output: "server"` or `output: "hybrid"` in your Astro config file to switch to a non-static server build. This error can also occur if using `export const prerender = true;`.\nSee https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.' }, Xe = { name: "ReservedSlotName", title: "Invalid slot name.", message: (e2) => `Unable to create a slot named \`${e2}\`. \`${e2}\` is a reserved slot name. Please update the name of this slot.` }, Mt = { name: "NoMatchingImport", title: "No import found for component.", message: (e2) => `Could not render \`${e2}\`. No matching import has been found for \`${e2}\`.`, hint: "Please make sure the component is properly imported." }, kt = { name: "InvalidComponentArgs", title: "Invalid component arguments.", message: (e2) => `Invalid arguments passed to${e2 ? ` <${e2}>` : ""} component.`, hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`." }, Ke = { name: "PageNumberParamNotFound", title: "Page number param not found.", message: (e2) => `[paginate()] page number param \`${e2}\` not found in your filepath.`, hint: "Rename your file to `[page].astro` or `[...page].astro`." }, Ye = { name: "ImageMissingAlt", title: 'Image missing required "alt" property.', message: 'Image missing "alt" property. "alt" text is required to describe important images on the page.', hint: 'Use an empty string ("") for decorative images.' }, Bt = { name: "InvalidImageService", title: "Error while loading image service.", message: "There was an error loading the configured image service. Please see the stack trace for more information." }, Qe = { name: "MissingImageDimension", title: "Missing image dimensions", message: (e2, t) => `Missing ${e2 === "both" ? "width and height attributes" : `${e2} attribute`} for ${t}. When using remote images, both dimensions are always required in order to avoid CLS.`, hint: "If your image is inside your `src` folder, you probably meant to import it instead. See [the Imports guide for more information](https://docs.astro.build/en/guides/imports/#other-assets)." }, Ze = { name: "UnsupportedImageFormat", title: "Unsupported image format", message: (e2, t, r) => `Received unsupported format \`${e2}\` from \`${t}\`. Currently only ${r.join(", ")} are supported by our image services.`, hint: "Using an `img` tag directly instead of the `Image` component might be what you're looking for." }, Gt = { name: "UnsupportedImageConversion", title: "Unsupported image conversion", message: "Converting between vector (such as SVGs) and raster (such as PNGs and JPEGs) images is not currently supported." }, le = { name: "PrerenderDynamicEndpointPathCollide", title: "Prerendered dynamic endpoint has path collision.", message: (e2) => `Could not render \`${e2}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`, hint: (e2) => `Rename \`${e2}\` to \`${e2.replace(/\.(js|ts)/, (t) => ".json" + t)}\`` }, q = { name: "ExpectedImage", title: "Expected src to be an image.", message: (e2, t, r) => `Expected \`src\` property for \`getImage\` or \`<Image />\` to be either an ESM imported image or a string with the path of a remote image. Received \`${e2}\` (type: \`${t}\`).

Full serialized options received: \`${r}\`.`, hint: "This error can often happen because of a wrong path. Make sure the path to your image is correct. If you're passing an async function, make sure to call and await it." }, et = { name: "ExpectedImageOptions", title: "Expected image options.", message: (e2) => `Expected getImage() parameter to be an object. Received \`${e2}\`.` }, Jt = { name: "IncompatibleDescriptorOptions", title: "Cannot set both `densities` and `widths`", message: "Only one of `densities` or `widths` can be specified. In most cases, you'll probably want to use only `widths` if you require specific widths.", hint: "Those attributes are used to construct a `srcset` attribute, which cannot have both `x` and `w` descriptors." }, pe = { name: "ResponseSentError", title: "Unable to set response.", message: "The response has already been sent to the browser and cannot be altered." }, Xt = { name: "MiddlewareNoDataOrNextCalled", title: "The middleware didn't return a `Response`.", message: "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function." }, ue = { name: "MiddlewareNotAResponse", title: "The middleware returned something that is not a `Response` object.", message: "Any data returned from middleware must be a valid `Response` object." }, de = { name: "LocalsNotAnObject", title: "Value assigned to `locals` is not accepted.", message: "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.", hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`." }, tt = { name: "LocalImageUsedWrongly", title: "Local images must be imported.", message: (e2) => `\`Image\`'s and \`getImage\`'s \`src\` parameter must be an imported image or an URL, it cannot be a string filepath. Received \`${e2}\`.`, hint: "If you want to use an image from your `src` folder, you need to either import it or if the image is coming from a content collection, use the [image() schema helper](https://docs.astro.build/en/guides/images/#images-in-content-collections) See https://docs.astro.build/en/guides/images/#src-required for more information on the `src` property." }, _t = { name: "AstroGlobUsedOutside", title: "Astro.glob() used outside of an Astro file.", message: (e2) => `\`Astro.glob(${e2})\` can only be used in \`.astro\` files. \`import.meta.glob(${e2})\` can be used instead to achieve a similar result.`, hint: "See Vite's documentation on `import.meta.glob` for more information: https://vitejs.dev/guide/features.html#glob-import" }, Ot = { name: "AstroGlobNoMatch", title: "Astro.glob() did not match any files.", message: (e2) => `\`Astro.glob(${e2})\` did not return any matching files. Check the pattern for typos.` }, Kt = { name: "CantRenderPage", title: "Astro can't render the route.", message: "Astro cannot find any content to render for this route. There is no file or redirect associated with this route.", hint: "If you expect to find a route here, this may be an Astro bug. Please file an issue/restart the dev server" };
  f = class extends Error {
    loc;
    title;
    hint;
    frame;
    type = "AstroError";
    constructor(t, ...r) {
      super(...r);
      let { name: n, title: s, message: a, stack: i, location: o, hint: l, frame: p } = t;
      this.title = s, this.name = n, a && (this.message = a), this.stack = i || this.stack, this.loc = o, this.hint = l, this.frame = p;
    }
    setLocation(t) {
      this.loc = t;
    }
    setName(t) {
      this.name = t;
    }
    setMessage(t) {
      this.message = t;
    }
    setHint(t) {
      this.hint = t;
    }
    setFrame(t, r) {
      this.frame = vn(t, r);
    }
    static is(t) {
      return t.type === "AstroError";
    }
  }, er = true;
  typeof process < "u" && ({ FORCE_COLOR: Ce, NODE_DISABLE_COLORS: Yt, NO_COLOR: Qt, TERM: Zt } = process.env || {}, er = process.stdout && process.stdout.isTTY);
  xn = { enabled: !Yt && Qt == null && Zt !== "dumb" && (Ce != null && Ce !== "0" || er) };
  rt = re(1, 22), nt = re(2, 22), tr = re(31, 39), rr = re(33, 39), nr = re(34, 39);
  st = "4.0.7";
  ({ replace: Rn } = ""), En = /[&<>'"]/g, Pn = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }, Ln = (e2) => Pn[e2], Tn = (e2) => Rn.call(e2, En, Ln);
  ee = Tn, D = class extends String {
    get [Symbol.toStringTag]() {
      return "HTMLString";
    }
  }, v = (e2) => e2 instanceof D ? e2 : typeof e2 == "string" ? new D(e2) : e2;
  ar = "astro:jsx";
  ir = Symbol.for("astro:render");
  $ = { Value: 0, JSON: 1, RegExp: 2, Date: 3, Map: 4, Set: 5, BigInt: 6, URL: 7, Uint8Array: 8, Uint16Array: 9, Uint32Array: 10 };
  dr = Object.freeze(["data-astro-transition-scope", "data-astro-transition-persist"]);
  Ne = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY", _e = Ne.length;
  Dn = Symbol.for("astro.headAndContent");
  Hn = '(()=>{var b=Object.defineProperty;var f=(c,o,i)=>o in c?b(c,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):c[o]=i;var l=(c,o,i)=>(f(c,typeof o!="symbol"?o+"":o,i),i);var p;{let c={0:t=>m(t),1:t=>i(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(i(t)),5:t=>new Set(i(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t)},o=t=>{let[e,r]=t;return e in c?c[e](r):void 0},i=t=>t.map(o),m=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([e,r])=>[e,o(r)]));customElements.get("astro-island")||customElements.define("astro-island",(p=class extends HTMLElement{constructor(){super(...arguments);l(this,"Component");l(this,"hydrator");l(this,"hydrate",async()=>{var d;if(!this.hydrator||!this.isConnected)return;let e=(d=this.parentElement)==null?void 0:d.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let r=this.querySelectorAll("astro-slot"),a={},h=this.querySelectorAll("template[data-astro-template]");for(let n of h){let s=n.closest(this.tagName);s!=null&&s.isSameNode(this)&&(a[n.getAttribute("data-astro-template")||"default"]=n.innerHTML,n.remove())}for(let n of r){let s=n.closest(this.tagName);s!=null&&s.isSameNode(this)&&(a[n.getAttribute("name")||"default"]=n.innerHTML)}let u;try{u=this.hasAttribute("props")?m(JSON.parse(this.getAttribute("props"))):{}}catch(n){let s=this.getAttribute("component-url")||"<unknown>",y=this.getAttribute("component-export");throw y&&(s+=` (export ${y})`),console.error(`[hydrate] Error parsing props for component ${s}`,this.getAttribute("props"),n),n}await this.hydrator(this)(this.Component,u,a,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});l(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),r.disconnect(),this.childrenConnectedCallback()},r=new MutationObserver(()=>{var a;((a=this.lastChild)==null?void 0:a.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});r.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}start(){let e=JSON.parse(this.getAttribute("opts")),r=this.getAttribute("client");if(Astro[r]===void 0){window.addEventListener(`astro:${r}`,()=>this.start(),{once:!0});return}Astro[r](async()=>{let a=this.getAttribute("renderer-url"),[h,{default:u}]=await Promise.all([import(this.getAttribute("component-url")),a?import(a):()=>()=>{}]),d=this.getAttribute("component-export")||"default";if(!d.includes("."))this.Component=h[d];else{this.Component=h;for(let n of d.split("."))this.Component=this.Component[n]}return this.hydrator=u,this.hydrate},e,this)}attributeChangedCallback(){this.hydrate()}},l(p,"observedAttributes",["props"]),p))}})();', Un = "<style>astro-island,astro-slot,astro-static-slot{display:contents}</style>";
  lt = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i, Vn = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i, zn = /^(contenteditable|draggable|spellcheck|value)$/i, Bn = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i, Gn = /* @__PURE__ */ new Set(["set:html", "set:text"]), Jn = (e2) => e2.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (t, r) => /[^\w]|\s/.test(t) ? "" : r === 0 ? t : t.toUpperCase()), F = (e2, t = true) => t ? String(e2).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : e2, Xn = (e2) => e2.toLowerCase() === e2 ? e2 : e2.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`), Dt = (e2) => Object.entries(e2).filter(([t, r]) => typeof r == "string" && r.trim() || typeof r == "number").map(([t, r]) => t[0] !== "-" && t[1] !== "-" ? `${Xn(t)}:${r}` : `${t}:${r}`).join(";");
  Oe = (e2, t, r) => {
    let n = JSON.stringify(e2.props), s = e2.children;
    return t === r.findIndex((a) => JSON.stringify(a.props) === n && a.children == s);
  };
  He = Symbol.for("astro:slot-string"), ie = class extends D {
    instructions;
    [He];
    constructor(t, r) {
      super(t), this.instructions = r, this[He] = true;
    }
  };
  Qn = Symbol.for("astro:fragment"), Ft = Symbol.for("astro:renderer"), oe = new TextEncoder(), Zn = new TextDecoder();
  yr = Symbol.for("astro.componentInstance"), Ue = class {
    [yr] = true;
    result;
    props;
    slotValues;
    factory;
    returnValue;
    constructor(t, r, n, s) {
      this.result = t, this.props = r, this.factory = s, this.slotValues = {};
      for (let a in n) {
        let i = false, o = n[a](t);
        this.slotValues[a] = () => i ? n[a](t) : (i = true, o);
      }
    }
    async init(t) {
      return this.returnValue !== void 0 ? this.returnValue : (this.returnValue = this.factory(t, this.props, this.slotValues), this.returnValue);
    }
    async render(t) {
      this.returnValue === void 0 && await this.init(this.result);
      let r = this.returnValue;
      it(r) && (r = await r), ct(r) ? await r.content.render(t) : await W(t, r);
    }
  };
  wr = Symbol.for("astro.renderTemplateResult"), Fe = class {
    [wr] = true;
    htmlParts;
    expressions;
    error;
    constructor(t, r) {
      this.htmlParts = t, this.error = void 0, this.expressions = r.map((n) => it(n) ? Promise.resolve(n).catch((s) => {
        if (!this.error)
          throw this.error = s, s;
      }) : n);
    }
    async render(t) {
      let r = this.expressions.map((n) => mr((s) => {
        if (n || n === 0)
          return W(s, n);
      }));
      for (let n = 0; n < this.htmlParts.length; n++) {
        let s = this.htmlParts[n], a = r[n];
        t.write(v(s)), a && await a.renderToFinalDestination(t);
      }
    }
  };
  ps = Symbol.for("astro.needsHeadRendering"), Wt = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
  ms = /\<\/?astro-slot\b[^>]*>/g, hs = /\<\/?astro-static-slot\b[^>]*>/g;
  qt = "astro-client-only", N = class {
    constructor(t) {
      this.vnode = t, this.count = 0;
    }
    count;
    increment() {
      this.count++;
    }
    haveNoTried() {
      return this.count === 0;
    }
    isCompleted() {
      return this.count > 2;
    }
    static symbol = Symbol("astro:jsx:skip");
  }, dt = 0;
});
var Er = {};
Q(Er, { D: () => we, a: () => ht, b: () => mt, c: () => X, d: () => be, e: () => ft, f: () => he, i: () => C, j: () => U, n: () => Ns, p: () => J, r: () => ne, s: () => ye, t: () => ge });
function ft(e2) {
  return e2.endsWith("/") ? e2 : e2 + "/";
}
function J(e2) {
  return e2[0] === "/" ? e2 : "/" + e2;
}
function he(e2) {
  return e2.replace(/(?<!:)\/\/+/g, "/");
}
function ne(e2) {
  return e2.endsWith("/") ? e2.slice(0, e2.length - 1) : e2;
}
function Ls(e2) {
  return e2.startsWith("/") ? e2.substring(1) : e2;
}
function ge(e2) {
  return e2.replace(/^\/|\/$/g, "");
}
function Ts(e2) {
  return typeof e2 == "string" || e2 instanceof String;
}
function U(...e2) {
  return e2.filter(Ts).map((t, r) => r === 0 ? ne(t) : r === e2.length - 1 ? Ls(t) : ge(t)).join("/");
}
function X(e2) {
  return /^(http|ftp|https|ws):?\/\//.test(e2) || e2.startsWith("data:");
}
function ye(e2) {
  return e2.replace(/\\/g, "/");
}
function C(e2) {
  return typeof e2 == "object";
}
function mt(e2) {
  return typeof e2 == "string";
}
function Is(e2, t) {
  return ks(e2, t.protocol) && Rr(e2, t.hostname, true) && Ms(e2, t.port) && _s(e2, t.pathname, true);
}
function Ms(e2, t) {
  return !t || t === e2.port;
}
function ks(e2, t) {
  return !t || t === e2.protocol.slice(0, -1);
}
function Rr(e2, t, r) {
  if (t) {
    if (!r || !t.startsWith("*"))
      return t === e2.hostname;
    if (t.startsWith("**.")) {
      let n = t.slice(2);
      return n !== e2.hostname && e2.hostname.endsWith(n);
    } else if (t.startsWith("*.")) {
      let n = t.slice(1);
      return e2.hostname.replace(n, "").split(".").filter(Boolean).length === 1;
    }
  } else
    return true;
  return false;
}
function _s(e2, t, r) {
  if (t) {
    if (!r || !t.endsWith("*"))
      return t === e2.pathname;
    if (t.endsWith("/**")) {
      let n = t.slice(0, -2);
      return n !== e2.pathname && e2.pathname.startsWith(n);
    } else if (t.endsWith("/*")) {
      let n = t.slice(0, -1);
      return e2.pathname.replace(n, "").split("/").filter(Boolean).length === 1;
    }
  } else
    return true;
  return false;
}
function be(e2, { domains: t = [], remotePatterns: r = [] }) {
  if (!X(e2))
    return false;
  let n = new URL(e2);
  return t.some((s) => Rr(n, s)) || r.some((s) => Is(n, s));
}
function ht(e2) {
  return e2 ? "transform" in e2 : false;
}
function jr(e2) {
  let t = e2.width, r = e2.height;
  if (C(e2.src)) {
    let n = e2.src.width / e2.src.height;
    r && !t ? t = Math.round(r * n) : t && !r ? r = Math.round(t / n) : !t && !r && (t = e2.src.width, r = e2.src.height);
  }
  return { targetWidth: t, targetHeight: r };
}
var Ar;
var $r;
var we;
var me;
var Os;
var Cs;
var Ns;
var ve = M(() => {
  "use strict";
  G();
  Ar = ["jpeg", "jpg", "png", "tiff", "webp", "gif", "svg", "avif"], $r = "webp", we = ["src", "width", "height", "format", "quality"];
  me = { propertiesToHash: we, validateOptions(e2) {
    if (!e2.src || typeof e2.src != "string" && typeof e2.src != "object")
      throw new f({ ...q, message: q.message(JSON.stringify(e2.src), typeof e2.src, JSON.stringify(e2, (t, r) => r === void 0 ? null : r)) });
    if (C(e2.src)) {
      if (!Ar.includes(e2.src.format))
        throw new f({ ...Ze, message: Ze.message(e2.src.format, e2.src.src, Ar) });
      if (e2.widths && e2.densities)
        throw new f(Jt);
      if (e2.src.format === "svg" && (e2.format = "svg"), e2.src.format === "svg" && e2.format !== "svg" || e2.src.format !== "svg" && e2.format === "svg")
        throw new f(Gt);
    } else {
      if (e2.src.startsWith("/@fs/") || !X(e2.src) && !e2.src.startsWith("/"))
        throw new f({ ...tt, message: tt.message(e2.src) });
      let t;
      if (!e2.width && !e2.height ? t = "both" : !e2.width && e2.height ? t = "width" : e2.width && !e2.height && (t = "height"), t)
        throw new f({ ...Qe, message: Qe.message(t, e2.src) });
    }
    return e2.format || (e2.format = $r), e2.width && (e2.width = Math.round(e2.width)), e2.height && (e2.height = Math.round(e2.height)), e2;
  }, getHTMLAttributes(e2) {
    let { targetWidth: t, targetHeight: r } = jr(e2), { src: n, width: s, height: a, format: i, quality: o, densities: l, widths: p, formats: c, ...d } = e2;
    return { ...d, width: t, height: r, loading: d.loading ?? "lazy", decoding: d.decoding ?? "async" };
  }, getSrcSet(e2) {
    let t = [], { targetWidth: r } = jr(e2), { widths: n, densities: s } = e2, a = e2.format ?? $r, i = e2.width, o = 1 / 0;
    C(e2.src) && (i = e2.src.width, o = i);
    let { width: l, height: p, ...c } = e2, d = [];
    if (s) {
      let u = s.map((b) => typeof b == "number" ? b : parseFloat(b)), m = u.sort().map((b) => Math.round(r * b));
      d.push(...m.map((b, w) => ({ maxTargetWidth: Math.min(b, o), descriptor: `${u[w]}x` })));
    } else
      n && d.push(...n.map((u) => ({ maxTargetWidth: Math.min(u, o), descriptor: `${u}w` })));
    for (let { maxTargetWidth: u, descriptor: m } of d) {
      let b = { ...c };
      u !== i ? b.width = u : e2.width && e2.height && (b.width = e2.width, b.height = e2.height), t.push({ transform: b, descriptor: m, attributes: { type: `image/${a}` } });
    }
    return t;
  }, getURL(e2, t) {
    let r = new URLSearchParams();
    if (C(e2.src))
      r.append("href", e2.src.src);
    else if (be(e2.src, t))
      r.append("href", e2.src);
    else
      return e2.src;
    return Object.entries({ w: "width", h: "height", q: "quality", f: "format" }).forEach(([a, i]) => {
      e2[i] && r.append(a, e2[i].toString());
    }), `${U("/", "/_image")}?${r}`;
  }, parseURL(e2) {
    let t = e2.searchParams;
    return t.has("href") ? { src: t.get("href"), width: t.has("w") ? parseInt(t.get("w")) : void 0, height: t.has("h") ? parseInt(t.get("h")) : void 0, format: t.get("f"), quality: t.get("q") } : void 0;
  } };
  Os = { propertiesToHash: ["src"], validateOptions: me.validateOptions, getURL: me.getURL, parseURL: me.parseURL, getHTMLAttributes: me.getHTMLAttributes, async transform(e2, t) {
    return { data: e2, format: t.format };
  } }, Cs = Os, Ns = Object.freeze(Object.defineProperty({ __proto__: null, default: Cs }, Symbol.toStringTag, { value: "Module" }));
});
function Js(e2) {
  return e2.render && e2.$$render;
}
function Xs(e2) {
  return e2.astroStaticSlot ? !!e2.hydrate : true;
}
async function Ks(e2, t, r, n) {
  let s = Xs(n) ? "astro-slot" : "astro-static-slot", a = {};
  for (let [o, l] of Object.entries(r))
    a[o] = () => `<${s}${o === "default" ? "" : ` name="${o}"`}>${l}</${s}>`;
  let { html: i } = e2.render(t, { $$slots: a });
  return { html: i };
}
var Ys;
var K;
var Ae = M(() => {
  "use strict";
  Ys = { check: Js, renderToStaticMarkup: Ks, supportsAstroStaticSlot: true }, K = [Object.assign({ name: "@astrojs/svelte", clientEntrypoint: "@astrojs/svelte/client.js", serverEntrypoint: "@astrojs/svelte/server.js" }, { ssr: Ys })];
});
var $e;
var yt = M(() => {
  "use strict";
  $e = void 0;
});
var Or = {};
Q(Or, { GET: () => da });
function Qs(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
function Re() {
  this._types = /* @__PURE__ */ Object.create(null), this._extensions = /* @__PURE__ */ Object.create(null);
  for (let e2 = 0; e2 < arguments.length; e2++)
    this.define(arguments[e2]);
  this.define = this.define.bind(this), this.getType = this.getType.bind(this), this.getExtension = this.getExtension.bind(this);
}
async function _r() {
  if (!globalThis?.astroAsset?.imageService) {
    let { default: e2 } = await Promise.resolve().then(() => (ve(), Er)).then((t) => t.n).catch((t) => {
      let r = new f(Bt);
      throw r.cause = t, r;
    });
    return globalThis.astroAsset || (globalThis.astroAsset = {}), globalThis.astroAsset.imageService = e2, e2;
  }
  return globalThis.astroAsset.imageService;
}
async function sa(e2, t) {
  if (!e2 || typeof e2 != "object")
    throw new f({ ...et, message: et.message(JSON.stringify(e2)) });
  if (typeof e2.src > "u")
    throw new f({ ...q, message: q.message(e2.src, "undefined", JSON.stringify(e2)) });
  let r = await _r(), n = { ...e2, src: typeof e2.src == "object" && "then" in e2.src ? (await e2.src).default ?? await e2.src : e2.src }, s = C(n.src) ? n.src.clone ?? n.src : n.src;
  n.src = s;
  let a = r.validateOptions ? await r.validateOptions(n, t) : n, i = r.getSrcSet ? await r.getSrcSet(a, t) : [], o = await r.getURL(a, t), l = await Promise.all(i.map(async (p) => ({ transform: p.transform, url: await r.getURL(p.transform, t), descriptor: p.descriptor, attributes: p.attributes })));
  if (ht(r) && globalThis.astroAsset.addStaticImage && !(mt(a.src) && o === a.src)) {
    let p = r.propertiesToHash ?? we;
    o = globalThis.astroAsset.addStaticImage(a, p), l = i.map((c) => ({ transform: c.transform, url: globalThis.astroAsset.addStaticImage(c.transform, p), descriptor: c.descriptor, attributes: c.attributes }));
  }
  return { rawOptions: n, options: a, src: o, srcSet: { values: l, attribute: l.map((p) => `${p.url} ${p.descriptor}`).join(", ") }, attributes: r.getHTMLAttributes !== void 0 ? await r.getHTMLAttributes(a, t) : {} };
}
async function ua(e2) {
  try {
    let t = await fetch(e2);
    return t.ok ? await t.arrayBuffer() : void 0;
  } catch {
    return;
  }
}
var Zs;
var ea;
var ta;
var ra;
var na;
var aa;
var ia;
var oa;
var ca;
var la;
var pa;
var je;
var wt;
var da;
var Cr = M(() => {
  "use strict";
  ve();
  G();
  Re.prototype.define = function(e2, t) {
    for (let r in e2) {
      let n = e2[r].map(function(s) {
        return s.toLowerCase();
      });
      r = r.toLowerCase();
      for (let s = 0; s < n.length; s++) {
        let a = n[s];
        if (a[0] !== "*") {
          if (!t && a in this._types)
            throw new Error('Attempt to change mapping for "' + a + '" extension from "' + this._types[a] + '" to "' + r + '". Pass `force=true` to allow this, otherwise remove "' + a + '" from the list of extensions for "' + r + '".');
          this._types[a] = r;
        }
      }
      if (t || !this._extensions[r]) {
        let s = n[0];
        this._extensions[r] = s[0] !== "*" ? s : s.substr(1);
      }
    }
  };
  Re.prototype.getType = function(e2) {
    e2 = String(e2);
    let t = e2.replace(/^.*[/\\]/, "").toLowerCase(), r = t.replace(/^.*\./, "").toLowerCase(), n = t.length < e2.length;
    return (r.length < t.length - 1 || !n) && this._types[r] || null;
  };
  Re.prototype.getExtension = function(e2) {
    return e2 = /^\s*([^;\s]*)/.test(e2) && RegExp.$1, e2 && this._extensions[e2.toLowerCase()] || null;
  };
  Zs = Re, ea = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["es", "ecma"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/express": ["exp"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/trig": ["trig"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/step+xml": ["stpx"], "model/step+zip": ["stpz"], "model/step-xml+zip": ["stpxz"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] }, ta = Zs, ra = new ta(ea), na = Qs(ra);
  aa = (e2) => {
    let t = e2.length, r = 0, n = 0, s = 8997, a = 0, i = 33826, o = 0, l = 40164, p = 0, c = 52210;
    for (; r < t; )
      s ^= e2.charCodeAt(r++), n = s * 435, a = i * 435, o = l * 435, p = c * 435, o += s << 8, p += i << 8, a += n >>> 16, s = n & 65535, o += a >>> 16, i = a & 65535, c = p + (o >>> 16) & 65535, l = o & 65535;
    return (c & 15) * 281474976710656 + l * 4294967296 + i * 65536 + (s ^ c >> 4);
  }, ia = (e2, t = false) => (t ? 'W/"' : '"') + aa(e2).toString(36) + e2.length.toString(36) + '"', oa = z(), ca = V(async (e2, t, r) => {
    let n = e2.createAstro(oa, t, r);
    n.self = ca;
    let s = n.props;
    if (s.alt === void 0 || s.alt === null)
      throw new f(Ye);
    typeof s.width == "string" && (s.width = parseInt(s.width)), typeof s.height == "string" && (s.height = parseInt(s.height));
    let a = await wt(s), i = {};
    return a.srcSet.values.length > 0 && (i.srcset = a.srcSet.attribute), L`${B()}<img${P(a.src, "src")}${O(i)}${O(a.attributes)}>`;
  }, "D:/Projects/bookinists/node_modules/.pnpm/astro@4.0.7_typescript@5.3.3/node_modules/astro/components/Image.astro", void 0), la = z(), pa = V(async (e2, t, r) => {
    let n = e2.createAstro(la, t, r);
    n.self = pa;
    let s = ["webp"], a = "png", i = ["gif", "svg", "jpg", "jpeg"], { formats: o = s, pictureAttributes: l = {}, fallbackFormat: p, ...c } = n.props;
    if (c.alt === void 0 || c.alt === null)
      throw new f(Ye);
    let d = await Promise.all(o.map(async (g) => await wt({ ...c, format: g, widths: c.widths, densities: c.densities }))), u = p ?? a;
    !p && C(c.src) && i.includes(c.src.format) && (u = c.src.format);
    let m = await wt({ ...c, format: u, widths: c.widths, densities: c.densities }), b = {}, w = {};
    return c.sizes && (w.sizes = c.sizes), m.srcSet.values.length > 0 && (b.srcset = m.srcSet.attribute), L`${B()}<picture${O(l)}> ${Object.entries(d).map(([g, S]) => {
      let y = c.densities || !c.densities && !c.widths ? `${S.src}${S.srcSet.values.length > 0 ? ", " + S.srcSet.attribute : ""}` : S.srcSet.attribute;
      return L`<source${P(y, "srcset")}${P("image/" + S.options.format, "type")}${O(w)}>`;
    })} <img${P(m.src, "src")}${O(b)}${O(m.attributes)}> </picture>`;
  }, "D:/Projects/bookinists/node_modules/.pnpm/astro@4.0.7_typescript@5.3.3/node_modules/astro/components/Picture.astro", void 0), je = { service: { entrypoint: "astro/assets/services/noop", config: {} }, domains: [], remotePatterns: [] };
  new URL("file:///D:/Projects/bookinists/dist/");
  wt = async (e2) => await sa(e2, je);
  da = async ({ request: e2 }) => {
    try {
      let t = await _r();
      if (!("transform" in t))
        throw new Error("Configured image service is not a local service");
      let r = new URL(e2.url), n = await t.parseURL(r, je);
      if (!n?.src)
        throw new Error("Incorrect transform returned by `parseURL`");
      let s, a = X(n.src) ? new URL(n.src) : new URL(n.src, r.origin);
      if (X(n.src) && be(n.src, je) === false)
        return new Response("Forbidden", { status: 403 });
      if (s = await ua(a), !s)
        return new Response("Not Found", { status: 404 });
      let { data: i, format: o } = await t.transform(new Uint8Array(s), n, je);
      return new Response(i, { status: 200, headers: { "Content-Type": na.getType(o) ?? `image/${o}`, "Cache-Control": "public, max-age=31536000", ETag: ia(i.toString()), Date: (/* @__PURE__ */ new Date()).toUTCString() } });
    } catch (t) {
      return console.error("Could not process image request:", t), new Response(`Server Error: ${t}`, { status: 500 });
    }
  };
});
var Nr = {};
Q(Nr, { onRequest: () => $e, page: () => fa, renderers: () => K });
var fa;
var Dr = M(() => {
  "use strict";
  Ae();
  yt();
  fa = () => Promise.resolve().then(() => (Cr(), Or));
});
var Fr = {};
Q(Fr, { default: () => Ur, file: () => ga, url: () => ya });
var ma;
var Hr;
var ha;
var Ur;
var ga;
var ya;
var Wr = M(() => {
  "use strict";
  G();
  ma = z(), Hr = V(async (e2, t, r) => {
    let n = e2.createAstro(ma, t, r);
    n.self = Hr;
    let { title: s } = n.props;
    return L`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${P(n.generator, "content")}><title>${s}</title>${hr()}</head> <body> ${fe(e2, r.default)} </body></html>`;
  }, "D:/Projects/bookinists/src/layouts/Layout.astro", void 0), ha = z(), Ur = V(async (e2, t, r) => {
    let n = e2.createAstro(ha, t, r);
    n.self = Ur;
    let s = n.locals.runtime.env;
    return L`${ut(e2, "Layout", Hr, { title: "Welcome to Astro." }, { default: (a) => L` ${B()}<main> ${JSON.stringify(s, null, 2)} <!-- {JSON.stringify(result, null, 2)} --> </main> ` })}`;
  }, "D:/Projects/bookinists/src/pages/index.astro", void 0), ga = "D:/Projects/bookinists/src/pages/index.astro", ya = "";
});
var qr = {};
Q(qr, { onRequest: () => $e, page: () => wa, renderers: () => K });
var wa;
var Vr = M(() => {
  "use strict";
  Ae();
  yt();
  wa = () => Promise.resolve().then(() => (Wr(), Fr));
});
ve();
G();
var Ds = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
var se = { debug: 20, info: 30, warn: 40, error: 50, silent: 90 };
function gt(e2, t, r, n, s = true) {
  let a = e2.level, i = e2.dest, o = { label: r, level: t, message: n, newLine: s };
  Hs(a, t) && i.write(o);
}
function Hs(e2, t) {
  return se[e2] <= se[t];
}
function Pr(e2, t, r, n = true) {
  return gt(e2, "info", t, r, n);
}
function Lr(e2, t, r, n = true) {
  return gt(e2, "warn", t, r, n);
}
function Tr(e2, t, r, n = true) {
  return gt(e2, "error", t, r, n);
}
function Ir(...e2) {
  "_astroGlobalDebug" in globalThis && globalThis._astroGlobalDebug(...e2);
}
function Mr({ level: e2, label: t }) {
  let r = `${Ds.format(/* @__PURE__ */ new Date())}`, n = [];
  return e2 === "error" || e2 === "warn" ? (n.push(rt(r)), n.push(`[${e2.toUpperCase()}]`)) : n.push(r), t && n.push(`[${t}]`), e2 === "error" ? tr(n.join(" ")) : e2 === "warn" ? rr(n.join(" ")) : n.length === 1 ? nt(n[0]) : nt(n[0]) + " " + nr(n.splice(1).join(" "));
}
if (typeof process < "u") {
  let e2 = process;
  "argv" in e2 && Array.isArray(e2.argv) && (e2.argv.includes("--verbose") || e2.argv.includes("--silent"));
}
var xe = class {
  options;
  constructor(t) {
    this.options = t;
  }
  info(t, r, n = true) {
    Pr(this.options, t, r, n);
  }
  warn(t, r, n = true) {
    Lr(this.options, t, r, n);
  }
  error(t, r, n = true) {
    Tr(this.options, t, r, n);
  }
  debug(t, ...r) {
    Ir(t, ...r);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(t) {
    return new ae(this.options, t);
  }
};
var ae = class e {
  options;
  label;
  constructor(t, r) {
    this.options = t, this.label = r;
  }
  fork(t) {
    return new e(this.options, t);
  }
  info(t) {
    Pr(this.options, this.label, t);
  }
  warn(t) {
    Lr(this.options, this.label, t);
  }
  error(t) {
    Tr(this.options, this.label, t);
  }
  debug(t) {
    Ir(this.label, t);
  }
};
function Us(e2) {
  for (var t = [], r = 0; r < e2.length; ) {
    var n = e2[r];
    if (n === "*" || n === "+" || n === "?") {
      t.push({ type: "MODIFIER", index: r, value: e2[r++] });
      continue;
    }
    if (n === "\\") {
      t.push({ type: "ESCAPED_CHAR", index: r++, value: e2[r++] });
      continue;
    }
    if (n === "{") {
      t.push({ type: "OPEN", index: r, value: e2[r++] });
      continue;
    }
    if (n === "}") {
      t.push({ type: "CLOSE", index: r, value: e2[r++] });
      continue;
    }
    if (n === ":") {
      for (var s = "", a = r + 1; a < e2.length; ) {
        var i = e2.charCodeAt(a);
        if (i >= 48 && i <= 57 || i >= 65 && i <= 90 || i >= 97 && i <= 122 || i === 95) {
          s += e2[a++];
          continue;
        }
        break;
      }
      if (!s)
        throw new TypeError("Missing parameter name at ".concat(r));
      t.push({ type: "NAME", index: r, value: s }), r = a;
      continue;
    }
    if (n === "(") {
      var o = 1, l = "", a = r + 1;
      if (e2[a] === "?")
        throw new TypeError('Pattern cannot start with "?" at '.concat(a));
      for (; a < e2.length; ) {
        if (e2[a] === "\\") {
          l += e2[a++] + e2[a++];
          continue;
        }
        if (e2[a] === ")") {
          if (o--, o === 0) {
            a++;
            break;
          }
        } else if (e2[a] === "(" && (o++, e2[a + 1] !== "?"))
          throw new TypeError("Capturing groups are not allowed at ".concat(a));
        l += e2[a++];
      }
      if (o)
        throw new TypeError("Unbalanced pattern at ".concat(r));
      if (!l)
        throw new TypeError("Missing pattern at ".concat(r));
      t.push({ type: "PATTERN", index: r, value: l }), r = a;
      continue;
    }
    t.push({ type: "CHAR", index: r, value: e2[r++] });
  }
  return t.push({ type: "END", index: r, value: "" }), t;
}
function Fs(e2, t) {
  t === void 0 && (t = {});
  for (var r = Us(e2), n = t.prefixes, s = n === void 0 ? "./" : n, a = "[^".concat(Vs(t.delimiter || "/#?"), "]+?"), i = [], o = 0, l = 0, p = "", c = function(E) {
    if (l < r.length && r[l].type === E)
      return r[l++].value;
  }, d = function(E) {
    var h = c(E);
    if (h !== void 0)
      return h;
    var x = r[l], A = x.type, Y = x.index;
    throw new TypeError("Unexpected ".concat(A, " at ").concat(Y, ", expected ").concat(E));
  }, u = function() {
    for (var E = "", h; h = c("CHAR") || c("ESCAPED_CHAR"); )
      E += h;
    return E;
  }; l < r.length; ) {
    var m = c("CHAR"), b = c("NAME"), w = c("PATTERN");
    if (b || w) {
      var g = m || "";
      s.indexOf(g) === -1 && (p += g, g = ""), p && (i.push(p), p = ""), i.push({ name: b || o++, prefix: g, suffix: "", pattern: w || a, modifier: c("MODIFIER") || "" });
      continue;
    }
    var S = m || c("ESCAPED_CHAR");
    if (S) {
      p += S;
      continue;
    }
    p && (i.push(p), p = "");
    var y = c("OPEN");
    if (y) {
      var g = u(), T = c("NAME") || "", R = c("PATTERN") || "", I = u();
      d("CLOSE"), i.push({ name: T || (R ? o++ : ""), pattern: T && !R ? a : R, prefix: g, suffix: I, modifier: c("MODIFIER") || "" });
      continue;
    }
    d("END");
  }
  return i;
}
function Ws(e2, t) {
  return qs(Fs(e2, t), t);
}
function qs(e2, t) {
  t === void 0 && (t = {});
  var r = zs(t), n = t.encode, s = n === void 0 ? function(l) {
    return l;
  } : n, a = t.validate, i = a === void 0 ? true : a, o = e2.map(function(l) {
    if (typeof l == "object")
      return new RegExp("^(?:".concat(l.pattern, ")$"), r);
  });
  return function(l) {
    for (var p = "", c = 0; c < e2.length; c++) {
      var d = e2[c];
      if (typeof d == "string") {
        p += d;
        continue;
      }
      var u = l ? l[d.name] : void 0, m = d.modifier === "?" || d.modifier === "*", b = d.modifier === "*" || d.modifier === "+";
      if (Array.isArray(u)) {
        if (!b)
          throw new TypeError('Expected "'.concat(d.name, '" to not repeat, but got an array'));
        if (u.length === 0) {
          if (m)
            continue;
          throw new TypeError('Expected "'.concat(d.name, '" to not be empty'));
        }
        for (var w = 0; w < u.length; w++) {
          var g = s(u[w], d);
          if (i && !o[c].test(g))
            throw new TypeError('Expected all "'.concat(d.name, '" to match "').concat(d.pattern, '", but got "').concat(g, '"'));
          p += d.prefix + g + d.suffix;
        }
        continue;
      }
      if (typeof u == "string" || typeof u == "number") {
        var g = s(String(u), d);
        if (i && !o[c].test(g))
          throw new TypeError('Expected "'.concat(d.name, '" to match "').concat(d.pattern, '", but got "').concat(g, '"'));
        p += d.prefix + g + d.suffix;
        continue;
      }
      if (!m) {
        var S = b ? "an array" : "a string";
        throw new TypeError('Expected "'.concat(d.name, '" to be ').concat(S));
      }
    }
    return p;
  };
}
function Vs(e2) {
  return e2.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function zs(e2) {
  return e2 && e2.sensitive ? "" : "i";
}
function Bs(e2, t) {
  let r = e2.map((a) => "/" + a.map((i) => i.spread ? `:${i.content.slice(3)}(.*)?` : i.dynamic ? `:${i.content}` : i.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("")).join(""), n = "";
  return t === "always" && e2.length && (n = "/"), Ws(r + n);
}
function Se(e2) {
  return { route: e2.route, type: e2.type, pattern: new RegExp(e2.pattern), params: e2.params, component: e2.component, generate: Bs(e2.segments, e2._meta.trailingSlash), pathname: e2.pathname || void 0, segments: e2.segments, prerender: e2.prerender, redirect: e2.redirect, redirectRoute: e2.redirectRoute ? Se(e2.redirectRoute) : void 0, fallbackRoutes: e2.fallbackRoutes.map((t) => Se(t)) };
}
function Gs(e2) {
  let t = [];
  for (let a of e2.routes) {
    t.push({ ...a, routeData: Se(a.routeData) });
    let i = a;
    i.routeData = Se(a.routeData);
  }
  let r = new Set(e2.assets), n = new Map(e2.componentMetadata), s = new Map(e2.clientDirectives);
  return { ...e2, assets: r, componentMetadata: n, clientDirectives: s, routes: t };
}
var kr = Gs({ adapterName: "@astrojs/cloudflare", routes: [{ file: "", links: [], scripts: [], styles: [], routeData: { type: "endpoint", route: "/_image", pattern: "^\\/_image$", segments: [[{ content: "_image", dynamic: false, spread: false }]], params: [], component: "node_modules/.pnpm/astro@4.0.7_typescript@5.3.3/node_modules/astro/dist/assets/endpoint/generic.js", pathname: "/_image", prerender: false, fallbackRoutes: [], _meta: { trailingSlash: "ignore" } } }, { file: "", links: [], scripts: [], styles: [{ type: "external", src: "/_astro/index.vHHw50Ki.css" }], routeData: { route: "/", type: "page", pattern: "^\\/$", segments: [], params: [], component: "src/pages/index.astro", pathname: "/", prerender: false, fallbackRoutes: [], _meta: { trailingSlash: "ignore" } } }], base: "/", trailingSlash: "ignore", compressHTML: true, componentMetadata: [["D:/Projects/bookinists/src/pages/index.astro", { propagation: "none", containsHead: true }]], renderers: [], clientDirectives: [["idle", '(()=>{var i=t=>{let e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event("astro:idle"));})();'], ["load", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event("astro:load"));})();'], ["media", '(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener("change",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event("astro:media"));})();'], ["only", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();'], ["visible", '(()=>{var r=(i,c,s)=>{let n=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),n();break}});for(let e of s.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event("astro:visible"));})();']], entryModules: { "\0@astrojs-ssr-virtual-entry": "_worker.mjs", "\0@astro-renderers": "renderers.mjs", "\0empty-middleware": "_empty-middleware.mjs", "/node_modules/.pnpm/astro@4.0.7_typescript@5.3.3/node_modules/astro/dist/assets/endpoint/generic.js": "chunks/pages/generic_FlOO--RI.mjs", "/src/pages/index.astro": "chunks/pages/index_wntRPDLv.mjs", "\0@astrojs-manifest": "manifest_4WRVufqT.mjs", "\0@astro-page:node_modules/.pnpm/astro@4.0.7_typescript@5.3.3/node_modules/astro/dist/assets/endpoint/generic@_@js": "chunks/generic_iisX6Rt9.mjs", "\0@astro-page:src/pages/index@_@astro": "chunks/index_lrXSfDnl.mjs", "@astrojs/svelte/client.js": "_astro/client.Ddma2X8C.js", "astro:scripts/before-hydration.js": "" }, assets: ["/_astro/index.vHHw50Ki.css", "/favicon.svg", "/$server_build/renderers.mjs", "/$server_build/_empty-middleware.mjs", "/$server_build/_worker.mjs", "/_astro/client.Ddma2X8C.js", "/$server_build/chunks/astro_8Q_z5TWf.mjs", "/$server_build/chunks/generic_iisX6Rt9.mjs", "/$server_build/chunks/index_lrXSfDnl.mjs", "/$server_build/_astro/index.vHHw50Ki.css", "/$server_build/chunks/astro/assets-service_SA4WZhZB.mjs", "/$server_build/chunks/pages/generic_FlOO--RI.mjs", "/$server_build/chunks/pages/index_wntRPDLv.mjs"] });
G();
Ae();
function ba(e2, t) {
  for (let r of t)
    if (typeof r == "string") {
      if (r === e2)
        return r;
    } else
      for (let n of r.codes)
        if (n === e2)
          return r.path;
}
function j(e2) {
  return e2.replaceAll("_", "-").toLowerCase();
}
function va(e2) {
  let t = [];
  for (let r of e2)
    if (typeof r == "string")
      t.push(r);
    else
      for (let n of r.codes)
        t.push(n);
  return t;
}
var nn = Symbol.for("astro.routeData");
function xa(e2, t) {
  let r = e2.split("/");
  for (let n of r)
    for (let s of t)
      if (typeof s == "string") {
        if (j(n) === j(s))
          return true;
      } else if (n === s.path)
        return true;
  return false;
}
function Sa(e2, t, r) {
  if (e2)
    return async (n, s) => {
      if (!e2)
        return await s();
      let a = Reflect.get(n.request, nn);
      if (a && a.type !== "page" && a.type !== "fallback")
        return await s();
      let i = n.url, { locales: o, defaultLocale: l, fallback: p, routing: c } = e2, d = await s();
      if (d instanceof Response) {
        let u = i.pathname.includes(`/${l}`);
        if (e2.routing === "prefix-other-locales" && u) {
          let m = i.pathname.replace(`/${l}`, "");
          return d.headers.set("Location", m), new Response(null, { status: 404, headers: d.headers });
        } else if (e2.routing === "prefix-always") {
          if (i.pathname === t + "/" || i.pathname === t)
            return r === "always" ? n.redirect(`${ft(U(t, e2.defaultLocale))}`) : n.redirect(`${U(t, e2.defaultLocale)}`);
          if (!xa(i.pathname, e2.locales))
            return new Response(null, { status: 404, headers: d.headers });
        }
        if (d.status >= 300 && p) {
          let m = e2.fallback ? Object.keys(e2.fallback) : [], w = i.pathname.split("/").find((g) => {
            for (let S of o)
              if (typeof S == "string") {
                if (S === g)
                  return true;
              } else if (S.path === g)
                return true;
            return false;
          });
          if (w && m.includes(w)) {
            let g = p[w], S = ba(g, o), y;
            return S === l && c === "prefix-other-locales" ? y = i.pathname.replace(`/${w}`, "") : y = i.pathname.replace(`/${w}`, `/${S}`), n.redirect(y);
          }
        }
      }
      return d;
    };
}
var Aa = (e2) => {
  Reflect.set(e2.request, nn, e2.route);
};
var $a = Ra;
var zr = Ea;
var ja = Object.prototype.toString;
var Ee = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function Ra(e2, t) {
  if (typeof e2 != "string")
    throw new TypeError("argument str must be a string");
  for (var r = {}, n = t || {}, s = n.decode || Pa, a = 0; a < e2.length; ) {
    var i = e2.indexOf("=", a);
    if (i === -1)
      break;
    var o = e2.indexOf(";", a);
    if (o === -1)
      o = e2.length;
    else if (o < i) {
      a = e2.lastIndexOf(";", i - 1) + 1;
      continue;
    }
    var l = e2.slice(a, i).trim();
    if (r[l] === void 0) {
      var p = e2.slice(i + 1, o).trim();
      p.charCodeAt(0) === 34 && (p = p.slice(1, -1)), r[l] = Ia(p, s);
    }
    a = o + 1;
  }
  return r;
}
function Ea(e2, t, r) {
  var n = r || {}, s = n.encode || La;
  if (typeof s != "function")
    throw new TypeError("option encode is invalid");
  if (!Ee.test(e2))
    throw new TypeError("argument name is invalid");
  var a = s(t);
  if (a && !Ee.test(a))
    throw new TypeError("argument val is invalid");
  var i = e2 + "=" + a;
  if (n.maxAge != null) {
    var o = n.maxAge - 0;
    if (isNaN(o) || !isFinite(o))
      throw new TypeError("option maxAge is invalid");
    i += "; Max-Age=" + Math.floor(o);
  }
  if (n.domain) {
    if (!Ee.test(n.domain))
      throw new TypeError("option domain is invalid");
    i += "; Domain=" + n.domain;
  }
  if (n.path) {
    if (!Ee.test(n.path))
      throw new TypeError("option path is invalid");
    i += "; Path=" + n.path;
  }
  if (n.expires) {
    var l = n.expires;
    if (!Ta(l) || isNaN(l.valueOf()))
      throw new TypeError("option expires is invalid");
    i += "; Expires=" + l.toUTCString();
  }
  if (n.httpOnly && (i += "; HttpOnly"), n.secure && (i += "; Secure"), n.partitioned && (i += "; Partitioned"), n.priority) {
    var p = typeof n.priority == "string" ? n.priority.toLowerCase() : n.priority;
    switch (p) {
      case "low":
        i += "; Priority=Low";
        break;
      case "medium":
        i += "; Priority=Medium";
        break;
      case "high":
        i += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (n.sameSite) {
    var c = typeof n.sameSite == "string" ? n.sameSite.toLowerCase() : n.sameSite;
    switch (c) {
      case true:
        i += "; SameSite=Strict";
        break;
      case "lax":
        i += "; SameSite=Lax";
        break;
      case "strict":
        i += "; SameSite=Strict";
        break;
      case "none":
        i += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return i;
}
function Pa(e2) {
  return e2.indexOf("%") !== -1 ? decodeURIComponent(e2) : e2;
}
function La(e2) {
  return encodeURIComponent(e2);
}
function Ta(e2) {
  return ja.call(e2) === "[object Date]" || e2 instanceof Date;
}
function Ia(e2, t) {
  try {
    return t(e2);
  } catch {
    return e2;
  }
}
var Ma = /* @__PURE__ */ new Date(0);
var Br = "deleted";
var ka = Symbol.for("astro.responseSent");
var Pe = class {
  constructor(t) {
    this.value = t;
  }
  json() {
    if (this.value === void 0)
      throw new Error("Cannot convert undefined to an object.");
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    return this.value === "false" || this.value === "0" ? false : !!this.value;
  }
};
var Le = class {
  #e;
  #t;
  #r;
  constructor(t) {
    this.#e = t, this.#t = null, this.#r = null;
  }
  delete(t, r) {
    let n = { expires: Ma };
    r?.domain && (n.domain = r.domain), r?.path && (n.path = r.path), this.#a().set(t, [Br, zr(t, Br, n), false]);
  }
  get(t) {
    if (this.#r?.has(t)) {
      let [n, , s] = this.#r.get(t);
      return s ? new Pe(n) : void 0;
    }
    let r = this.#s();
    if (t in r) {
      let n = r[t];
      return new Pe(n);
    }
  }
  has(t) {
    if (this.#r?.has(t)) {
      let [, , n] = this.#r.get(t);
      return n;
    }
    return !!this.#s()[t];
  }
  set(t, r, n) {
    let s;
    if (typeof r == "string")
      s = r;
    else {
      let i = r.toString();
      i === Object.prototype.toString.call(r) ? s = JSON.stringify(r) : s = i;
    }
    let a = {};
    if (n && Object.assign(a, n), this.#a().set(t, [s, zr(t, s, a), true]), this.#e[ka])
      throw new f({ ...pe });
  }
  *headers() {
    if (this.#r != null)
      for (let [, t] of this.#r)
        yield t[1];
  }
  #s() {
    return this.#t || this.#n(), this.#t || (this.#t = {}), this.#t;
  }
  #a() {
    return this.#r || (this.#r = /* @__PURE__ */ new Map()), this.#r;
  }
  #n() {
    let t = this.#e.headers.get("cookie");
    t && (this.#t = $a(t));
  }
};
var Rt = Symbol.for("astro.cookies");
function Et(e2, t) {
  Reflect.set(e2, Rt, t);
}
function _a(e2) {
  return Reflect.has(e2, Rt);
}
function Oa(e2) {
  let t = Reflect.get(e2, Rt);
  if (t != null)
    return t;
}
function* Ca(e2) {
  let t = Oa(e2);
  if (!t)
    return [];
  for (let r of t.headers())
    yield r;
  return [];
}
var Na = { write(e2) {
  let t = console.error;
  return se[e2.level] < se.error && (t = console.log), e2.label === "SKIP_FORMAT" ? t(e2.message) : t(Mr(e2) + " " + e2.message), true;
} };
async function sn(e2, t, r) {
  let n = false, s, i = e2(t, async () => (n = true, s = r(), s));
  return await Promise.resolve(i).then(async (o) => {
    if (n)
      if (typeof o < "u") {
        if (!(o instanceof Response))
          throw new f(ue);
        return Gr(t, o);
      } else {
        if (s)
          return s;
        throw new f(ue);
      }
    else {
      if (typeof o > "u")
        throw new f(Xt);
      if (o instanceof Response)
        return Gr(t, o);
      throw new f(ue);
    }
  });
}
function Gr(e2, t) {
  return e2.cookies !== void 0 && !_a(t) && Et(t, e2.cookies), t;
}
function an(e2) {
  return e2?.type === "redirect";
}
function on(e2) {
  return e2?.type === "fallback";
}
function Da(e2, t) {
  let r = e2.redirectRoute, n = e2.redirect;
  if (typeof r < "u")
    return r?.generate(t) || r?.pathname || "/";
  if (typeof n == "string") {
    let s = n;
    for (let a of Object.keys(t)) {
      let i = t[a];
      s = s.replace(`[${a}]`, i), s = s.replace(`[...${a}]`, i);
    }
    return s;
  } else if (typeof n > "u")
    return "/";
  return n.destination;
}
function Ha(e2, t = "GET") {
  let r = e2.redirectRoute;
  return typeof r?.redirect == "object" ? r.redirect.status : t !== "GET" ? 308 : 301;
}
var Ua = { default() {
  return new Response(null, { status: 301 });
} };
var Fa = { page: () => Promise.resolve(Ua), onRequest: (e2, t) => t(), renderers: [] };
var Wa = ["string", "number", "undefined"];
function qa([e2, t], r) {
  if (!Wa.includes(typeof t))
    throw new f({ ...Je, message: Je.message(e2, t, typeof t), location: { file: r } });
}
function Va(e2, { ssr: t, route: r }) {
  if ((!t || r.prerender) && !e2.getStaticPaths)
    throw new f({ ...zt, location: { file: r.component } });
}
function za(e2, t, r) {
  if (!Array.isArray(e2))
    throw new f({ ...Ge, message: Ge.message(typeof e2), location: { file: r.component } });
  e2.forEach((n) => {
    if (typeof n == "object" && Array.isArray(n) || n === null)
      throw new f({ ...Be, message: Be.message(Array.isArray(n) ? "array" : typeof n) });
    if (n.params === void 0 || n.params === null || n.params && Object.keys(n.params).length === 0)
      throw new f({ ...Vt, location: { file: r.component } });
    for (let [s, a] of Object.entries(n.params))
      typeof a > "u" || typeof a == "string" || typeof a == "number" || t.warn("router", `getStaticPaths() returned an invalid path param: "${s}". A string, number or undefined value was expected, but got \`${JSON.stringify(a)}\`.`), typeof a == "string" && a === "" && t.warn("router", `getStaticPaths() returned an invalid path param: "${s}". \`undefined\` expected for an optional param, but got empty string.`);
  });
}
function Ba(e2) {
  return (r) => {
    let n = {};
    return e2.forEach((s, a) => {
      s.startsWith("...") ? n[s.slice(3)] = r[a + 1] ? decodeURIComponent(r[a + 1]) : void 0 : n[s] = decodeURIComponent(r[a + 1]);
    }), n;
  };
}
function cn(e2, t) {
  let r = Object.entries(e2).reduce((n, s) => {
    qa(s, t.component);
    let [a, i] = s;
    return i !== void 0 && (n[a] = typeof i == "string" ? ge(i) : i.toString()), n;
  }, {});
  return JSON.stringify(t.generate(r));
}
function Ga(e2) {
  return function(r, n = {}) {
    let { pageSize: s, params: a, props: i } = n, o = s || 10, l = "page", p = a || {}, c = i || {}, d;
    if (e2.params.includes(`...${l}`))
      d = false;
    else if (e2.params.includes(`${l}`))
      d = true;
    else
      throw new f({ ...Ke, message: Ke.message(l) });
    let u = Math.max(1, Math.ceil(r.length / o));
    return [...Array(u).keys()].map((b) => {
      let w = b + 1, g = o === 1 / 0 ? 0 : (w - 1) * o, S = Math.min(g + o, r.length), y = { ...p, [l]: d || w > 1 ? String(w) : void 0 }, T = bt(e2.generate({ ...y })), R = w === u ? void 0 : bt(e2.generate({ ...y, page: String(w + 1) })), I = w === 1 ? void 0 : bt(e2.generate({ ...y, page: !d && w - 1 === 1 ? void 0 : String(w - 1) }));
      return { params: y, props: { ...c, page: { data: r.slice(g, S), start: g, end: S - 1, size: o, total: r.length, currentPage: w, lastPage: u, url: { current: T, next: R, prev: I } } } };
    });
  };
}
function bt(e2) {
  return e2 === "" ? "/" : e2;
}
async function Ja({ mod: e2, route: t, routeCache: r, logger: n, ssr: s }) {
  let a = r.get(t);
  if (!e2)
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  if (a?.staticPaths)
    return a.staticPaths;
  if (Va(e2, { ssr: s, route: t }), s && !t.prerender) {
    let l = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    return r.set(t, { ...a, staticPaths: l }), l;
  }
  let i = [];
  if (!e2.getStaticPaths)
    throw new Error("Unexpected Error.");
  i = await e2.getStaticPaths({ paginate: Ga(t) }), za(i, n, t);
  let o = i;
  o.keyed = /* @__PURE__ */ new Map();
  for (let l of o) {
    let p = cn(l.params, t);
    o.keyed.set(p, l);
  }
  return r.set(t, { ...a, staticPaths: o }), o;
}
var xt = class {
  logger;
  cache = {};
  mode;
  constructor(t, r = "production") {
    this.logger = t, this.mode = r;
  }
  clearAll() {
    this.cache = {};
  }
  set(t, r) {
    this.mode === "production" && this.cache[t.component]?.staticPaths && this.logger.warn(null, `Internal Warning: route cache overwritten. (${t.component})`), this.cache[t.component] = r;
  }
  get(t) {
    return this.cache[t.component];
  }
};
function Xa(e2, t, r, n) {
  let s = cn(t, r), a = e2.keyed.get(s);
  if (a)
    return a;
  n.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${s}`);
}
async function Ka(e2) {
  let { logger: t, mod: r, route: n, routeCache: s, pathname: a, ssr: i } = e2;
  if (!n || n.pathname)
    return [{}, {}];
  let o = Ya(n, a) ?? {};
  if (an(n) || on(n))
    return [o, {}];
  r && Qa(n, r, o);
  let l = await Ja({ mod: r, route: n, routeCache: s, logger: t, ssr: i }), p = Xa(l, o, n, t);
  if (!p && (!i || n.prerender))
    throw new f({ ...ce, message: ce.message(a), hint: ce.hint([n.component]) });
  let c = p?.props ? { ...p.props } : {};
  return [o, c];
}
function Ya(e2, t) {
  if (e2.params.length) {
    let r = e2.pattern.exec(decodeURIComponent(t));
    if (r)
      return Ba(e2.params)(r);
  }
}
function Qa(e2, t, r) {
  if (e2.type === "endpoint" && t.getStaticPaths) {
    let n = e2.segments[e2.segments.length - 1], s = Object.values(r), a = s[s.length - 1];
    if (n.length === 1 && n[0].dynamic && a === void 0)
      throw new f({ ...le, message: le.message(e2.route), hint: le.hint(e2.component), location: { file: e2.component } });
  }
}
var Jr = Symbol.for("astro.locals");
async function Xr(e2) {
  let t = e2.request, r = e2.pathname ?? new URL(t.url).pathname, [n, s] = await Ka({ mod: e2.mod, route: e2.route, routeCache: e2.env.routeCache, pathname: r, logger: e2.env.logger, ssr: e2.env.ssr }), a = { ...e2, pathname: r, params: n, props: s, locales: e2.locales, routing: e2.routing, defaultLocale: e2.defaultLocale };
  return Object.defineProperty(a, "locals", { enumerable: true, get() {
    return Reflect.get(t, Jr);
  }, set(i) {
    if (typeof i != "object")
      throw new f(de);
    Reflect.set(t, Jr, i);
  } }), a;
}
function ln(e2) {
  if (e2 === "*")
    return [{ locale: e2, qualityValue: void 0 }];
  let t = [], r = e2.split(",").map((n) => n.trim());
  for (let n of r) {
    let s = n.split(";").map((o) => o.trim()), a = s[0], i = s[1];
    if (s)
      if (i && i.startsWith("q=")) {
        let o = Number.parseFloat(i.slice(2));
        Number.isNaN(o) || o > 1 ? t.push({ locale: a, qualityValue: void 0 }) : t.push({ locale: a, qualityValue: o });
      } else
        t.push({ locale: a, qualityValue: void 0 });
  }
  return t;
}
function pn(e2, t) {
  let r = va(t).map(j);
  return e2.filter((n) => n.locale !== "*" ? r.includes(j(n.locale)) : true).sort((n, s) => {
    if (n.qualityValue && s.qualityValue) {
      if (n.qualityValue > s.qualityValue)
        return -1;
      if (n.qualityValue < s.qualityValue)
        return 1;
    }
    return 0;
  });
}
function un(e2, t) {
  let r = e2.headers.get("Accept-Language"), n;
  if (r) {
    let a = pn(ln(r), t).at(0);
    if (a && a.locale !== "*")
      for (let i of t)
        if (typeof i == "string")
          j(i) === j(a.locale) && (n = i);
        else
          for (let o of i.codes)
            j(o) === j(a.locale) && (n = i.path);
  }
  return n;
}
function dn(e2, t) {
  let r = e2.headers.get("Accept-Language"), n = [];
  if (r) {
    let s = pn(ln(r), t);
    if (s.length === 1 && s.at(0).locale === "*")
      return t.map((a) => typeof a == "string" ? a : a.codes.at(0));
    if (s.length > 0)
      for (let a of s)
        for (let i of t)
          if (typeof i == "string")
            j(i) === j(a.locale) && n.push(i);
          else
            for (let o of i.codes)
              o === a.locale && n.push(i.path);
  }
  return n;
}
function fn(e2, t, r, n) {
  let s = new URL(e2.url);
  for (let a of s.pathname.split("/"))
    for (let i of t)
      if (typeof i == "string") {
        if (j(i) === j(a))
          return i;
      } else if (i.path === a)
        return i.codes.at(0);
  if (r === "prefix-other-locales")
    return n;
}
var Kr = Symbol.for("astro.clientAddress");
var vt = Symbol.for("astro.locals");
function mn({ request: e2, params: t, site: r, props: n, adapterName: s, locales: a, routingStrategy: i, defaultLocale: o }) {
  let l, p, c;
  return { cookies: new Le(e2), request: e2, params: t, site: r ? new URL(r) : void 0, generator: `Astro v${st}`, props: n, redirect(u, m) {
    return new Response(null, { status: m || 302, headers: { Location: u } });
  }, get preferredLocale() {
    if (l)
      return l;
    if (a)
      return l = un(e2, a), l;
  }, get preferredLocaleList() {
    if (p)
      return p;
    if (a)
      return p = dn(e2, a), p;
  }, get currentLocale() {
    return c || (a && (c = fn(e2, a, i, o)), c);
  }, url: new URL(e2.url), get clientAddress() {
    if (Kr in e2)
      return Reflect.get(e2, Kr);
    throw s ? new f({ ...te, message: te.message(s) }) : new f(ze);
  }, get locals() {
    let u = Reflect.get(e2, vt);
    if (u === void 0 && (u = {}, Reflect.set(e2, vt, u)), typeof u != "object")
      throw new f(de);
    return u;
  }, set locals(u) {
    if (typeof u != "object")
      throw new f(de);
    Reflect.set(e2, vt, u);
  } };
}
async function Za(e2, t, r, n) {
  let s = mn({ request: r.request, params: r.params, props: r.props, site: t.site, adapterName: t.adapterName, routingStrategy: r.routing, defaultLocale: r.defaultLocale, locales: r.locales }), a;
  return n ? a = await sn(n, s, async () => await at(e2, s, t.ssr, t.logger)) : a = await at(e2, s, t.ssr, t.logger), Et(a, s.cookies), a;
}
function ei(...e2) {
  let t = e2.filter((n) => !!n), r = t.length;
  return r ? (n, s) => {
    return a(0, n);
    function a(i, o) {
      let l = t[i];
      return l(o, async () => i < r - 1 ? a(i + 1, o) : s());
    }
  } : (s, a) => a();
}
function Pt(e2, t, r) {
  return r ? U(r, ye(e2)) : t ? J(U(t, ye(e2))) : e2;
}
function ti(e2, t, r) {
  return e2.type === "inline" ? { props: {}, children: e2.content } : { props: { rel: "stylesheet", href: Pt(e2.src, t, r) }, children: "" };
}
function ri(e2, t, r) {
  return new Set(e2.map((n) => ti(n, t, r)));
}
function ni(e2, t, r) {
  return e2.type === "external" ? si(e2.value, t, r) : { props: { type: "module" }, children: e2.value };
}
function si(e2, t, r) {
  return { props: { type: "module", src: Pt(e2, t, r) }, children: "" };
}
function Yr(e2, t) {
  let r = decodeURI(e2);
  return t.routes.find((n) => n.pattern.test(r) || n.fallbackRoutes.some((s) => s.pattern.test(r)));
}
var Qr = Symbol.for("astro.clientAddress");
var ai = Symbol.for("astro.responseSent");
function ii(e2) {
  if (e2 && e2.expressions?.length === 1)
    return e2.expressions[0];
}
var St = class {
  #e;
  #t;
  #r;
  constructor(t, r, n) {
    if (this.#e = t, this.#t = r, this.#r = n, r)
      for (let s of Object.keys(r)) {
        if (this[s] !== void 0)
          throw new f({ ...Xe, message: Xe.message(s) });
        Object.defineProperty(this, s, { get() {
          return true;
        }, enumerable: true });
      }
  }
  has(t) {
    return this.#t ? !!this.#t[t] : false;
  }
  async render(t, r = []) {
    if (!this.#t || !this.has(t))
      return;
    let n = this.#e;
    if (!Array.isArray(r))
      this.#r.warn(null, `Expected second parameter to be an array, received a ${typeof r}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as a item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`);
    else if (r.length > 0) {
      let i = this.#t[t], o = typeof i == "function" ? await i(n) : await i, l = ii(o);
      if (l)
        return await H(n, async () => typeof l == "function" ? l(...r) : l).then((c) => c != null ? String(c) : c);
      if (typeof o == "function")
        return await k(n, o(...r)).then((p) => p != null ? String(p) : p);
    }
    let s = await H(n, this.#t[t]);
    return _(n, s);
  }
};
function oi(e2) {
  let { params: t, request: r, resolve: n, locals: s } = e2, a = new URL(r.url), i = new Headers();
  i.set("Content-Type", "text/html");
  let o = { status: e2.status, statusText: "OK", headers: i };
  Object.defineProperty(o, "headers", { value: o.headers, enumerable: true, writable: false });
  let l = e2.cookies, p, c, d, u = { styles: e2.styles ?? /* @__PURE__ */ new Set(), scripts: e2.scripts ?? /* @__PURE__ */ new Set(), links: e2.links ?? /* @__PURE__ */ new Set(), componentMetadata: e2.componentMetadata ?? /* @__PURE__ */ new Map(), renderers: e2.renderers, clientDirectives: e2.clientDirectives, compressHTML: e2.compressHTML, partial: e2.partial, pathname: e2.pathname, cookies: l, createAstro(m, b, w) {
    let g = new St(u, w, e2.logger);
    return { __proto__: m, get clientAddress() {
      if (!(Qr in r))
        throw e2.adapterName ? new f({ ...te, message: te.message(e2.adapterName) }) : new f(ze);
      return Reflect.get(r, Qr);
    }, get cookies() {
      return l || (l = new Le(r), u.cookies = l, l);
    }, get preferredLocale() {
      if (p)
        return p;
      if (e2.locales)
        return p = un(r, e2.locales), p;
    }, get preferredLocaleList() {
      if (c)
        return c;
      if (e2.locales)
        return c = dn(r, e2.locales), c;
    }, get currentLocale() {
      if (d || e2.locales && (d = fn(r, e2.locales, e2.routingStrategy, e2.defaultLocale), d))
        return d;
    }, params: t, props: b, locals: s, request: r, url: a, redirect(y, T) {
      if (r[ai])
        throw new f({ ...pe });
      return new Response(null, { status: T || 302, headers: { Location: y } });
    }, response: o, slots: g };
  }, resolve: n, response: o, _metadata: { hasHydrationScript: false, hasRenderedHead: false, hasDirectives: /* @__PURE__ */ new Set(), headInTree: false, extraHead: [], propagators: /* @__PURE__ */ new Set() } };
  return u;
}
async function Zr({ mod: e2, renderContext: t, env: r, cookies: n }) {
  if (an(t.route))
    return new Response(null, { status: Ha(t.route, t.request.method), headers: { location: Da(t.route, t.params) } });
  if (on(t.route))
    return new Response(null, { status: 404 });
  if (!e2)
    throw new f(Kt);
  let s = e2.default;
  if (!s)
    throw new Error(`Expected an exported Astro component but received typeof ${typeof s}`);
  let a = oi({ adapterName: r.adapterName, links: t.links, styles: t.styles, logger: r.logger, params: t.params, pathname: t.pathname, componentMetadata: t.componentMetadata, resolve: r.resolve, renderers: r.renderers, clientDirectives: r.clientDirectives, compressHTML: r.compressHTML, request: t.request, partial: !!e2.partial, site: r.site, scripts: t.scripts, ssr: r.ssr, status: t.status ?? 200, cookies: n, locals: t.locals ?? {}, locales: t.locales, defaultLocale: t.defaultLocale, routingStrategy: t.routing }), i = await Sr(a, s, t.props, {}, r.streaming, t.route);
  return a.cookies && Et(i, a.cookies), i;
}
var At = class {
  env;
  #e;
  #t = { before: [] };
  #r;
  constructor(t) {
    this.env = t;
  }
  setEnvironment() {
  }
  setEndpointHandler(t) {
    this.#r = t;
  }
  setMiddlewareFunction(t) {
    this.#e = t;
  }
  unsetMiddlewareFunction() {
    this.#e = void 0;
  }
  getEnvironment() {
    return this.env;
  }
  async renderRoute(t, r) {
    for (let s of this.#t.before)
      s(t, r);
    let n = await this.#s(t, this.env, r, this.#e);
    if (t.route.type === "endpoint") {
      if (!this.#r)
        throw new Error("You created a pipeline that does not know how to handle the result coming from an endpoint.");
      return this.#r(t.request, n);
    } else
      return n;
  }
  async #s(t, r, n, s) {
    let a = mn({ request: t.request, params: t.params, props: t.props, site: r.site, adapterName: r.adapterName, locales: t.locales, routingStrategy: t.routing, defaultLocale: t.defaultLocale });
    switch (t.route.type) {
      case "page":
      case "fallback":
      case "redirect":
        return s ? await sn(s, a, () => Zr({ mod: n, renderContext: t, env: r, cookies: a.cookies })) : await Zr({ mod: n, renderContext: t, env: r, cookies: a.cookies });
      case "endpoint":
        return await Za(n, r, t, s);
      default:
        throw new Error(`Couldn't find route of type [${t.route.type}]`);
    }
  }
  onBeforeRenderRoute(t) {
    this.#t.before.push(t);
  }
};
var Te = class extends Error {
  originalResponse;
  constructor(t) {
    super(), this.originalResponse = t;
  }
};
var $t = class extends At {
  constructor(t) {
    super(t), this.setEndpointHandler(this.#e);
  }
  async #e(t, r) {
    if (r.headers.get("X-Astro-Response") === "Not-Found")
      throw new Te(r);
    return r;
  }
};
var ci = Symbol.for("astro.locals");
var en = Symbol.for("astro.responseSent");
var li = /* @__PURE__ */ new Set([404, 500]);
var jt = class {
  #e;
  #t;
  #r;
  #s = new xe({ dest: Na, level: "info" });
  #a;
  #n;
  #c;
  #l = false;
  constructor(t, r = true) {
    this.#e = t, this.#t = { routes: t.routes.map((n) => n.routeData) }, this.#r = new Map(t.routes.map((n) => [n.routeData, n])), this.#a = ne(this.#e.base), this.#n = new $t(this.#d(r)), this.#c = new ae(this.#s.options, this.#e.adapterName);
  }
  getAdapterLogger() {
    return this.#c;
  }
  #d(t = false) {
    return { adapterName: this.#e.adapterName, logger: this.#s, mode: "production", compressHTML: this.#e.compressHTML, renderers: this.#e.renderers, clientDirectives: this.#e.clientDirectives, resolve: async (r) => {
      if (!(r in this.#e.entryModules))
        throw new Error(`Unable to resolve [${r}]`);
      let n = this.#e.entryModules[r];
      switch (true) {
        case n.startsWith("data:"):
        case n.length === 0:
          return n;
        default:
          return Pt(n, this.#e.base, this.#e.assetsPrefix);
      }
    }, routeCache: new xt(this.#s), site: this.#e.site, ssr: true, streaming: t };
  }
  set setManifestData(t) {
    this.#t = t;
  }
  removeBase(t) {
    return t.startsWith(this.#e.base) ? t.slice(this.#a.length + 1) : t;
  }
  #f(t) {
    let r = new URL(t.url);
    return J(this.removeBase(r.pathname));
  }
  match(t) {
    let r = new URL(t.url);
    if (this.#e.assets.has(r.pathname))
      return;
    let n = J(this.removeBase(r.pathname)), s = Yr(n, this.#t);
    if (!(!s || s.prerender))
      return s;
  }
  async render(t, r, n) {
    let s, a;
    if (r && ("routeData" in r || "locals" in r) ? ("routeData" in r && (s = r.routeData), "locals" in r && (a = r.locals)) : (s = r, a = n, (r || a) && this.#m()), t.url !== he(t.url) && (t = new Request(he(t.url), t)), s || (s = this.match(t)), !s)
      return this.#i(t, { status: 404 });
    Reflect.set(t, ci, a ?? {});
    let i = this.#f(t), o = this.#h(s, i), l = await this.#u(s), p = await l.page(), c = new URL(t.url), d = await this.#p(c, t, s, l, o), u;
    try {
      let m = Sa(this.#e.i18n, this.#e.base, this.#e.trailingSlash);
      m ? (l.onRequest ? this.#n.setMiddlewareFunction(ei(m, l.onRequest)) : this.#n.setMiddlewareFunction(m), this.#n.onBeforeRenderRoute(Aa)) : l.onRequest && this.#n.setMiddlewareFunction(l.onRequest), u = await this.#n.renderRoute(d, p);
    } catch (m) {
      return m instanceof Te ? this.#i(t, { status: 404, response: m.originalResponse }) : (this.#s.error(null, m.stack || m.message || String(m)), this.#i(t, { status: 500 }));
    }
    return s.type === "page" || s.type === "redirect" ? li.has(u.status) ? this.#i(t, { response: u, status: u.status }) : (Reflect.set(u, en, true), u) : u;
  }
  #m() {
    this.#l || (this.#s.warn("deprecated", `The adapter ${this.#e.adapterName} is using a deprecated signature of the 'app.render()' method. From Astro 4.0, locals and routeData are provided as properties on an optional object to this method. Using the old signature will cause an error in Astro 5.0. See https://github.com/withastro/astro/pull/9199 for more information.`), this.#l = true);
  }
  setCookieHeaders(t) {
    return Ca(t);
  }
  async #p(t, r, n, s, a = 200) {
    if (n.type === "endpoint") {
      let i = "/" + this.removeBase(t.pathname), l = await s.page();
      return await Xr({ request: r, pathname: i, route: n, status: a, env: this.#n.env, mod: l, locales: this.#e.i18n?.locales, routing: this.#e.i18n?.routing, defaultLocale: this.#e.i18n?.defaultLocale });
    } else {
      let i = J(this.removeBase(t.pathname)), o = this.#r.get(n), l = /* @__PURE__ */ new Set(), p = ri(o.styles), c = /* @__PURE__ */ new Set();
      for (let u of o.scripts)
        "stage" in u ? u.stage === "head-inline" && c.add({ props: {}, children: u.children }) : c.add(ni(u));
      let d = await s.page();
      return await Xr({ request: r, pathname: i, componentMetadata: this.#e.componentMetadata, scripts: c, styles: p, links: l, route: n, status: a, mod: d, env: this.#n.env, locales: this.#e.i18n?.locales, routing: this.#e.i18n?.routing, defaultLocale: this.#e.i18n?.defaultLocale });
    }
  }
  async #i(t, { status: r, response: n, skipMiddleware: s = false }) {
    let a = `/${r}${this.#e.trailingSlash === "always" ? "/" : ""}`, i = Yr(a, this.#t), o = new URL(t.url);
    if (i) {
      if (i.prerender) {
        let c = i.route.endsWith(`/${r}`) ? ".html" : "", d = new URL(`${this.#a}/${r}${c}`, o), u = await fetch(d.toString()), m = { status: r };
        return this.#o(u, n, m);
      }
      let p = await this.#u(i);
      try {
        let c = await this.#p(o, t, i, p, r), d = await p.page();
        s === false && p.onRequest && this.#n.setMiddlewareFunction(p.onRequest), s && this.#n.unsetMiddlewareFunction();
        let u = await this.#n.renderRoute(c, d);
        return this.#o(u, n);
      } catch {
        if (s === false && p.onRequest)
          return this.#i(t, { status: r, response: n, skipMiddleware: true });
      }
    }
    let l = this.#o(new Response(null, { status: r }), n);
    return Reflect.set(l, en, true), l;
  }
  #o(t, r, n) {
    if (!r)
      return n !== void 0 ? new Response(t.body, { status: n.status, statusText: t.statusText, headers: t.headers }) : t;
    let s = n?.status ? n.status : r.status === 200 ? t.status : r.status;
    try {
      r.headers.delete("Content-type");
    } catch {
    }
    return new Response(t.body, { status: s, statusText: s === 200 ? t.statusText : r.statusText, headers: new Headers([...Array.from(t.headers), ...Array.from(r.headers)]) });
  }
  #h(t, r) {
    if (!t.pattern.exec(r)) {
      for (let s of t.fallbackRoutes)
        if (s.pattern.test(r))
          return 302;
    }
    let n = ne(t.route);
    return n.endsWith("/404") ? 404 : n.endsWith("/500") ? 500 : 200;
  }
  async #u(t) {
    if (t.type === "redirect")
      return Fa;
    if (this.#e.pageMap) {
      let r = this.#e.pageMap.get(t.component);
      if (!r)
        throw new Error(`Unexpectedly unable to find a component instance for route ${t.route}`);
      return await r();
    } else {
      if (this.#e.pageModule)
        return this.#e.pageModule;
      throw new Error("Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue.");
    }
  }
};
var pi = typeof process == "object" && Object.prototype.toString.call(process) === "[object process]";
function ui() {
  return new Proxy({}, { get: (e2, t) => {
    console.warn(`Unable to access \`import.meta\0.env.${t.toString()}\` on initialization as the Cloudflare platform only provides the environment variables per request. Please move the environment variable access inside a function that's only called after a request has been received.`);
  } });
}
pi || (process.env = ui());
function hn(e2) {
  let t = new jt(e2);
  return { default: { fetch: async (n, s, a) => {
    process.env = s;
    let { pathname: i } = new URL(n.url);
    if (e2.assets.has(i))
      return s.ASSETS.fetch(n);
    let o = t.match(n);
    Reflect.set(n, Symbol.for("astro.clientAddress"), n.headers.get("cf-connecting-ip"));
    let l = { runtime: { waitUntil: (c) => {
      a.waitUntil(c);
    }, env: s, cf: n.cf, caches } }, p = await t.render(n, o, l);
    if (t.setCookieHeaders)
      for (let c of t.setCookieHeaders(p))
        p.headers.append("Set-Cookie", c);
    return p;
  } } };
}
var tn = Object.freeze(Object.defineProperty({ __proto__: null, createExports: hn }, Symbol.toStringTag, { value: "Module" }));
var di = () => Promise.resolve().then(() => (Dr(), Nr));
var fi = () => Promise.resolve().then(() => (Vr(), qr));
var mi = /* @__PURE__ */ new Map([["node_modules/.pnpm/astro@4.0.7_typescript@5.3.3/node_modules/astro/dist/assets/endpoint/generic.js", di], ["src/pages/index.astro", fi]]);
var gn = Object.assign(kr, { pageMap: mi, renderers: K });
var hi = void 0;
var gi = hn(gn);
var Oi = gi.default;
var rn = "start";
rn in tn && tn[rn](gn, hi);
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
var jsonError = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error = reduceError(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default = jsonError;
var wrap = void 0;
var envWrappers = [wrap].filter(Boolean);
var facade = {
  ...Oi,
  envWrappers,
  middleware: [
    middleware_miniflare3_json_error_default,
    ...Oi.middleware ? Oi.middleware : []
  ].filter(Boolean)
};
var middleware_insertion_facade_default = facade;
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
          __facade_register__2(middleware);
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
      return __facade_invoke__2(
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

// node_modules/.pnpm/wrangler@3.22.1/node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}

// .wrangler/tmp/pages-FORTRN/zdt08a7rtac.js
var define_ROUTES_default = {
  version: 1,
  include: [
    "/",
    "/_image"
  ],
  exclude: []
};
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
        if (middleware_loader_entry_default.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return middleware_loader_entry_default.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/.pnpm/wrangler@3.22.1/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError2(e2.cause)
  };
}
var jsonError2 = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error = reduceError2(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default2 = jsonError2;
var wrap2 = void 0;

// .wrangler/tmp/bundle-iMjSml/middleware-insertion-facade.js
var envWrappers2 = [wrap2].filter(Boolean);
var facade3 = {
  ...pages_dev_pipeline_default,
  envWrappers: envWrappers2,
  middleware: [
    middleware_miniflare3_json_error_default2,
    ...pages_dev_pipeline_default.middleware ? pages_dev_pipeline_default.middleware : []
  ].filter(Boolean)
};
var middleware_insertion_facade_default2 = facade3;

// .wrangler/tmp/bundle-iMjSml/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
var __facade_modules_fetch__2 = function(request, env, ctx) {
  if (middleware_insertion_facade_default2.fetch === void 0)
    throw new Error("Handler does not export a fetch() function.");
  return middleware_insertion_facade_default2.fetch(request, env, ctx);
};
function getMaskedEnv2(rawEnv) {
  let env = rawEnv;
  if (middleware_insertion_facade_default2.envWrappers && middleware_insertion_facade_default2.envWrappers.length > 0) {
    for (const wrapFn of middleware_insertion_facade_default2.envWrappers) {
      env = wrapFn(env);
    }
  }
  return env;
}
var registeredMiddleware2 = false;
var facade4 = {
  ...middleware_insertion_facade_default2.tail && {
    tail: maskHandlerEnv2(middleware_insertion_facade_default2.tail)
  },
  ...middleware_insertion_facade_default2.trace && {
    trace: maskHandlerEnv2(middleware_insertion_facade_default2.trace)
  },
  ...middleware_insertion_facade_default2.scheduled && {
    scheduled: maskHandlerEnv2(middleware_insertion_facade_default2.scheduled)
  },
  ...middleware_insertion_facade_default2.queue && {
    queue: maskHandlerEnv2(middleware_insertion_facade_default2.queue)
  },
  ...middleware_insertion_facade_default2.test && {
    test: maskHandlerEnv2(middleware_insertion_facade_default2.test)
  },
  ...middleware_insertion_facade_default2.email && {
    email: maskHandlerEnv2(middleware_insertion_facade_default2.email)
  },
  fetch(request, rawEnv, ctx) {
    const env = getMaskedEnv2(rawEnv);
    if (middleware_insertion_facade_default2.middleware && middleware_insertion_facade_default2.middleware.length > 0) {
      if (!registeredMiddleware2) {
        registeredMiddleware2 = true;
        for (const middleware of middleware_insertion_facade_default2.middleware) {
          __facade_register__(middleware);
        }
      }
      const __facade_modules_dispatch__ = function(type, init) {
        if (type === "scheduled" && middleware_insertion_facade_default2.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return middleware_insertion_facade_default2.scheduled(controller, env, ctx);
        }
      };
      return __facade_invoke__(
        request,
        env,
        ctx,
        __facade_modules_dispatch__,
        __facade_modules_fetch__2
      );
    } else {
      return __facade_modules_fetch__2(request, env, ctx);
    }
  }
};
function maskHandlerEnv2(handler) {
  return (data, env, ctx) => handler(data, getMaskedEnv2(env), ctx);
}
var middleware_loader_entry_default2 = facade4;
export {
  middleware_loader_entry_default2 as default,
  mi as pageMap
};
/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=zdt08a7rtac.js.map
