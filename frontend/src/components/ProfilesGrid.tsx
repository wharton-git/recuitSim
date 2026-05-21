import { Battery, Fan, Gauge, Leaf, Snowflake, Zap } from 'lucide-react'
import type { RecommendedProfiles, Solution } from '../types'

type Props = {
  profiles?: RecommendedProfiles
}

const profileOrder = ['eco', 'balanced', 'performance', 'silent', 'cool']
const iconByProfile = {
  eco: Leaf,
  balanced: Gauge,
  performance: Zap,
  silent: Fan,
  cool: Snowflake,
} as const

export function ProfilesGrid({ profiles }: Props) {
  const entries = profileOrder
    .map((profile) => [profile, profiles?.[profile]] as const)
    .filter((entry): entry is readonly [string, Solution] => Boolean(entry[1]))

  return (
    <section>
      <h2 className="text-lg font-semibold tracking-normal text-slate-950">Profils recommandes</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {entries.length > 0 ? entries.map(([profile, solution]) => {
          const Icon = iconByProfile[profile as keyof typeof iconByProfile] ?? Battery
          return (
            <article key={profile} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold capitalize text-slate-950">{profile}</p>
                  <p className="text-xs text-slate-500">Score {solution.score.toFixed(3)}</p>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <Metric label="Autonomie" value={solution.metrics.battery} />
                <Metric label="Performance" value={solution.metrics.performance} />
                <Metric label="Temperature" value={solution.metrics.temperature} />
                <Metric label="Bruit" value={solution.metrics.noise} />
                <Metric label="Energie" value={solution.metrics.energy} />
              </dl>
            </article>
          )
        }) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500 md:col-span-2 xl:col-span-5">
            Les profils seront remplis par le backend apres optimisation.
          </div>
        )}
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-950">{value.toFixed(0)}</dd>
    </div>
  )
}

