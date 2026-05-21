import { Activity, Info } from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import type { AxisKey, Solution } from '../types'

type AxisView = {
  id: string
  label: string
  x: AxisKey
  y: AxisKey
}

const views: AxisView[] = [
  { id: 'performance-battery', label: 'Performance vs Batterie', x: 'performance', y: 'battery' },
  { id: 'performance-temperature', label: 'Performance vs Temperature', x: 'performance', y: 'temperature' },
  { id: 'battery-energy', label: 'Batterie vs Energie', x: 'battery', y: 'energy' },
  { id: 'temperature-noise', label: 'Temperature vs Bruit', x: 'temperature', y: 'noise' },
]

const labels: Record<AxisKey, string> = {
  performance: 'Performance',
  battery: 'Batterie',
  temperature: 'Temperature',
  noise: 'Bruit',
  energy: 'Energie',
}

const units: Record<AxisKey, string> = {
  performance: '%',
  battery: '%',
  temperature: ' C',
  noise: '',
  energy: '%',
}

type Props = {
  solutions: Solution[]
  best?: Solution | null
  selectedView: string
  onViewChange: (view: string) => void
}

export function ParetoChart({ solutions, best, selectedView, onViewChange }: Props) {
  const activeView = views.find((view) => view.id === selectedView) ?? views[0]
  const bestKey = best ? `${best.brightness}-${best.cpu_frequency}-${best.fan_mode}-${best.power_mode}` : ''

  const points = solutions.map((solution) => {
    const key = `${solution.brightness}-${solution.cpu_frequency}-${solution.fan_mode}-${solution.power_mode}`
    return {
      key,
      x: solution.metrics[activeView.x],
      y: solution.metrics[activeView.y],
      score: solution.score,
      profile: solution.profile_label,
    }
  })
  const bestPoint = points.filter((point) => point.key === bestKey)
  const regularPoints = points.filter((point) => point.key !== bestKey)
  const xLabel = labels[activeView.x]
  const yLabel = labels[activeView.y]

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-normal text-slate-950">Front de Pareto</h2>
            <p className="text-sm text-slate-500">Le backend renvoie uniquement les solutions non dominees.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <select
            value={selectedView}
            onChange={(event) => onViewChange(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
          >
            {views.map((view) => (
              <option key={view.id} value={view.id}>{view.label}</option>
            ))}
          </select>
          <span className="text-xs font-medium text-slate-500">{solutions.length} solutions Pareto</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 font-medium text-cyan-800">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
          Solution non dominee
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-800">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          Meilleure solution
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-sm text-slate-600">
        <div className="flex gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
          <p>
            Les points domines ne sont pas affiches ici. Ce nuage sert a comparer les compromis restants entre {xLabel.toLowerCase()} et {yLabel.toLowerCase()}.
          </p>
        </div>
      </div>

      <div className="mt-5 h-[360px]">
        {solutions.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, bottom: 12, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" dataKey="x" name={xLabel} unit={units[activeView.x]} stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis type="number" dataKey="y" name={yLabel} unit={units[activeView.y]} stroke="#64748b" tick={{ fontSize: 12 }} />
              <ZAxis type="number" dataKey="score" range={[70, 180]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name) => [Number(value).toFixed(2), name]}
                labelFormatter={() => 'Solution Pareto'}
                contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }}
              />
              <Legend />
              <Scatter name="Solutions Pareto" data={regularPoints} fill="#0891b2" fillOpacity={0.78} stroke="#0e7490" strokeWidth={1} />
              <Scatter name="Meilleure solution" data={bestPoint} fill="#f97316" stroke="#9a3412" strokeWidth={2} />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-full place-items-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500">
            Lancez l'optimisation pour afficher le nuage Pareto.
          </div>
        )}
      </div>
    </section>
  )
}
