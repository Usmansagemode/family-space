import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, ShoppingCart, Loader2 } from 'lucide-react'
import { extractHue, cn } from '#/lib/utils'
import { useIsDark } from '#/hooks/useIsDark'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { SPACE_COLORS } from '#/lib/config'
import type { SpaceType, Space } from '#/entities/Space'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(40),
})
type FormData = z.infer<typeof schema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editSpace?: Space
  defaultType?: SpaceType
  onCreate?: (input: { name: string; color: string; type: SpaceType }) => void
  onUpdate?: (input: {
    id: string
    name: string
    color: string
    type: SpaceType
  }) => void
  isPending: boolean
}

export function AddSpaceSheet({
  open,
  onOpenChange,
  editSpace,
  defaultType = 'store',
  onCreate,
  onUpdate,
  isPending,
}: Props) {
  const isEditing = !!editSpace
  const [type, setType] = useState<SpaceType>(editSpace?.type ?? defaultType)
  const [color, setColor] = useState(editSpace?.color ?? SPACE_COLORS[0])
  const isDark = useIsDark()
  const hue = extractHue(color)
  const accentColor = isDark
    ? `oklch(0.62 0.16 ${hue})`
    : `oklch(0.68 0.14 ${hue})`

  const { register, handleSubmit, reset, formState, watch } = useForm<FormData>(
    {
      resolver: zodResolver(schema),
      defaultValues: { name: editSpace?.name ?? '' },
    },
  )
  const nameValue = watch('name')

  useEffect(() => {
    if (open) {
      reset({ name: editSpace?.name ?? '' })
      setType(editSpace?.type ?? defaultType)
      setColor(editSpace?.color ?? SPACE_COLORS[0])
    }
  }, [open, editSpace, reset])

  function onSubmit(data: FormData) {
    if (editSpace && onUpdate) {
      onUpdate({ id: editSpace.id, name: data.name, color, type })
    } else {
      onCreate?.({ name: data.name, color, type })
    }
    // Sheet stays open — parent closes it in mutation's onSuccess
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex max-w-sm flex-col gap-0 p-0">
        <div
          className="h-1 w-full shrink-0 transition-colors"
          style={{ background: accentColor }}
        />
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle>{isEditing ? 'Edit Space' : 'New Space'}</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-6 overflow-y-auto p-6"
        >
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="space-name">Name</Label>
            <Input
              id="space-name"
              placeholder="e.g. Costco, Alex…"
              autoFocus
              {...register('name')}
            />
            {formState.errors.name && (
              <p className="text-xs text-destructive">
                {formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Type toggle */}
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('store')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition',
                  type === 'store'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted',
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                Store
              </button>
              <button
                type="button"
                onClick={() => setType('person')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition',
                  type === 'person'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted',
                )}
              >
                <User className="h-4 w-4" />
                Person
              </button>
            </div>
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-3">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {SPACE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-all',
                    color === c
                      ? 'scale-110 border-foreground/40'
                      : 'border-transparent hover:scale-105',
                  )}
                  style={{ background: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>

            {/* Live card preview */}
            <div
              className="flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors"
              style={{
                background: isDark ? `oklch(0.22 0.07 ${hue})` : color,
                borderColor: isDark
                  ? `oklch(0.30 0.09 ${hue})`
                  : `oklch(0.82 0.09 ${hue})`,
              }}
            >
              <div className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-white" />
              <span className="text-sm font-semibold">
                {nameValue.trim() || 'Space name'}
              </span>
            </div>
          </div>

          <div className="mt-auto flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
