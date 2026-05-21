import type { AnnealingSettings as AnnealingSettingsType } from '../types'

type Props = {
  settings: AnnealingSettingsType
  onChange: (settings: AnnealingSettingsType) => void
}

const fields = [
  { key: 'initial_temperature', label: 'Temperature initiale', min: 1, max: 500, step: 1 },
  { key: 'cooling_rate', label: 'Taux de refroidissement', min: 0.1, max: 0.99, step: 0.01 },
  { key: 'min_temperature', label: 'Temperature minimale', min: 0.01, max: 10, step: 0.01 },
  { key: 'max_iterations', label: 'Iterations max', min: 1, max: 5000, step: 1 },
] as const

export function AnnealingSettings({ settings, onChange }: Props) {
  function update(key: keyof AnnealingSettingsType, value: number) {
    onChange({ ...settings, [key]: key === 'max_iterations' ? Math.round(value) : value })
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold tracking-normal text-slate-950">Parametres du recuit</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="block">
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={settings[field.key]}
              onChange={(event) => update(field.key, Number(event.target.value))}
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
            />
          </label>
        ))}
      </div>
    </section>
  )
}

