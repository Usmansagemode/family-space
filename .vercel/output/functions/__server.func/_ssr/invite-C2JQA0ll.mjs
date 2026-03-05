import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { R as Route$1, u as useAuthContext, g as getInviteByToken, a as acceptInvite, B as Button, s as supabase } from "./router-KW9KX4qs.mjs";
import { b as LoaderCircle, H as House } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/next-themes.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-label.mjs";
function InvitePage() {
  const {
    token
  } = Route$1.useSearch();
  const {
    user,
    loading: authLoading
  } = useAuthContext();
  const navigate = useNavigate();
  const [invite, setInvite] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState("loading-invite");
  reactExports.useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    getInviteByToken(token).then((info) => {
      if (!info) {
        setStatus("invalid");
      } else {
        setInvite(info);
        setStatus("ready");
      }
    }).catch(() => setStatus("invalid"));
  }, [token]);
  reactExports.useEffect(() => {
    if (authLoading || status !== "ready" || !user || !invite) return;
    setStatus("accepting");
    acceptInvite(token, user.id, invite.familyId).then(() => setStatus("done")).catch((err) => {
      if (err?.code === "23505") {
        setStatus("already-member");
      } else {
        setStatus("invalid");
      }
    });
  }, [authLoading, status, user, invite, token]);
  function handleSignIn() {
    void supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
        redirectTo: window.location.href
      }
    });
  }
  function goHome() {
    void navigate({
      to: "/"
    });
  }
  if (status === "loading-invite" || authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(InviteShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  if (status === "invalid") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(InviteShell, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: "Invalid invite" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This link has already been used or is no longer valid." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: goHome, className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4" }),
        "Go home"
      ] })
    ] });
  }
  if (status === "accepting") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(InviteShell, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Joining family space…" })
    ] });
  }
  if (status === "done" || status === "already-member") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(InviteShell, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: status === "done" ? `You've joined ${invite?.familyName}!` : `You're already a member` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: status === "done" ? "Welcome to the family space." : `You already have access to ${invite?.familyName}.` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: goHome, className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4" }),
        "Open Family Space"
      ] })
    ] });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(InviteShell, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-semibold", children: [
        "You're invited to ",
        invite?.familyName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Sign in with Google to join." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSignIn, className: "gap-2", size: "lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z", fill: "#FBBC05" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })
        ] }),
        "Sign in with Google"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InviteShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
}
function InviteShell({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full flex-col items-center justify-center gap-4 p-8 text-center", children });
}
export {
  InvitePage as component
};
