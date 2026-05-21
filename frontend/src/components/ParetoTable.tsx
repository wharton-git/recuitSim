import type { ReactNode } from 'react'
import type { Solution } from '../types'

type Props = {
  solutions: Solution[]
}

export function ParetoTable({ solutions }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-normal text-slate-950">Tableau des solutions Pareto</h2>
          <p className="mt-1 text-sm text-slate-500">Affichage limite a 10 lignes visibles, puis defilement vertical.</p>
        </div>
        <span className="text-sm font-medium text-slate-500">{solutions.length} solutions</span>
      </div>
      <div className="mt-4 max-h-[520px] overflow-auto rounded-lg border border-slate-200">
        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-white shadow-sm">
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <Th>Profil</Th>
              <Th>Luminosite</Th>
              <Th>CPU</Th>
              <Th>Ventilation</Th>
              <Th>Mode systeme</Th>
              <Th>Performance</Th>
              <Th>Batterie</Th>
              <Th>Temperature</Th>
              <Th>Bruit</Th>
              <Th>Energie</Th>
              <Th>Score</Th>
            </tr>
          </thead>
          <tbody>
            {solutions.length > 0 ? solutions.map((solution, index) => (
              <tr key={`${solution.brightness}-${solution.cpu_frequency}-${solution.fan_mode}-${solution.power_mode}-${index}`} className="border-b border-slate-100 last:border-0">
                <Td className="font-medium capitalize text-slate-950">{solution.profile_label}</Td>
                <Td>{solution.brightness}%</Td>
                <Td>{solution.cpu_frequency} GHz</Td>
                <Td>{solution.fan_mode}</Td>
                <Td>{solution.power_mode}</Td>
                <Td>{solution.metrics.performance.toFixed(0)}</Td>
                <Td>{solution.metrics.battery.toFixed(0)}</Td>
                <Td>{solution.metrics.temperature.toFixed(0)}</Td>
                <Td>{solution.metrics.noise.toFixed(0)}</Td>
                <Td>{solution.metrics.energy.toFixed(0)}</Td>
                <Td className="font-semibold text-cyan-700">{solution.score.toFixed(3)}</Td>
              </tr>
            )) : (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500">Aucune solution Pareto disponible.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Th({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap bg-white px-3 py-3 font-semibold">{children}</th>
}

function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-3 py-3 text-slate-600 ${className}`}>{children}</td>
}
