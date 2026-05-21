import { LineChart as LineChartIcon } from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { HistoryEntry } from '../types'

type Props = {
  history: HistoryEntry[]
  showTemperature: boolean
  onToggleTemperature: (enabled: boolean) => void
}

export function HistoryChart({ history, showTemperature, onToggleTemperature }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange-50 text-orange-700">
            <LineChartIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-normal text-slate-950">Historique du recuit</h2>
            <p className="text-sm text-slate-500">Evolution du score pendant les iterations.</p>
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={showTemperature}
            onChange={(event) => onToggleTemperature(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-cyan-700"
          />
          Temperature
        </label>
      </div>

      <div className="mt-5 h-80">
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 12, right: 16, bottom: 12, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="iteration" stroke="#64748b" />
              <YAxis yAxisId="score" domain={[0, 1]} stroke="#64748b" />
              {showTemperature && <YAxis yAxisId="temperature" orientation="right" stroke="#f97316" />}
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
              <Legend />
              <Line yAxisId="score" type="monotone" dataKey="best_score" name="Meilleur score" stroke="#0891b2" strokeWidth={3} dot={false} />
              <Line yAxisId="score" type="monotone" dataKey="current_score" name="Score courant" stroke="#64748b" strokeWidth={2} dot={false} />
              {showTemperature && (
                <Line yAxisId="temperature" type="monotone" dataKey="temperature" name="Temperature du recuit" stroke="#f97316" strokeWidth={2} dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-full place-items-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500">
            L'historique apparaitra apres une optimisation.
          </div>
        )}
      </div>
    </section>
  )
}

