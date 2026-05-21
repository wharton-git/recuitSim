import { BatteryCharging, Cpu, Flame, Gauge, Medal, Thermometer } from 'lucide-react'
import type { OptimizationResponse } from '../types'

type SummaryCardsProps = {
  data?: OptimizationResponse | null
  loading: boolean
}

const emptyValue = 'En attente'

export function SummaryCards({ data, loading }: SummaryCardsProps) {
  const best = data?.best_solution
  const cards = [
    { label: 'Meilleure solution', value: best ? best.profile_label : emptyValue, icon: Medal, detail: best ? `${best.brightness}% / ${best.cpu_frequency} GHz` : 'Lancez une optimisation' },
    { label: 'Score global', value: best ? best.score.toFixed(3) : emptyValue, icon: Gauge, detail: 'Score pondere normalise' },
    { label: 'Autonomie estimee', value: best ? `${best.metrics.battery.toFixed(0)}%` : emptyValue, icon: BatteryCharging, detail: 'Critere a maximiser' },
    { label: 'Temperature', value: best ? `${best.metrics.temperature.toFixed(0)} C` : emptyValue, icon: Thermometer, detail: 'Critere a minimiser' },
    { label: 'Performance', value: best ? `${best.metrics.performance.toFixed(0)}%` : emptyValue, icon: Cpu, detail: 'Critere a maximiser' },
    { label: 'Profil recommande', value: best ? best.profile_label : emptyValue, icon: Flame, detail: data ? `${data.summary.pareto_count} solutions Pareto` : 'Aucun resultat' },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">{loading ? 'Calcul...' : card.value}</p>
              <p className="mt-1 text-sm text-slate-500">{card.detail}</p>
            </div>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

