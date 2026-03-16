import { BarChart3, Check, FileDown, Lock, SplitSquareVertical, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'

type PlanConfig = {
  title: string
  description: string
  features: { icon: React.ElementType; label: string }[]
  price: string
  cta: string
}

const PLAN_CONFIG: Record<'plus' | 'pro', PlanConfig> = {
  plus: {
    title: 'Plus',
    price: '$5',
    cta: 'Upgrade to Plus',
    description: 'Unlock yearly analytics and export for your family.',
    features: [
      { icon: BarChart3, label: '9 yearly analytics charts' },
      { icon: FileDown, label: 'Export to CSV & PDF' },
      { icon: SplitSquareVertical, label: 'Unlimited split groups' },
      { icon: Check, label: 'Up to 5 family members' },
    ],
  },
  pro: {
    title: 'Pro',
    price: '$10',
    cta: 'Upgrade to Pro',
    description: 'Let AI read your bank statements and import expenses automatically.',
    features: [
      { icon: Sparkles, label: 'AI PDF bank statement import' },
      { icon: Check, label: 'Unlimited family members' },
      { icon: Check, label: 'Everything in Plus' },
    ],
  },
}

type Props = {
  /** The minimum plan required to access this feature */
  requiredPlan?: 'plus' | 'pro'
  /** What the locked page looks like — rendered blurred behind the prompt */
  preview?: React.ReactNode
}

function DefaultPreview() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-72 rounded-xl" />
      ))}
    </div>
  )
}

export function UpgradePlanPrompt({ requiredPlan = 'plus', preview }: Props) {
  const plansToShow: Array<'plus' | 'pro'> =
    requiredPlan === 'pro' ? ['pro'] : ['plus', 'pro']

  function handleUpgrade(plan: 'plus' | 'pro') {
    toast.info(`${PLAN_CONFIG[plan].title} upgrade coming soon!`)
  }

  return (
    <div className="relative flex flex-col gap-6">
      {/* Blurred preview — visual hint of what's locked */}
      <div className="pointer-events-none select-none blur-sm opacity-40">
        {preview ?? <DefaultPreview />}
      </div>

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-card border shadow-xl rounded-2xl p-8 w-full max-w-2xl mx-4 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-muted rounded-full p-3">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">{PLAN_CONFIG[requiredPlan].title} Feature</h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              {PLAN_CONFIG[requiredPlan].description}
            </p>
          </div>

          {/* Tier cards */}
          <div
            className={`grid gap-4 w-full ${plansToShow.length === 1 ? 'max-w-xs' : 'grid-cols-1 sm:grid-cols-2'}`}
          >
            {plansToShow.map((plan) => {
              const config = PLAN_CONFIG[plan]
              const isPrimary = plan === requiredPlan
              return (
                <div
                  key={plan}
                  className={`border rounded-xl p-5 flex flex-col gap-4 ${isPrimary ? 'bg-primary/5 border-primary/20' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{config.title}</div>
                      <div className="text-muted-foreground text-sm">per family / month</div>
                    </div>
                    <Badge
                      className="text-base px-3 py-1"
                      variant={isPrimary ? 'default' : 'secondary'}
                    >
                      {config.price}
                    </Badge>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {config.features.map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-center gap-2 text-sm">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        {label}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-auto"
                    variant={isPrimary ? 'default' : 'outline'}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {config.cta}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
