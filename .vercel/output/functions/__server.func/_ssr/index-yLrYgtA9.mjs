import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as useSensors, d as useSensor, D as DndContext, e as closestCenter, f as DragOverlay, P as PointerSensor } from "../_libs/dnd-kit__core.mjs";
import { S as SortableContext, h as horizontalListSortingStrategy, a as arrayMove, u as useSortable, v as verticalListSortingStrategy } from "../_libs/dnd-kit__sortable.mjs";
import { a as useQueryClient, b as useMutation, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { q as useAuthContext, j as Skeleton, B as Button, r as useUserFamily, c as cn, s as supabase, D as DropdownMenu, m as DropdownMenuTrigger, n as DropdownMenuContent, o as DropdownMenuItem, p as DropdownMenuSeparator, e as extractHue, u as useIsDark, l as SPACE_COLORS, S as Sheet, a as SheetContent, b as SheetHeader, d as SheetTitle, L as Label, I as Input, g as getDateStatus, f as formatDate, h as hasExplicitTime, i as formatTime, k as formatDateFull } from "./router-B-ZnCBMb.mjs";
import { C as CSS } from "../_libs/dnd-kit__utilities.mjs";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { a } from "../_libs/hookform__resolvers.mjs";
import { e as LayoutGrid, f as CalendarDays, g as Clock, h as Image, P as Plus, G as GripVertical, U as User, i as ShoppingCart, j as Ellipsis, k as History, b as LoaderCircle, l as Calendar, m as Hash, X, R as RotateCcw, n as Trash2, o as Check } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { R as Root, V as Viewport, C as Corner, S as ScrollAreaScrollbar, a as ScrollAreaThumb } from "../_libs/radix-ui__react-scroll-area.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/dnd-kit__accessibility.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/next-themes.mjs";
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
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__number.mjs";
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
function rowToSpace(row) {
  return {
    id: row.id,
    familyId: row.family_id,
    name: row.name,
    color: row.color,
    type: row.type,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at)
  };
}
async function fetchSpaces(familyId) {
  const { data, error } = await supabase.from("spaces").select("*").eq("family_id", familyId).order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToSpace);
}
async function createSpace(input) {
  const maxOrder = await fetchSpaces(input.familyId).then((spaces) => spaces.length).catch(() => 0);
  const { data, error } = await supabase.from("spaces").insert({
    family_id: input.familyId,
    name: input.name,
    color: input.color,
    type: input.type,
    sort_order: maxOrder
  }).select().single();
  if (error) throw error;
  return rowToSpace(data);
}
async function updateSpace(id, input) {
  const { data, error } = await supabase.from("spaces").update(input).eq("id", id).select().single();
  if (error) throw error;
  return rowToSpace(data);
}
async function deleteSpace(id) {
  const { error } = await supabase.from("spaces").delete().eq("id", id);
  if (error) throw error;
}
async function reorderSpaces(orderedIds) {
  const updates = orderedIds.map(
    (id, index) => supabase.from("spaces").update({ sort_order: index }).eq("id", id)
  );
  await Promise.all(updates);
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
function rowToItem(row) {
  return {
    id: row.id,
    spaceId: row.space_id,
    title: row.title,
    description: row.description ?? void 0,
    quantity: row.quantity ?? void 0,
    startDate: row.start_date ? new Date(row.start_date) : void 0,
    endDate: row.end_date ? new Date(row.end_date) : void 0,
    completed: row.completed,
    completedAt: row.completed_at ? new Date(row.completed_at) : void 0,
    googleEventId: row.google_event_id ?? void 0,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}
async function fetchItems(spaceId) {
  const { data, error } = await supabase.from("items").select("*").eq("space_id", spaceId).order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToItem);
}
async function createItem(input) {
  const { data, error } = await supabase.from("items").insert({
    space_id: input.spaceId,
    title: input.title,
    description: input.description ?? null,
    quantity: input.quantity ?? null,
    start_date: input.startDate?.toISOString() ?? null,
    end_date: input.endDate?.toISOString() ?? null,
    google_event_id: input.googleEventId ?? null,
    sort_order: 0
  }).select().single();
  if (error) throw error;
  return rowToItem(data);
}
async function updateItem(id, input) {
  const dbInput = {
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (input.title !== void 0) dbInput["title"] = input.title;
  if (input.description !== void 0)
    dbInput["description"] = input.description;
  if (input.quantity !== void 0) dbInput["quantity"] = input.quantity;
  if (input.startDate !== void 0)
    dbInput["start_date"] = input.startDate.toISOString();
  if (input.endDate !== void 0)
    dbInput["end_date"] = input.endDate.toISOString();
  if (input.googleEventId !== void 0)
    dbInput["google_event_id"] = input.googleEventId;
  const { data, error } = await supabase.from("items").update(dbInput).eq("id", id).select().single();
  if (error) throw error;
  return rowToItem(data);
}
async function completeItem(id) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const { data, error } = await supabase.from("items").update({ completed: true, completed_at: now, updated_at: now }).eq("id", id).select().single();
  if (error) throw error;
  return rowToItem(data);
}
async function deleteItem(id) {
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw error;
}
async function moveItem(id, newSpaceId) {
  const { data, error } = await supabase.from("items").update({ space_id: newSpaceId, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id).select().single();
  if (error) throw error;
  return rowToItem(data);
}
async function reorderItems(spaceId, orderedIds) {
  const results = await Promise.all(
    orderedIds.map(
      (id, index) => supabase.from("items").update({ sort_order: index }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}
async function reAddItem(original) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const { data, error } = await supabase.from("items").update({ completed: false, completed_at: null, updated_at: now }).eq("id", original.id).select().single();
  if (error) throw error;
  return rowToItem(data);
}
function useItems(spaceId) {
  return useQuery({
    queryKey: ["items", spaceId],
    queryFn: () => fetchItems(spaceId),
    staleTime: 1e3 * 60 * 2
  });
}
const schema$1 = object({
  title: string().min(1, "Title is required").max(200),
  description: string().max(500).optional(),
  quantity: string().max(50).optional()
});
function AddItemSheet({
  open,
  onOpenChange,
  spaceId,
  spaceName,
  spaceType,
  familyId,
  editItem,
  onCreate,
  onUpdate,
  onComplete,
  onDelete,
  onMove,
  isPending
}) {
  const isStore = spaceType === "store";
  const isEditing = !!editItem;
  const [moveToSpaceId, setMoveToSpaceId] = reactExports.useState("");
  const { data: allSpaces } = useQuery({
    queryKey: ["spaces", familyId],
    queryFn: () => fetchSpaces(familyId),
    enabled: isEditing && !!familyId,
    staleTime: 1e3 * 60 * 5
  });
  const otherSpaces = (allSpaces ?? []).filter(
    (s) => s.type === spaceType && s.id !== spaceId
  );
  const [startDate, setStartDate] = reactExports.useState(
    editItem?.startDate
  );
  const [endDate, setEndDate] = reactExports.useState(editItem?.endDate);
  const [startTimeStr, setStartTimeStr] = reactExports.useState(
    editItem?.startDate && hasExplicitTime(editItem.startDate) ? format(editItem.startDate, "HH:mm") : ""
  );
  const [endTimeStr, setEndTimeStr] = reactExports.useState(
    editItem?.endDate && hasExplicitTime(editItem.endDate) ? format(editItem.endDate, "HH:mm") : ""
  );
  const [startOpen, setStartOpen] = reactExports.useState(false);
  const [endOpen, setEndOpen] = reactExports.useState(false);
  const [showSuggestions, setShowSuggestions] = reactExports.useState(false);
  const [lastAddedTitle, setLastAddedTitle] = reactExports.useState(null);
  const { register, handleSubmit, reset, formState, watch, setValue } = useForm({
    resolver: a(schema$1),
    defaultValues: {
      title: editItem?.title ?? "",
      description: editItem?.description ?? "",
      quantity: editItem?.quantity ?? ""
    }
  });
  const titleValue = watch("title");
  const titleField = register("title", {
    onChange: () => setLastAddedTitle(null)
  });
  const { data: allItems } = useItems(spaceId);
  const suggestions = reactExports.useMemo(() => {
    if (!allItems || isEditing) return [];
    const seen = /* @__PURE__ */ new Set();
    return allItems.filter((i) => i.completed).sort(
      (a2, b) => (b.completedAt?.getTime() ?? 0) - (a2.completedAt?.getTime() ?? 0)
    ).filter((i) => {
      const key = i.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).filter(
      (i) => !titleValue.trim() || i.title.toLowerCase().includes(titleValue.toLowerCase())
    ).slice(0, 6);
  }, [allItems, titleValue, isEditing]);
  reactExports.useEffect(() => {
    if (open) {
      reset({
        title: editItem?.title ?? "",
        description: editItem?.description ?? "",
        quantity: editItem?.quantity ?? ""
      });
      setStartDate(editItem?.startDate);
      setEndDate(editItem?.endDate);
      setStartTimeStr(
        editItem?.startDate && hasExplicitTime(editItem.startDate) ? format(editItem.startDate, "HH:mm") : ""
      );
      setEndTimeStr(
        editItem?.endDate && hasExplicitTime(editItem.endDate) ? format(editItem.endDate, "HH:mm") : ""
      );
      setMoveToSpaceId("");
      setLastAddedTitle(null);
      setShowSuggestions(!editItem);
    }
  }, [open, editItem, reset]);
  function onSubmit(data) {
    const description = data.description?.trim() || void 0;
    const quantity = isStore ? data.quantity?.trim() || void 0 : void 0;
    if (isEditing && editItem && onUpdate) {
      onUpdate({
        id: editItem.id,
        title: data.title,
        description,
        quantity: isStore ? quantity ?? null : void 0,
        startDate: isStore ? void 0 : startDate,
        endDate: isStore ? void 0 : endDate
      });
    } else {
      const addedTitle = data.title;
      onCreate({
        title: addedTitle,
        description,
        quantity,
        startDate: isStore ? void 0 : startDate,
        endDate: isStore ? void 0 : endDate
      });
      reset({ title: "", description: "", quantity: "" });
      setStartDate(void 0);
      setEndDate(void 0);
      setStartTimeStr("");
      setEndTimeStr("");
      setLastAddedTitle(addedTitle);
      setShowSuggestions(true);
    }
  }
  const handleComplete = reactExports.useCallback(() => {
    if (editItem && onComplete) {
      onComplete(editItem);
    }
  }, [editItem, onComplete]);
  function handleDelete() {
    if (editItem && onDelete) {
      onDelete(editItem);
    }
  }
  function pickSuggestion(title) {
    setValue("title", title, { shouldValidate: true });
    setShowSuggestions(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "flex max-w-sm flex-col gap-0 p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "border-b border-border p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: isEditing ? editItem.title : `Add to ${spaceName}` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit(onSubmit),
        className: "flex flex-1 flex-col gap-5 overflow-y-auto p-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "item-title", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "item-title",
                placeholder: "What needs doing?",
                autoFocus: true,
                autoComplete: "off",
                ...titleField,
                onFocus: () => setShowSuggestions(true),
                onBlur: (e) => {
                  void titleField.onBlur(e);
                  setTimeout(() => setShowSuggestions(false), 120);
                }
              }
            ),
            formState.errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formState.errors.title.message }),
            showSuggestions && suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-md border border-border bg-popover shadow-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "border-b border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground", children: "From history" }),
              suggestions.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onMouseDown: (e) => {
                    e.preventDefault();
                    pickSuggestion(item.title);
                  },
                  className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-accent",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 shrink-0 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: item.title })
                  ]
                },
                item.id
              ))
            ] })
          ] }),
          isStore && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "item-qty", children: "Quantity (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "item-qty",
                  placeholder: "e.g. 2, 500g, 1 dozen",
                  className: "pl-9",
                  ...register("quantity")
                }
              )
            ] })
          ] }),
          !isStore && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: startOpen, onOpenChange: setStartOpen, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    className: cn(
                      "flex-1 justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "mr-2 h-4 w-4" }),
                      startDate ? format(startDate, "MMM d, yyyy") : "Pick a date"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    value: startDate ? format(startDate, "yyyy-MM-dd") : "",
                    onChange: (e) => {
                      if (e.target.value) {
                        const d = /* @__PURE__ */ new Date(e.target.value + "T12:00:00");
                        if (startTimeStr) {
                          const [h, m] = startTimeStr.split(":").map(Number);
                          d.setHours(h, m, 0, 0);
                        }
                        setStartDate(d);
                      } else {
                        setStartDate(void 0);
                        setEndDate(void 0);
                        setStartTimeStr("");
                        setEndTimeStr("");
                      }
                      setStartOpen(false);
                    }
                  }
                ) })
              ] }),
              startDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "time",
                  className: "w-28 rounded-md border border-input bg-background px-3 py-2 text-sm",
                  value: startTimeStr,
                  onChange: (e) => {
                    const t = e.target.value;
                    setStartTimeStr(t);
                    const updated = new Date(startDate);
                    if (t) {
                      const [h, m] = t.split(":").map(Number);
                      updated.setHours(h, m, 0, 0);
                    } else {
                      updated.setHours(12, 0, 0, 0);
                    }
                    setStartDate(updated);
                  }
                }
              )
            ] }),
            startDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "self-start text-xs text-muted-foreground hover:text-foreground",
                onClick: () => {
                  setStartDate(void 0);
                  setEndDate(void 0);
                  setStartTimeStr("");
                  setEndTimeStr("");
                },
                children: "Clear date"
              }
            )
          ] }),
          !isStore && startDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "End date / time (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: endOpen, onOpenChange: setEndOpen, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    className: cn(
                      "flex-1 justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "mr-2 h-4 w-4" }),
                      endDate ? format(endDate, "MMM d, yyyy") : "End date"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    value: endDate ? format(endDate, "yyyy-MM-dd") : "",
                    min: format(startDate, "yyyy-MM-dd"),
                    onChange: (e) => {
                      if (e.target.value) {
                        const d = /* @__PURE__ */ new Date(e.target.value + "T12:00:00");
                        if (endTimeStr) {
                          const [h, m] = endTimeStr.split(":").map(Number);
                          d.setHours(h, m, 0, 0);
                        }
                        setEndDate(d);
                      } else {
                        setEndDate(void 0);
                        setEndTimeStr("");
                      }
                      setEndOpen(false);
                    }
                  }
                ) })
              ] }),
              endDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "time",
                  className: "w-28 rounded-md border border-input bg-background px-3 py-2 text-sm",
                  value: endTimeStr,
                  onChange: (e) => {
                    const t = e.target.value;
                    setEndTimeStr(t);
                    const updated = new Date(endDate);
                    if (t) {
                      const [h, m] = t.split(":").map(Number);
                      updated.setHours(h, m, 0, 0);
                    } else {
                      updated.setHours(12, 0, 0, 0);
                    }
                    setEndDate(updated);
                  }
                }
              )
            ] })
          ] }),
          isEditing && onMove && otherSpaces.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "item-move", children: "Move to space" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "item-move",
                  value: moveToSpaceId,
                  onChange: (e) => setMoveToSpaceId(e.target.value),
                  className: "flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "", children: [
                      "— ",
                      spaceName,
                      " (current) —"
                    ] }),
                    otherSpaces.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
                  ]
                }
              ),
              moveToSpaceId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => onMove(moveToSpaceId),
                  disabled: isPending,
                  children: "Move"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "item-desc", children: "Notes (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "item-desc",
                placeholder: "Any extra details…",
                rows: 3,
                ...register("description")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex flex-col gap-2", children: [
            isEditing && onComplete && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "w-full border-green-200 text-green-600 hover:border-green-400 hover:bg-green-50 hover:text-green-600 dark:border-green-800 dark:hover:bg-green-950",
                onClick: handleComplete,
                disabled: isPending,
                children: "Mark as Done"
              }
            ),
            isEditing && onDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "w-full border-destructive/30 text-destructive hover:border-destructive hover:bg-destructive/5",
                onClick: handleDelete,
                disabled: isPending,
                children: "Delete"
              }
            ),
            !isEditing && lastAddedTitle && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                '"',
                lastAddedTitle,
                '"'
              ] }),
              " ",
              "added"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1",
                  onClick: () => onOpenChange(false),
                  children: isEditing ? "Cancel" : "Done"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "flex-1", disabled: isPending, children: [
                isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                isEditing ? "Save" : "Add"
              ] })
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
const API = "https://www.googleapis.com/calendar/v3";
const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
async function createCalendarEvent(token, calendarId, input) {
  const end = input.endDate ?? new Date(input.startDate.getTime() + 30 * 60 * 1e3);
  const res = await fetch(
    `${API}/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        summary: input.title,
        start: { dateTime: input.startDate.toISOString(), timeZone: TZ },
        end: { dateTime: end.toISOString(), timeZone: TZ }
      })
    }
  );
  if (!res.ok) throw new Error(`Calendar API ${res.status}`);
  const data = await res.json();
  return { id: data.id, htmlLink: data.htmlLink };
}
async function updateCalendarEvent(token, calendarId, eventId, input) {
  const end = input.endDate ?? new Date(input.startDate.getTime() + 30 * 60 * 1e3);
  const res = await fetch(
    `${API}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        summary: input.title,
        start: { dateTime: input.startDate.toISOString(), timeZone: TZ },
        end: { dateTime: end.toISOString(), timeZone: TZ }
      })
    }
  );
  if (!res.ok) throw new Error(`Calendar API ${res.status}`);
}
async function deleteCalendarEvent(token, calendarId, eventId) {
  const res = await fetch(
    `${API}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Calendar API ${res.status}`);
  }
}
const BoardContext = reactExports.createContext(null);
function BoardProvider({
  children,
  familyId,
  providerToken,
  calendarId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BoardContext.Provider, { value: { familyId, providerToken, calendarId }, children });
}
function useBoardContext() {
  const ctx = reactExports.useContext(BoardContext);
  if (!ctx) throw new Error("useBoardContext must be used within BoardProvider");
  return ctx;
}
function useItemMutations(spaceId) {
  const queryClient = useQueryClient();
  const { providerToken, calendarId } = useBoardContext();
  const key = ["items", spaceId];
  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });
  async function tryDeleteEvent(googleEventId) {
    if (googleEventId && providerToken && calendarId) {
      await deleteCalendarEvent(providerToken, calendarId, googleEventId);
    }
  }
  const create = useMutation({
    mutationFn: async (input) => {
      let googleEventId;
      if (providerToken && calendarId && input.startDate) {
        const result = await createCalendarEvent(providerToken, calendarId, {
          title: input.title,
          startDate: input.startDate,
          endDate: input.endDate
        });
        googleEventId = result.id;
      }
      return createItem({ spaceId, ...input, googleEventId });
    },
    onSuccess: () => {
      void invalidate();
      toast.success("Item added");
    },
    onError: () => {
      toast.error("Failed to add item");
    }
  });
  const update = useMutation({
    mutationFn: async (input) => {
      let googleEventId = void 0;
      if (providerToken && calendarId) {
        const cached = queryClient.getQueryData(key)?.find((i) => i.id === input.id);
        const existingEventId = cached?.googleEventId;
        if (existingEventId) {
          if (input.startDate !== void 0) {
            await updateCalendarEvent(
              providerToken,
              calendarId,
              existingEventId,
              {
                title: input.title ?? cached?.title ?? "",
                startDate: input.startDate,
                endDate: input.endDate
              }
            );
          } else {
            await deleteCalendarEvent(
              providerToken,
              calendarId,
              existingEventId
            );
            googleEventId = null;
          }
        } else if (input.startDate !== void 0) {
          const result = await createCalendarEvent(providerToken, calendarId, {
            title: input.title ?? cached?.title ?? "",
            startDate: input.startDate,
            endDate: input.endDate
          });
          googleEventId = result.id;
        }
      }
      return updateItem(input.id, {
        title: input.title,
        description: input.description,
        quantity: input.quantity,
        startDate: input.startDate,
        endDate: input.endDate,
        ...googleEventId !== void 0 && { googleEventId }
      });
    },
    onSuccess: () => {
      void invalidate();
      toast.success("Item updated");
    },
    onError: () => {
      toast.error("Failed to update item");
    }
  });
  const complete = useMutation({
    mutationFn: async (item) => {
      await tryDeleteEvent(item.googleEventId);
      return completeItem(item.id);
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData(key);
      queryClient.setQueryData(
        key,
        (old) => old?.map(
          (i) => i.id === item.id ? { ...i, completed: true, completedAt: /* @__PURE__ */ new Date() } : i
        )
      );
      return { prev };
    },
    onSuccess: () => {
      toast.success("Marked as done");
    },
    onError: (_err, _item, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
      toast.error("Failed to complete item");
    },
    onSettled: () => {
      void invalidate();
    }
  });
  const remove = useMutation({
    mutationFn: async (item) => {
      await tryDeleteEvent(item.googleEventId);
      return deleteItem(item.id);
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData(key);
      queryClient.setQueryData(
        key,
        (old) => old?.filter((i) => i.id !== item.id)
      );
      return { prev };
    },
    onError: (_err, _item, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
      toast.error("Failed to delete item");
    },
    onSettled: () => {
      void invalidate();
    }
  });
  const reAdd = useMutation({
    mutationFn: (original) => reAddItem(original),
    onMutate: async (original) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData(key);
      queryClient.setQueryData(
        key,
        (old) => old?.map(
          (i) => i.id === original.id ? { ...i, completed: false, completedAt: void 0 } : i
        )
      );
      return { prev };
    },
    onSuccess: () => {
      toast.success("Item re-added");
    },
    onError: (_err, _item, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
      toast.error("Failed to re-add item");
    },
    onSettled: () => {
      void invalidate();
    }
  });
  const move = useMutation({
    mutationFn: ({ id, newSpaceId }) => moveItem(id, newSpaceId),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData(key);
      queryClient.setQueryData(
        key,
        (old) => old?.filter((i) => i.id !== id) ?? []
      );
      return { prev };
    },
    onSuccess: (_data, { newSpaceId }) => {
      void queryClient.invalidateQueries({ queryKey: ["items", newSpaceId] });
      toast.success("Item moved");
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
      toast.error("Failed to move item");
    },
    onSettled: () => void invalidate()
  });
  return { create, update, complete, remove, reAdd, move };
}
function ItemCard({ item, spaceColor, spaceName, spaceType, familyId }) {
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const { complete, update, remove, reAdd, move } = useItemMutations(item.spaceId);
  const hue = extractHue(spaceColor);
  const isDark = useIsDark();
  const dateStatus = spaceType === "person" && item.startDate && !item.completed ? getDateStatus(item.startDate) : null;
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition
  } = useSortable({
    id: item.id,
    data: { type: "item", item, spaceColor }
  });
  const bgColor = isDark ? `oklch(0.26 0.08 ${hue})` : spaceColor;
  const borderColor = isDark ? `oklch(0.34 0.10 ${hue})` : `oklch(0.78 0.13 ${hue})`;
  const checkboxBorder = isDark ? `oklch(0.55 0.12 ${hue})` : `oklch(0.60 0.14 ${hue})`;
  const checkboxCheckedBg = isDark ? `oklch(0.22 0.12 ${hue})` : `oklch(0.48 0.20 ${hue})`;
  function handleCheck(checked) {
    if (checked === true) {
      complete.mutate(item);
    } else if (checked === false) {
      reAdd.mutate(item);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: setNodeRef,
        className: cn(
          "group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 shadow-sm transition hover:shadow-md",
          isDragging && "opacity-40"
        ),
        style: {
          background: bgColor,
          borderColor: dateStatus === "overdue" ? "oklch(0.55 0.20 25)" : dateStatus === "today" ? "oklch(0.65 0.16 75)" : borderColor,
          transform: CSS.Transform.toString(transform),
          transition
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "cursor-grab touch-none text-muted-foreground/30 hover:text-muted-foreground/70 active:cursor-grabbing",
              ...attributes,
              ...listeners,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex",
              style: {
                "--input": checkboxBorder,
                "--primary": checkboxCheckedBg,
                "--primary-foreground": "oklch(1 0 0)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: item.completed,
                  onCheckedChange: handleCheck,
                  disabled: complete.isPending || reAdd.isPending,
                  className: "size-5 shrink-0 cursor-pointer rounded-full border-0 bg-white shadow-sm transition-all hover:shadow-[0_0_8px_2px_color-mix(in_oklch,var(--primary)_40%,transparent)] dark:bg-white/90",
                  onClick: (e) => e.stopPropagation()
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "min-w-0 flex-1 cursor-pointer text-left",
              onClick: () => setEditOpen(true),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "line-clamp-2 text-sm font-medium leading-snug text-foreground", children: [
                  item.title,
                  item.quantity && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-xs font-normal text-foreground/60", children: [
                    "× ",
                    item.quantity
                  ] })
                ] }),
                item.startDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 flex items-center gap-1.5 text-xs text-foreground/60", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    formatDate(item.startDate),
                    hasExplicitTime(item.startDate) && ` ${formatTime(item.startDate)}`,
                    item.endDate && ` – ${formatDate(item.endDate)}${hasExplicitTime(item.endDate) ? ` ${formatTime(item.endDate)}` : ""}`
                  ] }),
                  dateStatus === "overdue" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-red-600 dark:text-red-400", children: "Overdue" }),
                  dateStatus === "today" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-amber-600 dark:text-amber-400", children: "Today" }),
                  dateStatus === "soon" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-yellow-500/15 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-yellow-600 dark:text-yellow-400", children: "Soon" })
                ] }),
                item.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-1 text-xs text-foreground/60", children: item.description })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddItemSheet,
      {
        open: editOpen,
        onOpenChange: setEditOpen,
        spaceId: item.spaceId,
        spaceName,
        spaceType,
        familyId,
        editItem: item,
        onCreate: () => {
        },
        onUpdate: (input) => {
          update.mutate(input, { onSuccess: () => setEditOpen(false) });
        },
        onComplete: (it) => complete.mutate(it, { onSuccess: () => setEditOpen(false) }),
        onDelete: (it) => remove.mutate(it, { onSuccess: () => setEditOpen(false) }),
        onMove: (newSpaceId) => {
          move.mutate(
            { id: item.id, newSpaceId },
            { onSuccess: () => setEditOpen(false) }
          );
        },
        isPending: update.isPending || complete.isPending || remove.isPending || move.isPending
      }
    )
  ] });
}
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function HistorySheet({
  open,
  onOpenChange,
  spaceId,
  spaceName
}) {
  const { data: items, isLoading } = useItems(spaceId);
  const { reAdd, remove } = useItemMutations(spaceId);
  const [confirmDeleteId, setConfirmDeleteId] = reactExports.useState(null);
  const seen = /* @__PURE__ */ new Set();
  const completed = (items ?? []).filter((i) => i.completed).sort(
    (a2, b) => (b.completedAt?.getTime() ?? 0) - (a2.completedAt?.getTime() ?? 0)
  ).filter((i) => {
    const key = i.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  function handleReAdd(item) {
    reAdd.mutate(item);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "flex max-w-sm flex-col gap-0 p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "border-b border-border p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { children: [
      spaceName,
      " — History"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col p-4", children: isLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20" })
    ] }, i)) : completed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-12 text-center text-sm text-muted-foreground", children: "No completed items yet" }) : completed.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 border-b border-border py-3 last:border-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm line-through text-muted-foreground", children: item.title }),
            item.completedAt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: formatDateFull(item.completedAt) })
          ] }),
          confirmDeleteId === item.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Delete?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "destructive",
                className: "h-7 px-2 text-xs",
                onClick: () => {
                  remove.mutate(item, {
                    onSettled: () => setConfirmDeleteId(null)
                  });
                },
                disabled: remove.isPending,
                children: "Yes"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-7 w-7 p-0",
                onClick: () => setConfirmDeleteId(null),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "shrink-0",
                onClick: () => handleReAdd(item),
                disabled: reAdd.isPending,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "mr-1.5 h-3 w-3" }),
                  "Re-add"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-8 w-8 p-0 text-muted-foreground/50 hover:text-destructive",
                onClick: () => setConfirmDeleteId(item.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ]
      },
      item.id
    )) }) })
  ] }) });
}
const schema = object({
  name: string().min(1, "Name is required").max(40)
});
function AddSpaceSheet({
  open,
  onOpenChange,
  editSpace,
  onCreate,
  onUpdate,
  isPending
}) {
  const isEditing = !!editSpace;
  const [type, setType] = reactExports.useState(editSpace?.type ?? "store");
  const [color, setColor] = reactExports.useState(editSpace?.color ?? SPACE_COLORS[0]);
  const { register, handleSubmit, reset, formState } = useForm({
    resolver: a(schema),
    defaultValues: { name: editSpace?.name ?? "" }
  });
  reactExports.useEffect(() => {
    if (open) {
      reset({ name: editSpace?.name ?? "" });
      setType(editSpace?.type ?? "store");
      setColor(editSpace?.color ?? SPACE_COLORS[0]);
    }
  }, [open, editSpace, reset]);
  function onSubmit(data) {
    if (isEditing && editSpace && onUpdate) {
      onUpdate({ id: editSpace.id, name: data.name, color, type });
    } else {
      onCreate({ name: data.name, color, type });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "flex max-w-sm flex-col gap-0 p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "border-b border-border p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: isEditing ? "Edit Space" : "New Space" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit(onSubmit),
        className: "flex flex-1 flex-col gap-6 overflow-y-auto p-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "space-name", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "space-name",
                placeholder: "e.g. Costco, Alex…",
                autoFocus: true,
                ...register("name")
              }
            ),
            formState.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formState.errors.name.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setType("store"),
                  className: cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
                    type === "store" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }),
                    "Store"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setType("person"),
                  className: cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
                    type === "person" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
                    "Person"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: SPACE_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setColor(c),
                className: cn(
                  "h-8 w-8 rounded-full border-2 transition",
                  color === c ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                ),
                style: { background: c },
                "aria-label": `Color ${c}`
              },
              c
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-1.5 w-full rounded-full",
              style: { background: color }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1",
                onClick: () => onOpenChange(false),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "flex-1", disabled: isPending, children: [
              isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
              isEditing ? "Save" : "Create"
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
function useSpaceMutations(familyId) {
  const queryClient = useQueryClient();
  const key = ["spaces", familyId];
  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });
  const create = useMutation({
    mutationFn: (input) => createSpace({ familyId, ...input }),
    onSuccess: () => {
      void invalidate();
      toast.success("Space created");
    },
    onError: () => {
      toast.error("Failed to create space");
    }
  });
  const update = useMutation({
    mutationFn: ({
      id,
      ...input
    }) => updateSpace(id, input),
    onSuccess: () => {
      void invalidate();
      toast.success("Space updated");
    },
    onError: () => {
      toast.error("Failed to update space");
    }
  });
  const remove = useMutation({
    mutationFn: (id) => deleteSpace(id),
    onSuccess: () => {
      void invalidate();
      toast.success("Space deleted");
    },
    onError: () => {
      toast.error("Failed to delete space");
    }
  });
  const reorder = useMutation({
    mutationFn: (orderedIds) => reorderSpaces(orderedIds),
    onSuccess: () => {
      void invalidate();
    },
    onError: () => {
      toast.error("Failed to reorder spaces");
    }
  });
  return { create, update, remove, reorder };
}
function SpaceColumn({ space, familyId, isDropTarget }) {
  const [addItemOpen, setAddItemOpen] = reactExports.useState(false);
  const [historyOpen, setHistoryOpen] = reactExports.useState(false);
  const [editSpaceOpen, setEditSpaceOpen] = reactExports.useState(false);
  const { data: items, isLoading } = useItems(space.id);
  const { create: createItem2 } = useItemMutations(space.id);
  const { update: updateSpace2, remove: removeSpace } = useSpaceMutations(familyId);
  const today = /* @__PURE__ */ new Date();
  const activeItems = (items ?? []).filter(
    (i) => !i.completed || i.completedAt && i.completedAt.getFullYear() === today.getFullYear() && i.completedAt.getMonth() === today.getMonth() && i.completedAt.getDate() === today.getDate()
  );
  const completedCount = (items ?? []).filter((i) => i.completed).length;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: space.id, data: { type: "space" } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: setNodeRef,
        style: {
          ...style,
          borderTop: `3px solid ${space.color}`,
          ...isDropTarget && {
            boxShadow: `0 0 0 2px ${space.color}`
          }
        },
        className: cn(
          "flex w-full flex-col rounded-xl bg-card shadow-sm transition-shadow sm:h-full sm:w-72 sm:shrink-0",
          isDropTarget && "bg-card/80"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 pt-3 pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing",
                ...attributes,
                ...listeners,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "h-2.5 w-2.5 shrink-0 rounded-full",
                style: { background: space.color }
              }
            ),
            space.type === "person" ? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate text-sm font-semibold", children: space.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setEditSpaceOpen(true), children: "Edit space" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DropdownMenuItem,
                  {
                    className: "text-destructive focus:text-destructive",
                    onClick: () => removeSpace.mutate(space.id),
                    children: "Delete space"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setHistoryOpen(true),
              className: "mx-3 mb-2 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground/70 transition hover:bg-muted hover:text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-3 w-3" }),
                "History",
                completedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px]", children: completedCount })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-3 max-sm:flex-none max-sm:overflow-visible", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 pb-2", children: isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }, i)) : activeItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-xs text-muted-foreground", children: "Nothing here yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            SortableContext,
            {
              items: activeItems.map((i) => i.id),
              strategy: verticalListSortingStrategy,
              children: activeItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ItemCard,
                {
                  item,
                  spaceColor: space.color,
                  spaceName: space.name,
                  spaceType: space.type,
                  familyId
                },
                item.id
              ))
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              className: "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
              onClick: () => setAddItemOpen(true),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                "Add item"
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddItemSheet,
      {
        open: addItemOpen,
        onOpenChange: setAddItemOpen,
        spaceId: space.id,
        spaceName: space.name,
        spaceType: space.type,
        onCreate: (input) => {
          createItem2.mutate(input);
        },
        isPending: createItem2.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HistorySheet,
      {
        open: historyOpen,
        onOpenChange: setHistoryOpen,
        spaceId: space.id,
        spaceName: space.name
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddSpaceSheet,
      {
        open: editSpaceOpen,
        onOpenChange: setEditSpaceOpen,
        editSpace: space,
        onCreate: () => {
        },
        onUpdate: (input) => updateSpace2.mutate(input, {
          onSuccess: () => setEditSpaceOpen(false)
        }),
        isPending: updateSpace2.isPending
      }
    )
  ] });
}
function useSpaces(familyId) {
  return useQuery({
    queryKey: ["spaces", familyId],
    queryFn: () => fetchSpaces(familyId),
    staleTime: 1e3 * 60 * 5
  });
}
function SpaceView({ familyId, providerToken, calendarId }) {
  const [addSpaceOpen, setAddSpaceOpen] = reactExports.useState(false);
  const [activeDragItem, setActiveDragItem] = reactExports.useState(
    null
  );
  const [overSpaceId, setOverSpaceId] = reactExports.useState(null);
  const { data: spaces, isLoading } = useSpaces(familyId);
  const { create, reorder } = useSpaceMutations(familyId);
  const queryClient = useQueryClient();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );
  const moveItemMutation = useMutation({
    mutationFn: ({
      item,
      newSpaceId
    }) => moveItem(item.id, newSpaceId),
    onError: (_err, { item, newSpaceId }) => {
      queryClient.setQueryData(
        ["items", newSpaceId],
        (old) => old?.filter((i) => i.id !== item.id) ?? []
      );
      queryClient.setQueryData(
        ["items", item.spaceId],
        (old) => [item, ...old ?? []]
      );
      toast.error("Failed to move item");
    },
    onSettled: (_data, _err, { item, newSpaceId }) => {
      void queryClient.invalidateQueries({ queryKey: ["items", item.spaceId] });
      void queryClient.invalidateQueries({ queryKey: ["items", newSpaceId] });
    }
  });
  const reorderItemsMutation = useMutation({
    mutationFn: ({
      spaceId,
      orderedIds
    }) => reorderItems(spaceId, orderedIds),
    onError: (_err, { spaceId }) => {
      void queryClient.invalidateQueries({ queryKey: ["items", spaceId] });
      toast.error("Failed to reorder items");
    }
  });
  function handleDragStart(event) {
    if (event.active.data.current?.type === "item") {
      setActiveDragItem({
        item: event.active.data.current.item,
        spaceColor: event.active.data.current.spaceColor
      });
    }
  }
  function handleDragOver(event) {
    if (event.active.data.current?.type === "item") {
      const overType = event.over?.data.current?.type;
      if (overType === "space") {
        setOverSpaceId(event.over.id);
      } else if (overType === "item") {
        setOverSpaceId(
          event.over?.data.current?.item?.spaceId ?? null
        );
      } else {
        setOverSpaceId(null);
      }
    }
  }
  function handleDragEnd(event) {
    setActiveDragItem(null);
    setOverSpaceId(null);
    const { active, over } = event;
    if (!over) return;
    const activeType = active.data.current?.type;
    if (activeType === "space") {
      if (active.id === over.id || !spaces) return;
      const oldIndex = spaces.findIndex((s) => s.id === active.id);
      const newIndex = spaces.findIndex((s) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(spaces, oldIndex, newIndex);
      queryClient.setQueryData(["spaces", familyId], reordered);
      reorder.mutate(reordered.map((s) => s.id));
    } else if (activeType === "item") {
      const draggedItem = active.data.current?.item;
      const overType = over.data.current?.type;
      let targetSpaceId;
      if (overType === "space") {
        targetSpaceId = over.id;
      } else if (overType === "item") {
        targetSpaceId = (over.data.current?.item).spaceId;
      } else {
        return;
      }
      const sourceSpace = spaces?.find((s) => s.id === draggedItem.spaceId);
      const targetSpace = spaces?.find((s) => s.id === targetSpaceId);
      if (!sourceSpace || !targetSpace) return;
      if (draggedItem.spaceId === targetSpaceId && overType === "item") {
        const overItem = over.data.current?.item;
        const allItems = queryClient.getQueryData(["items", draggedItem.spaceId]) ?? [];
        const oldIdx = allItems.findIndex((i) => i.id === draggedItem.id);
        const newIdx = allItems.findIndex((i) => i.id === overItem.id);
        if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return;
        const reordered = arrayMove(allItems, oldIdx, newIdx);
        queryClient.setQueryData(["items", draggedItem.spaceId], reordered);
        reorderItemsMutation.mutate({
          spaceId: draggedItem.spaceId,
          orderedIds: reordered.map((i) => i.id)
        });
      } else if (draggedItem.spaceId !== targetSpaceId) {
        if (sourceSpace.type !== targetSpace.type) return;
        queryClient.setQueryData(
          ["items", draggedItem.spaceId],
          (old) => old?.filter((i) => i.id !== draggedItem.id) ?? []
        );
        queryClient.setQueryData(
          ["items", targetSpaceId],
          (old) => [{ ...draggedItem, spaceId: targetSpaceId }, ...old ?? []]
        );
        moveItemMutation.mutate({ item: draggedItem, newSpaceId: targetSpaceId });
      }
    }
  }
  function handleDragCancel() {
    setActiveDragItem(null);
    setOverSpaceId(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    BoardProvider,
    {
      familyId,
      providerToken,
      calendarId,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DndContext,
          {
            sensors,
            collisionDetection: closestCenter,
            onDragStart: handleDragStart,
            onDragOver: handleDragOver,
            onDragEnd: handleDragEnd,
            onDragCancel: handleDragCancel,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col gap-4 overflow-y-auto p-4 pb-6 sm:flex-row sm:overflow-x-auto sm:overflow-y-hidden", children: [
                isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex h-48 w-full flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:h-full sm:w-72 sm:shrink-0",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-1 w-full rounded-t-xl" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" })
                    ]
                  },
                  i
                )) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SortableContext,
                  {
                    items: (spaces ?? []).map((s) => s.id),
                    strategy: horizontalListSortingStrategy,
                    children: (spaces ?? []).map((space) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SpaceColumn,
                      {
                        space,
                        familyId,
                        isDropTarget: activeDragItem !== null && overSpaceId === space.id && spaces?.find(
                          (s) => s.id === activeDragItem.item.spaceId
                        )?.type === space.type
                      },
                      space.id
                    ))
                  }
                ),
                !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-start pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: "gap-2 whitespace-nowrap",
                    onClick: () => setAddSpaceOpen(true),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                      "Add Space"
                    ]
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DragOverlay, { children: activeDragItem ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                ItemDragOverlay,
                {
                  item: activeDragItem.item,
                  spaceColor: activeDragItem.spaceColor
                }
              ) : null })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddSpaceSheet,
          {
            open: addSpaceOpen,
            onOpenChange: setAddSpaceOpen,
            onCreate: (input) => {
              create.mutate(input, { onSuccess: () => setAddSpaceOpen(false) });
            },
            isPending: create.isPending
          }
        )
      ] })
    }
  );
}
function ItemDragOverlay({
  item,
  spaceColor
}) {
  const hue = extractHue(spaceColor);
  const isDark = useIsDark();
  const bgColor = isDark ? `oklch(0.26 0.08 ${hue})` : spaceColor;
  const borderColor = isDark ? `oklch(0.34 0.10 ${hue})` : `oklch(0.78 0.13 ${hue})`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex w-72 items-start gap-3 rounded-lg border px-3 py-2.5 shadow-xl rotate-1 cursor-grabbing",
      style: { background: bgColor, borderColor },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium leading-snug text-foreground", children: [
        item.title,
        item.quantity && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-xs font-normal text-foreground/60", children: [
          "× ",
          item.quantity
        ] })
      ] })
    }
  );
}
function CalendarView({ embedUrl }) {
  if (!embedUrl) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-3 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-10 w-10 text-muted-foreground/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No calendar linked yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Add a Calendar Embed URL in Settings to view your calendar here." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "iframe",
    {
      src: embedUrl,
      className: "h-full w-full border-0",
      title: "Google Calendar"
    }
  );
}
const GOOGLE_SVG = /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "h-5 w-5 shrink-0", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
      fill: "#4285F4"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
      fill: "#34A853"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z",
      fill: "#FBBC05"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
      fill: "#EA4335"
    }
  )
] });
function Placeholder({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex aspect-video w-full items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: label })
  ] }) });
}
const FEATURES = [
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-5 w-5" }),
    title: "A space for everyone",
    body: "Create a column for each family member and each store you shop at. Every task, errand, and appointment lives exactly where it belongs — and you see it all at once.",
    placeholder: "Board view screenshot"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-5 w-5" }),
    title: "Your calendar, automatically updated",
    body: "Add a date (or a time) to any task and it syncs to your shared Google Calendar — no copy-pasting, no double entry. Everyone stays in the loop without extra effort.",
    placeholder: "Calendar sync screenshot"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }),
    title: "History that works for you",
    body: "Bought olive oil last month? Re-add it in one tap. Family Space remembers what you've added to each space so your routine never starts from scratch.",
    placeholder: "History feature screenshot"
  }
];
function LoginPage() {
  const { signInWithGoogle } = useAuthContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto flex max-w-2xl flex-col items-center px-6 pb-20 pt-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-6 inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground", children: "Free for families" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-bold tracking-tight sm:text-5xl", children: [
        "One place for everything",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "your family shares." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-lg text-base leading-relaxed text-muted-foreground", children: "Family Space is a shared board for tasks, groceries, and appointments — organised by person and store, and synced to Google Calendar." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "lg",
          onClick: signInWithGoogle,
          className: "mt-8 gap-3 px-7 py-6 text-base",
          children: [
            GOOGLE_SVG,
            "Sign in with Google"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "No account needed beyond your Google login." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl space-y-24 px-6 pb-28", children: FEATURES.map((f, i) => {
      const textFirst = i % 2 === 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "grid items-center gap-10 md:grid-cols-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: textFirst ? "md:order-1" : "md:order-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 inline-flex items-center justify-center rounded-xl border border-border bg-muted/60 p-3 text-foreground", children: f.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight", children: f.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 leading-relaxed text-muted-foreground", children: f.body })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: textFirst ? "md:order-2" : "md:order-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Placeholder, { label: f.placeholder }) })
          ]
        },
        f.title
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Ready to get organised?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Set up takes less than a minute. Your family will thank you." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "lg",
          onClick: signInWithGoogle,
          className: "mt-8 gap-3 px-7 py-6 text-base",
          children: [
            GOOGLE_SVG,
            "Sign in with Google"
          ]
        }
      )
    ] }) })
  ] });
}
function BoardPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, {});
}
function AuthGate() {
  const {
    user,
    loading
  } = useAuthContext();
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(BoardSkeleton, {});
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FamilyBoard, { userId: user.id });
}
function FamilyBoard({
  userId
}) {
  const {
    providerToken
  } = useAuthContext();
  const {
    data: family,
    isLoading
  } = useUserFamily(userId);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(BoardSkeleton, {});
  if (!family) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FamilyContent, { familyId: family.id, providerToken, calendarId: family.googleCalendarId ?? null, embedUrl: family.googleCalendarEmbedUrl });
}
function FamilyContent({
  familyId,
  providerToken,
  calendarId,
  embedUrl
}) {
  const [tab, setTab] = reactExports.useState(() => {
    try {
      const stored = window.localStorage.getItem("fs-tab");
      if (stored === "calendar") return "calendar";
    } catch {
    }
    return "board";
  });
  function handleTabChange(newTab) {
    setTab(newTab);
    try {
      window.localStorage.setItem("fs-tab", newTab);
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden shrink-0 flex-col border-r border-border/40 py-3 sm:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, { active: tab === "board", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-4 w-4" }), onClick: () => handleTabChange("board"), children: "Spaces" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, { active: tab === "calendar", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4" }), onClick: () => handleTabChange("calendar"), children: "Calendar" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("min-h-0 flex-1", tab !== "board" && "hidden"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SpaceView, { familyId, providerToken, calendarId }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("min-h-0 flex-1", tab !== "calendar" && "hidden"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarView, { embedUrl }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 border-t border-border/40 bg-background/90 backdrop-blur-sm sm:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MobileTabButton, { active: tab === "board", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-5 w-5" }), onClick: () => handleTabChange("board"), children: "Spaces" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MobileTabButton, { active: tab === "calendar", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-5 w-5" }), onClick: () => handleTabChange("calendar"), children: "Calendar" })
      ] })
    ] })
  ] });
}
function TabButton({
  active,
  icon,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: cn("relative flex flex-col items-center gap-1.5 px-3 py-3 text-[10px] font-medium tracking-wide transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground"), children: [
    active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-foreground" }),
    icon,
    children
  ] });
}
function MobileTabButton({
  active,
  icon,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: cn("flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide transition-colors", active ? "text-foreground" : "text-muted-foreground"), children: [
    icon,
    children
  ] });
}
function BoardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full gap-4 p-4", children: Array.from({
    length: 3
  }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full w-72 shrink-0 flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" })
  ] }, i)) });
}
export {
  BoardPage as component
};
