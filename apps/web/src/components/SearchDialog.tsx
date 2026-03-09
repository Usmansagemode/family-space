import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '#/components/ui/dialog'
import { AddItemSheet } from '#/components/board/AddItemSheet'
import { BoardProvider } from '#/contexts/board'
import { useSearchItems } from '#/hooks/items/useSearchItems'
import { useItemMutations } from '#/hooks/items/useItemMutations'
import type { SearchResult } from '#/hooks/items/useSearchItems'
import type { Item } from '#/entities/Item'
import type { Space } from '#/entities/Space'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  familyId: string
  providerToken: string | null
  calendarId: string | null
}

export function SearchDialog({
  open,
  onOpenChange,
  familyId,
  providerToken,
  calendarId,
}: Props) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selected, setSelected] = useState<SearchResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery('')
      setDebouncedQuery('')
    }
  }, [open])

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onOpenChange])

  const { data: results, isLoading } = useSearchItems(familyId, debouncedQuery)

  // Group results by space
  const grouped: Array<{ space: Space; items: Item[] }> = []
  for (const r of results ?? []) {
    const existing = grouped.find((g) => g.space.id === r.space.id)
    if (existing) {
      existing.items.push(r.item)
    } else {
      grouped.push({ space: r.space, items: [r.item] })
    }
  }

  function handleSelect(result: SearchResult) {
    setSelected(result)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="gap-0 overflow-hidden p-0 sm:max-w-lg"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Search items</DialogTitle>

          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search items…"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
                esc
              </kbd>
            )}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {!debouncedQuery.trim() ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Start typing to search across all spaces
              </p>
            ) : isLoading ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Searching…
              </p>
            ) : grouped.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No results for "{debouncedQuery}"
              </p>
            ) : (
              grouped.map(({ space, items }) => (
                <div key={space.id}>
                  {/* Space header */}
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: space.color }}
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {space.name}
                    </span>
                  </div>
                  {/* Items */}
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-accent"
                      onClick={() => handleSelect({ item, space })}
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: space.color }}
                      />
                      <span className="flex-1 truncate text-sm">
                        {item.title}
                        {item.quantity && (
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            × {item.quantity}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit sheet — opens when a result is selected */}
      {selected && (
        <BoardProvider
          familyId={familyId}
          providerToken={providerToken}
          calendarId={calendarId}
        >
          <SelectedItemSheet
            result={selected}
            familyId={familyId}
            onClose={() => setSelected(null)}
          />
        </BoardProvider>
      )}
    </>
  )
}

function SelectedItemSheet({
  result,
  familyId,
  onClose,
}: {
  result: SearchResult
  familyId: string
  onClose: () => void
}) {
  const { item, space } = result
  const { update, complete, remove, move } = useItemMutations(item.spaceId)
  const [open, setOpen] = useState(true)

  function handleOpenChange(o: boolean) {
    setOpen(o)
    if (!o) onClose()
  }

  return (
    <AddItemSheet
      open={open}
      onOpenChange={handleOpenChange}
      spaceId={space.id}
      spaceName={space.name}
      spaceType={space.type}
      familyId={familyId}
      editItem={item}
      onCreate={() => {}}
      onUpdate={(input) =>
        update.mutate(input, { onSuccess: () => handleOpenChange(false) })
      }
      onComplete={(it) =>
        complete.mutate(it, { onSuccess: () => handleOpenChange(false) })
      }
      onDelete={(it) =>
        remove.mutate(it, { onSuccess: () => handleOpenChange(false) })
      }
      onMove={(newSpaceId) =>
        move.mutate(
          { id: item.id, newSpaceId },
          { onSuccess: () => handleOpenChange(false) },
        )
      }
      isPending={
        update.isPending ||
        complete.isPending ||
        remove.isPending ||
        move.isPending
      }
    />
  )
}
