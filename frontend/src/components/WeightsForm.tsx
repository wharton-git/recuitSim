import type { Weights } from '../types'

type WeightsFormProps = {
  weights: Weights
  onChange: (weights: Weights) => void
}

const labels: Record<keyof Weights, string> = {
  performance: 'Performance',
  battery: 'Batterie',
  temperature: 'Temperature',
  noise: 'Bruit',
  energy: 'Energie',
}

export function normalizeWeights(weights: Weights): Weights {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0)
  if (total <= 0) {
    return { performance: 0.3, battery: 0.3, temperature: 0.2, noise: 0.1, energy: 0.1 }
  }
  return {
    performance: weights.performance / total,
    battery: weights.battery / total,
    temperature: weights.temperature / total,
    noise: weights.noise / total,
    energy: weights.energy / total,
  }
}

export function WeightsForm({ weights, onChange }: WeightsFormProps) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0)
  const normalized = normalizeWeights(weights)

  function updateWeight(key: keyof Weights, value: number) {
    onChange({ ...weights, [key]: value })
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-normal text-slate-950">Ponderation ADMC</h2>
          <p className="mt-1 text-sm text-slate-500">Les poids sont normalises automatiquement avant l'envoi.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Somme {total.toFixed(2)}</div>
      </div>

      <div className="mt-5 space-y-5">
        {(Object.keys(weights) as Array<keyof Weights>).map((key) => (
          <div key={key}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <label htmlFor={`weight-${key}`} className="font-medium text-slate-700">{labels[key]}</label>
              <span className="tabular-nums text-slate-500">{weights[key].toFixed(2)} / normalise {normalized[key].toFixed(2)}</span>
            </div>
            <input
              id={`weight-${key}`}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={weights[key]}
              onChange={(event) => updateWeight(key, Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-cyan-700"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

