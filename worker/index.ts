/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_USER?: string;
  ADMIN_PASSWORD?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/") || url.pathname.startsWith("/api/company")) {
      const authorization = request.headers.get("authorization");
      const expectedUser = env.ADMIN_USER;
      const expectedPassword = env.ADMIN_PASSWORD;
      let authorized = false;

      if (authorization?.startsWith("Basic ") && expectedUser && expectedPassword) {
        try {
          const decoded = atob(authorization.slice(6));
          const separator = decoded.indexOf(":");
          const suppliedUser = decoded.slice(0, separator);
          const suppliedPassword = decoded.slice(separator + 1);
          authorized =
            separator > 0 &&
            timingSafeEqual(suppliedUser, expectedUser) &&
            timingSafeEqual(suppliedPassword, expectedPassword);
        } catch {
          authorized = false;
        }
      }

      if (!authorized) {
        return new Response("관리자 인증이 필요합니다.", {
          status: 401,
          headers: {
            "www-authenticate": 'Basic realm="AI Unipass Partner Admin", charset="UTF-8"',
            "cache-control": "no-store",
            "content-type": "text/plain; charset=utf-8",
          },
        });
      }

      const headers = new Headers(request.headers);
      headers.delete("authorization");
      headers.set("x-ai-unipass-admin-authorized", "1");
      headers.set("x-ai-unipass-admin-user", expectedUser);
      request = new Request(request, { headers });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;

function timingSafeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index++) {
    difference |= (a[index % Math.max(a.length, 1)] ?? 0) ^ (b[index % Math.max(b.length, 1)] ?? 0);
  }
  return difference === 0;
}
