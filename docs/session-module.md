# Session Module Guide

This document explains how the custom session stack works, how to reuse it in new projects, and what to touch when the backend changes the user payload.

## 1. Architecture at a Glance

```
┌──────────────────────────────────────────────────────────┐
│ src/lib/session-manager.ts                               │
│   Generic cookie manager: encryption, persistence        │
│                                                          │
│ src/lib/session-schema.ts                                │
│   Normalises domain data <-> serialized payload          │
│                                                          │
│ src/lib/session.ts                                       │
│   Project-specific wrapper (server-only)                 │
│                                                          │
│ src/lib/session-client.ts                                │
│   Client utilities: caching, hook, sign-out helper       │
└──────────────────────────────────────────────────────────┘
```

Supporting pieces:

- `src/shared/types/auth/session.type.ts` declares the shareable `SessionPayload`, `SessionUser`, etc.
- Auth server actions (`src/app/auth/actions/*.ts`) call `createSession` / `updateSession`.
- Route guard (`src/proxy.ts`) redirects unauthenticated requests hitting `/admin`.
- The admin dashboard consumes the hook (`src/app/admin/page.tsx`).

## 2. Environment & Configuration

Set these variables in `.env.local`:

```
SESSION_SECRET=replace-me             # >= 16 chars, used for AES-256-GCM
SESSION_COOKIE_NAME=chrono_session    # optional, defaults to chrono_session
SESSION_MAX_AGE=86400                 # optional, seconds (default 7 days)
```

The wrapper in `src/lib/session.ts` reads them and creates a configured manager:

```ts
const sessionManager = createSessionManager<SessionPayload>({
  secret: ENVIRONMENT.SESSION_SECRET,
  cookieName: ENVIRONMENT.SESSION_COOKIE_NAME || "chrono_session",
  maxAge: DEFAULT_MAX_AGE,
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: ENVIRONMENT.COOKIE_SECURE === "true",
    path: "/",
  },
  serialize: ensureSessionPayload,
  deserialize: ensureSessionPayload,
});
```

Adjust the cookie options there if you need a different scope (e.g. `domain` for sub-domains).

## 3. Server-Side API (`src/lib/session.ts`)

| Function                           | What it does                                            | Typical call site                 |
| ---------------------------------- | ------------------------------------------------------- | --------------------------------- |
| `createSession(input)`             | Builds payload, encrypts, writes cookie                 | Login / sign-up flow              |
| `getSession()`                     | Reads cookie in the current request context             | Server components, server actions |
| `getSessionFromRequest(request)`   | Reads cookie from a `NextRequest` (middleware/proxy)    | `src/proxy.ts`                    |
| `updateSession(mutator, options?)` | Reads current payload, lets you mutate, rewrites cookie | `setCompanyAction`, token refresh |
| `destroySession()`                 | Deletes cookie                                          | Sign-out, 401 handlers            |

All helpers run on the server (they use `cookies()` under the hood). Do not import them into Client Components.

## 4. Client-Side API (`src/lib/session-client.ts`)

| Utility                                                        | Description                                                                         |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `getClientSession(forceRefresh = false)`                       | Fetches `/api/session`, caches result for 30s by default                            |
| `useClientSession({ refreshInterval?, forceRefreshOnMount? })` | React hook that handles loading state, cache refresh, and exposes `refresh(force?)` |
| `signOut()`                                                    | Calls `DELETE /api/session`, clears cache                                           |
| `clearSessionCache()`                                          | Resets client cache manually                                                        |

Example usage (see `src/app/admin/page.tsx`):

```tsx
const { data: session, isLoading, refresh } = useClientSession();

if (!session) {
  return <button onClick={() => refresh(true)}>Reintentar</button>;
}

return <pre>{JSON.stringify(session.user, null, 2)}</pre>;
```

## 5. Normalising the Payload (`src/lib/session-schema.ts`)

`buildSessionPayload` and `ensureSessionPayload` are the only places that should know about the backend response shape. They:

- Guarantee `tokens.accessToken` / `refreshToken` exist with predictable casing.
- Normalise company arrays and select a default company.
- Convert permission objects into the `SessionPermission` alias.
- Stamp metadata (issued-at, expires-at, max-age).

