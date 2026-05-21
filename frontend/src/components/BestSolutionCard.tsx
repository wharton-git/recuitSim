import { Laptop, SlidersHorizontal } from 'lucide-react'
import type { Solution } from '../types'

type Props = {
  solution?: Solution | null
}

export function BestSolutionCard({ solution }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-white">
          <Laptop className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-normal text-slate-950">Meilleure configuration</h2>
          <p className="text-sm text-slate-500">Reglages retenus par le score multicritere.</p>
        </div>
      </div>

      {solution ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Item label="Luminosite" value={`${solution.brightness}%`} />
          <Item label="Frequence CPU" value={`${solution.cpu_frequency} GHz`} />
          <Item label="Ventilation" value={solution.fan_mode} />
          <Item label="Mode systeme" value={solution.power_mode} />
          <Item label="Score" value={solution.score.toFixed(4)} />
          <Item label="Profil detecte" value={solution.profile_label} />
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          <SlidersHorizontal className="h-5 w-5" />
          Aucun resultat pour le moment.
        </div>
      )}
    </section>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-950">{value}</p>
    </div>
  )
}

