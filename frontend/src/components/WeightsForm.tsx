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

const presets: Array<{ id: string; label: string; description: string; weights: Weights }> = [
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Compromis general',
    weights: { performance: 0.25, battery: 0.25, temperature: 0.2, noise: 0.15, energy: 0.15 },
  },
  {
    id: 'eco',
    label: 'Eco',
    description: 'Autonomie et energie',
    weights: { performance: 0.1, battery: 0.45, temperature: 0.15, noise: 0.1, energy: 0.2 },
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'Puissance prioritaire',
    weights: { performance: 0.55, battery: 0.1, temperature: 0.15, noise: 0.05, energy: 0.15 },
  },
  {
    id: 'silent',
    label: 'Silent',
    description: 'Bruit minimal',
    weights: { performance: 0.12, battery: 0.18, temperature: 0.2, noise: 0.4, energy: 0.1 },
  },
  {
    id: 'cool',
    label: 'Cool',
    description: 'Temperature basse',
    weights: { performance: 0.12, battery: 0.15, temperature: 0.45, noise: 0.13, energy: 0.15 },
  },
]

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
  const activePreset = presets.find((preset) => areWeightsClose(normalized, normalizeWeights(preset.weights)))?.id

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

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-700">Configurations prefaites</p>
          <p className="text-xs text-slate-500">Cliquer puis ajuster si besoin</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {presets.map((preset) => {
            const isActive = activePreset === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange(preset.weights)}
                className={`rounded-lg border p-3 text-left transition ${
                  isActive
                    ? 'border-cyan-600 bg-cyan-50 text-cyan-950 ring-2 ring-cyan-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-slate-50'
                }`}
              >
                <span className="block text-sm font-semibold">{preset.label}</span>
                <span className="mt-1 block text-xs text-slate-500">{preset.description}</span>
              </button>
            )
          })}
        </div>
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

function areWeightsClose(left: Weights, right: Weights) {
  return (Object.keys(left) as Array<keyof Weights>).every((key) => Math.abs(left[key] - right[key]) < 0.005)
}