When the backend changes the user response, update these functions (and the associated types) instead of touching the manager or client utilities.

## 6. Shared Types (`src/shared/types/auth/session.type.ts`)

Key exports:

- `SessionUser`: extendable user shape (`Partial<TUser>` by default). Add any extra fields here.
- `SessionCompany`, `SessionPermission`: aliases you can widen with extra info.
- `SessionMetadata`: envelope information stored alongside the payload.
- `SessionPayload`: canonical shape persisted in cookies.
- `CreateSessionInput`: what `createSession` expects from the auth flow.

To support a new backend field, e.g. `preferredLanguage`, update:

1. `SessionUser` or `SessionMetadata` as needed.
2. `buildSessionPayload` to copy the new field from the backend response.
3. Client components (optional) to read the new field.

## 7. Auth Flows

- `loginAction` (`src/app/auth/actions/login.action.ts`) authenticates the user, maps tokens, and calls `createSession`.
- `setCompanyAction` (`src/app/auth/actions/set-company.action.ts`) updates the cookie with the selected company + refreshed permissions using `updateSession`.
- `getPermissionsAction` is purely read-only and does not touch the session.

If you add another action (e.g. token refresh), call `updateSession` so the cookie stays in sync and client cache gets refreshed via the hook.

## 8. API Endpoint (`src/app/api/session/route.ts`)

This route powers the client utilities:

- `GET` → returns the current session or `null`.
- `DELETE` → calls `destroySession()` and responds 204.

When you mount the session module in another project, recreate this endpoint (or equivalent RPC) so the client code can hydrate.

## 9. Route Protection (`src/proxy.ts`)

`proxyGuard` inspects requests before they reach Next.js pages:

```ts
export async function proxyGuard(
  request: NextRequest,
): Promise<NextResponse | null> {
  if (!shouldProtect(request.nextUrl.pathname)) return null;

  const session = await getSessionFromRequest(request);
  if (session) return null;

  const loginUrl = new URL(LOGIN_ROUTE, request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
```

Use it from a `middleware.ts`:

```ts
import { proxyConfig, proxyGuard } from "@/src/proxy";

export const config = { matcher: proxyConfig.matcher };

export default async function middleware(request: NextRequest) {
  return (await proxyGuard(request)) ?? NextResponse.next();
}
```

This keeps `/admin` and subpaths protected without sprinkling guards across pages.

## 10. Sign-Out Flow

On the client:

```tsx
const handleSignOut = async () => {
  await signOut();
  await refresh(true); // optional to reset hook state
  router.replace("/auth/login");
};
```

On the server (e.g. 401 interceptors) call `destroySession()` to wipe the cookie.

## 11. Porting to Another Project

1. Copy `src/lib/session-manager.ts`, `session-schema.ts`, `session.ts`, `session-client.ts`, and `src/shared/types/auth/session.type.ts`.
2. Update type imports (`@/src/...`) to match the new project structure.
3. Recreate `/api/session` route and any auth actions that call `createSession` or `updateSession`.
4. Add `proxy.ts` and middleware to protect routes.
5. Configure environment variables (`SESSION_SECRET`, etc.).
6. Adjust `SessionUser`, `buildSessionPayload`, and related normalisers to the new backend shape.

## 12. Common Pitfalls

- **Client vs Server imports**: never import `src/lib/session.ts` in client components—use `session-client.ts` instead.
- **Secret length**: AES-256-GCM requires a 32-byte key. Our code enforces a minimum length of 16; prefer 32.
- **Stale cache**: call `refresh(true)` or `clearSessionCache()` after any action that mutates the session.
- **Route mismatch**: ensure the middleware matcher matches the routes you expect (`/admin` here). Update `PROTECTED_MATCHERS` when structure changes.

## 13. Testing Tips

- **Unit**: test `buildSessionPayload` with various backend responses to guarantee shape normalisation.
- **Integration**: run the login flow and inspect `document.cookie` (should contain `chrono_session`).
- **Security**: verify cookies are `HttpOnly`, `Secure` in production, and that tampering results in a destroyed session (manager deletes invalid cookies automatically).

Armed with this guide, you can lift the module into new Next.js projects or evolve the current session schema with confidence.
