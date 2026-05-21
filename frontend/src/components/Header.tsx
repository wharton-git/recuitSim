import { Cpu, Gauge } from 'lucide-react'

type HeaderProps = {
  apiStatus: 'checking' | 'online' | 'offline'
}

export function Header({ apiStatus }: HeaderProps) {
  const statusLabel = apiStatus === 'online' ? 'API connectee' : apiStatus === 'offline' ? 'Mode demonstration' : 'Connexion API'
  const statusClass = apiStatus === 'online' ? 'bg-emerald-100 text-emerald-700' : apiStatus === 'offline' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'

  return (
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-white shadow-soft">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">SmartPower ADMC</h1>
            <p className="mt-1 text-sm text-slate-600">Optimisation multicritere par recuit simule</p>
          </div>
        </div>
        <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${statusClass}`}>
          <Gauge className="h-4 w-4" />
          {statusLabel}
        </div>
      </div>
    </header>
  )
}

