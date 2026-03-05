import { c as createRouter, a as createRootRouteWithContext, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { z } from "../_libs/next-themes.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, u as useQuery, a as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { H as House, U as User, S as Sun, M as Moon, a as Settings, L as LogOut, b as LoaderCircle, O as OctagonX, T as TriangleAlert, I as Info, C as CircleCheck, c as ChevronDown, d as ChevronRight, X, E as ExternalLink } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, L as Label2, S as Separator2, I as Item2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { R as Root, C as Content, a as Close, T as Title, D as Description, P as Portal, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { R as Root$1 } from "../_libs/radix-ui__react-label.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
const Toaster = ({ ...props }) => {
  const { theme = "system" } = z();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
        info: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4" }),
        warning: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4" }),
        error: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonX, { className: "size-4" }),
        loading: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" })
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)"
      },
      ...props
    }
  );
};
const supabaseUrl = "https://xlewaivfqpuhusscezxz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZXdhaXZmcXB1aHVzc2Nlenh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTE0MTIsImV4cCI6MjA3NjE4NzQxMn0.xztaWcEVS3R4PSWFsBdEfp6cHM-C0Pzvxg5v0UGqdcM";
const isDemoMode = !supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const SPACE_COLORS = [
  "oklch(0.88 0.10 230)",
  // sky blue
  "oklch(0.88 0.10 150)",
  // mint green
  "oklch(0.90 0.10 85)",
  // soft yellow
  "oklch(0.88 0.10 50)",
  // peach
  "oklch(0.88 0.10 310)",
  // lavender
  "oklch(0.88 0.10 340)",
  // rose
  "oklch(0.88 0.10 185)",
  // aqua
  "oklch(0.88 0.10 20)"
  // coral
];
const DEMO_FAMILY_ID = "eaaf2354-620b-4cff-a549-d1ee90c369d3";
function mapFamily(data) {
  return {
    id: data.id,
    name: data.name,
    googleCalendarId: data.google_calendar_id ?? void 0,
    googleCalendarEmbedUrl: data.google_calendar_embed_url ?? void 0,
    createdAt: new Date(data.created_at)
  };
}
async function fetchFamily(id) {
  const { data, error } = await supabase.from("families").select("*").eq("id", id).single();
  if (error) throw error;
  return mapFamily(data);
}
async function updateFamily(id, input) {
  const dbInput = {};
  if (input.name !== void 0) dbInput["name"] = input.name;
  if (input.googleCalendarId !== void 0)
    dbInput["google_calendar_id"] = input.googleCalendarId || null;
  if (input.googleCalendarEmbedUrl !== void 0)
    dbInput["google_calendar_embed_url"] = input.googleCalendarEmbedUrl || null;
  const { data, error } = await supabase.from("families").update(dbInput).eq("id", id).select().single();
  if (error) throw error;
  return mapFamily(data);
}
async function findOrCreateFamily(userId) {
  const { data: existing } = await supabase.from("families").select("*").eq("owner_user_id", userId).maybeSingle();
  if (existing) return mapFamily(existing);
  const { data: created, error } = await supabase.from("families").insert({ name: "Our Family", owner_user_id: userId }).select().single();
  if (error) throw error;
  return mapFamily(created);
}
function useUserFamily(userId) {
  return useQuery({
    queryKey: ["family", "user", userId],
    queryFn: () => findOrCreateFamily(userId),
    enabled: !!userId,
    staleTime: Infinity
  });
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatDate(date) {
  return format(date, "MMM d");
}
function formatDateFull(date) {
  return format(date, "MMM d, yyyy");
}
function hasExplicitTime(date) {
  return !(date.getHours() === 12 && date.getMinutes() === 0);
}
function formatTime(date) {
  return format(date, "h:mm a");
}
function extractHue(oklchColor) {
  const match = oklchColor.match(/oklch\([\d.]+\s+[\d.]+\s+([\d.]+)\)/);
  return match?.[1] ?? "0";
}
function getDateStatus(date) {
  const now = /* @__PURE__ */ new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffDays = Math.round(
    (dateDay.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24)
  );
  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 2) return "soon";
  return "future";
}
function useIsDark() {
  const [isDark, setIsDark] = reactExports.useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  reactExports.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Label2,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Separator2,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
const AuthContext = reactExports.createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(!isDemoMode);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  function signInWithGoogle() {
    void supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
        redirectTo: window.location.origin
      }
    });
  }
  async function signOut() {
    await supabase.auth.signOut();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        providerToken: session?.provider_token ?? null,
        loading,
        signInWithGoogle,
        signOut
      },
      children
    }
  );
}
function useAuthContext() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$1,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const STEPS = [
  {
    title: "Enable the Google Calendar API",
    body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Go to",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "https://console.cloud.google.com/apis/library/calendar-json.googleapis.com",
          target: "_blank",
          rel: "noreferrer",
          className: "inline-flex items-center gap-0.5 underline underline-offset-2",
          children: [
            "Google Cloud Console ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
          ]
        }
      ),
      ", select or create a project, and click ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Enable" }),
      "."
    ] })
  },
  {
    title: "Create OAuth credentials",
    body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Go to",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID" }),
      ". Choose ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Web application" }),
      ". Under",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Authorised redirect URIs" }),
      " add:",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "mt-1 block rounded bg-muted px-2 py-1 text-xs break-all", children: "https://fmwenxuqdnsbpattjefo.supabase.co/auth/v1/callback" }),
      "Copy the ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Client ID" }),
      " and ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Client Secret" }),
      "."
    ] })
  },
  {
    title: "Configure Supabase Google provider",
    body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "In your",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "https://supabase.com/dashboard",
          target: "_blank",
          rel: "noreferrer",
          className: "inline-flex items-center gap-0.5 underline underline-offset-2",
          children: [
            "Supabase dashboard ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
          ]
        }
      ),
      ", go to ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Authentication → Providers → Google" }),
      ", enable it, and paste in the Client ID and Client Secret from step 2."
    ] })
  },
  {
    title: "Add yourself as a test user",
    body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "In Google Cloud Console go to",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "APIs & Services → OAuth consent screen → Test users" }),
      " ",
      "and add your Gmail address. This lets you sign in while the app is in testing mode (no Google review needed for personal use)."
    ] })
  },
  {
    title: "Sign in with Google",
    body: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Sign out of the app if needed, then sign back in with Google." })
  },
  {
    title: "Create a dedicated calendar",
    body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Open",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "https://calendar.google.com",
          target: "_blank",
          rel: "noreferrer",
          className: "inline-flex items-center gap-0.5 underline underline-offset-2",
          children: [
            "Google Calendar ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
          ]
        }
      ),
      ". In the left sidebar click ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Other calendars → +" }),
      " and choose ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Create new calendar" }),
      ". Name it something like",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Family Space" }),
      " and click ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Create calendar" }),
      "."
    ] })
  },
  {
    title: "Find and copy the Calendar ID",
    body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Click the three dots next to your new calendar →",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Settings" }),
      ". Scroll down to",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Integrate calendar" }),
      ". Copy the",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Calendar ID" }),
      " — it looks like",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-muted px-1 py-0.5 text-xs", children: "abc123@group.calendar.google.com" }),
      "."
    ] })
  },
  {
    title: "Paste the Calendar ID here",
    body: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Paste it into the ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Google Calendar ID" }),
      " field above and click ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Save" }),
      ". Any item you add with a date will now appear in that calendar automatically."
    ] })
  }
];
function SettingsSheet({ open, onOpenChange }) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { data: family } = useUserFamily(user?.id);
  const [familyName, setFamilyName] = reactExports.useState("");
  const [calendarId, setCalendarId] = reactExports.useState("");
  const [embedUrl, setEmbedUrl] = reactExports.useState("");
  const [howToOpen, setHowToOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open) {
      setFamilyName(family?.name ?? "");
      setCalendarId(family?.googleCalendarId ?? "");
      setEmbedUrl(family?.googleCalendarEmbedUrl ?? "");
      setHowToOpen(false);
    }
  }, [
    open,
    family?.name,
    family?.googleCalendarId,
    family?.googleCalendarEmbedUrl
  ]);
  const save = useMutation({
    mutationFn: () => updateFamily(family.id, {
      name: familyName.trim() || "Our Family",
      googleCalendarId: calendarId.trim() || void 0,
      googleCalendarEmbedUrl: embedUrl.trim() || void 0
    }),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({
        queryKey: ["family", "user", user?.id]
      });
      void queryClient.invalidateQueries({ queryKey: ["family", updated.id] });
      toast.success("Settings saved");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to save settings");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "flex max-w-sm flex-col gap-0 p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "border-b border-border p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Configure your family space" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-6 overflow-y-auto p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "family-name", children: "Family name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "family-name",
            placeholder: "Our Family",
            value: familyName,
            onChange: (e) => setFamilyName(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "calendar-id", children: "Google Calendar ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "calendar-id",
            placeholder: "abc123@group.calendar.google.com",
            value: calendarId,
            onChange: (e) => setCalendarId(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Items with a date will sync to this Google Calendar." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "embed-url", children: "Calendar Embed URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "embed-url",
            placeholder: "https://calendar.google.com/calendar/embed?src=…",
            value: embedUrl,
            onChange: (e) => setEmbedUrl(e.target.value)
          }
        ),
        embedUrl.trim() && !embedUrl.trim().startsWith("https://calendar.google.com/calendar/embed") && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Should start with https://calendar.google.com/calendar/embed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Google Calendar → Settings → your calendar → Integrate calendar → copy the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "src=" }),
          " URL from the Embed code."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setHowToOpen((v) => !v),
            className: "flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground",
            children: [
              howToOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 shrink-0" }),
              "How to set up Google Calendar"
            ]
          }
        ),
        howToOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-4 flex flex-col gap-5 border-l-2 border-border pl-4", children: STEPS.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium leading-snug", children: step.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-muted-foreground", children: step.body })
          ] })
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "flex-1",
          onClick: () => onOpenChange(false),
          disabled: save.isPending,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "flex-1",
          onClick: () => save.mutate(),
          disabled: save.isPending || !family,
          children: [
            save.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            "Save"
          ]
        }
      )
    ] }) })
  ] }) });
}
function applyTheme(mode) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(mode);
  document.documentElement.setAttribute("data-theme", mode);
  document.documentElement.style.colorScheme = mode;
}
function Header() {
  const { user, signOut } = useAuthContext();
  const isDark = useIsDark();
  const [settingsOpen, setSettingsOpen] = reactExports.useState(false);
  const { data: demoFamily, isLoading: demoLoading } = useQuery({
    queryKey: ["family", DEMO_FAMILY_ID],
    queryFn: () => fetchFamily(DEMO_FAMILY_ID),
    enabled: isDemoMode,
    staleTime: Infinity
  });
  const { data: userFamily, isLoading: userFamilyLoading } = useUserFamily(
    user?.id
  );
  const familyName = userFamily?.name;
  const familyNameLoading = userFamilyLoading;
  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    window.localStorage.setItem("theme", next);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold leading-none tracking-tight", children: "Family Space" }),
        familyNameLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-1 h-3 w-20" }) : familyName ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-[11px] leading-none text-muted-foreground", children: familyName }) : null
      ] }),
      isDemoMode
    ] }),
    !!user && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-border transition hover:ring-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          children: user?.user_metadata?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: user.user_metadata.avatar_url,
              className: "h-8 w-8 rounded-full",
              alt: ""
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-muted-foreground" }) })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-52", children: [
        user && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium leading-none", children: user.user_metadata?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs text-muted-foreground", children: user.email })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DropdownMenuItem,
          {
            onSelect: (e) => {
              e.preventDefault();
              toggleTheme();
            },
            children: [
              isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, {}),
              isDark ? "Light mode" : "Dark mode"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onSelect: () => setSettingsOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {}),
            "Settings"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              variant: "destructive",
              onSelect: () => void signOut(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, {}),
                "Sign out"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    !!user && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsSheet, { open: settingsOpen, onOpenChange: setSettingsOpen })
  ] });
}
let context;
function getContext() {
  if (context) {
    return context;
  }
  const queryClient = new QueryClient();
  context = {
    queryClient
  };
  return context;
}
function TanStackQueryProvider({
  children
}) {
  const { queryClient } = getContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children });
}
const appCss = "/assets/styles-DPUHWMOP.css";
const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=stored==='dark'?'dark':stored==='light'?'light':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(mode);root.setAttribute('data-theme',mode);root.style.colorScheme=mode;}catch(e){}})();`;
const Route$1 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Family Space" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("script", { dangerouslySetInnerHTML: { __html: THEME_INIT_SCRIPT } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "font-sans antialiased [overflow-wrap:anywhere]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TanStackQueryProvider, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen flex-col overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-0 flex-1", children })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "bottom-right" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter = () => import("./index-BAiLUmfm.mjs");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$1
});
const rootRouteChildren = {
  IndexRoute
};
const routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    context: getContext(),
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  DropdownMenu as D,
  Input as I,
  Label as L,
  Sheet as S,
  SheetContent as a,
  SheetHeader as b,
  cn as c,
  SheetTitle as d,
  extractHue as e,
  formatDate as f,
  getDateStatus as g,
  hasExplicitTime as h,
  formatTime as i,
  Skeleton as j,
  formatDateFull as k,
  SPACE_COLORS as l,
  DropdownMenuTrigger as m,
  DropdownMenuContent as n,
  DropdownMenuItem as o,
  DropdownMenuSeparator as p,
  useAuthContext as q,
  useUserFamily as r,
  supabase as s,
  router as t,
  useIsDark as u
};
