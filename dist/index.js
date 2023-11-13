// lib/index.ts
import qs from "qs";
function isPOJO(arg) {
  if (arg == null || typeof arg !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(arg);
  if (proto == null) {
    return true;
  }
  return proto === Object.prototype;
}
var Fetch = class {
  baseUrl;
  authFunc;
  constructor(baseUrl, authFunc) {
    this.baseUrl = baseUrl;
    this.authFunc = authFunc;
  }
  async request(url, options = {}) {
    let { headers: customHeaders, stringifyOptions, auth = true, params, body, ...rest } = options;
    if (this.baseUrl && url.startsWith("/")) {
      url = this.baseUrl + url;
    }
    const headers = new Headers(customHeaders);
    if (params) {
      const query = qs.stringify(params, {
        arrayFormat: "comma",
        ...stringifyOptions
      });
      if (url.indexOf("?") >= 0) {
        url += "&" + query;
      } else {
        url += "?" + query;
      }
    }
    if (auth) {
      const authFunc = typeof auth === "function" ? auth : this.authFunc;
      authFunc?.(headers);
    }
    if (isPOJO(body)) {
      headers.append("Content-Type", "application/json");
      body = JSON.stringify(body);
    }
    const res = await fetch(url, {
      body,
      headers,
      ...rest
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error);
    }
    const contentType = res.headers.get("Content-Type") || "";
    let data;
    if (contentType.includes("json")) {
      data = await res.json();
    } else if (contentType.includes("text")) {
      data = await res.text();
    } else {
      data = await res.blob();
    }
    return { res, data };
  }
  GET(url, params, options) {
    return this.request(url, {
      method: "GET",
      params,
      ...options
    });
  }
  POST(url, body, options) {
    return this.request(url, {
      method: "POST",
      body,
      ...options
    });
  }
  PUT(url, body, options) {
    return this.request(url, {
      method: "PUT",
      body,
      ...options
    });
  }
  PATCH(url, body, options) {
    return this.request(url, {
      method: "PATCH",
      body,
      ...options
    });
  }
  DELETE(url, params, options) {
    return this.request(url, {
      method: "DELETE",
      params,
      ...options
    });
  }
};
var lib_default = new Fetch();
export {
  Fetch,
  lib_default as default
};
