import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Play, RotateCcw } from 'lucide-react'
import { createMockOptimizationResponse, getDefaultConfig, optimizeConfiguration, checkHealth } from './api/client'
import { AnnealingSettings } from './components/AnnealingSettings'
import { BestSolutionCard } from './components/BestSolutionCard'
import { EducationalSection } from './components/EducationalSection'
import { Header } from './components/Header'
import { HistoryChart } from './components/HistoryChart'
import { ParetoChart } from './components/ParetoChart'
import { ParetoTable } from './components/ParetoTable'
import { ProfilesGrid } from './components/ProfilesGrid'
import { SummaryCards } from './components/SummaryCards'
import { WeightsForm, normalizeWeights } from './components/WeightsForm'
import type { AnnealingSettings as AnnealingSettingsType, OptimizationResponse, Weights } from './types'

const defaultWeights: Weights = {
  performance: 0.3,
  battery: 0.3,
  temperature: 0.2,
  noise: 0.1,
  energy: 0.1,
}

const defaultSettings: AnnealingSettingsType = {
  initial_temperature: 100,
  cooling_rate: 0.95,
  min_temperature: 0.1,
  max_iterations: 500,
}

function App() {
  const [weights, setWeights] = useState<Weights>(defaultWeights)
  const [settings, setSettings] = useState<AnnealingSettingsType>(defaultSettings)
  const [result, setResult] = useState<OptimizationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [paretoView, setParetoView] = useState('performance-battery')
  const [showTemperature, setShowTemperature] = useState(true)

  const normalizedWeights = useMemo(() => normalizeWeights(weights), [weights])

  useEffect(() => {
    async function bootstrap() {
      try {
        await checkHealth()
        const defaults = await getDefaultConfig()
        setWeights(defaults.weights)
        setSettings(defaults.settings)
        setApiStatus('online')
      } catch {
        setApiStatus('offline')
        setError("Backend indisponible : l'interface peut afficher des donnees de demonstration.")
      }
    }

    bootstrap()
  }, [])

  async function runOptimization() {
    setLoading(true)
    setError(null)

    try {
      const data = await optimizeConfiguration({
        weights: normalizedWeights,
        settings,
      })
      setResult(data)
      setApiStatus('online')
    } catch {
      setApiStatus('offline')
      setResult(createMockOptimizationResponse())
      setError("Impossible de joindre le backend FastAPI. Des donnees mock sont affichees pour la presentation.")
    } finally {
      setLoading(false)
    }
  }

  function resetDefaults() {
    setWeights(defaultWeights)
    setSettings(defaultSettings)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header apiStatus={apiStatus} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <SummaryCards data={result} loading={loading} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-6">
            <WeightsForm weights={weights} onChange={setWeights} />
            <AnnealingSettings settings={settings} onChange={setSettings} />
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:flex-row">
              <button
                type="button"
                onClick={runOptimization}
                disabled={loading}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Play className="h-4 w-4" />
                {loading ? 'Optimisation en cours...' : "Lancer l'optimisation"}
              </button>
              <button
                type="button"
                onClick={resetDefaults}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reinitialiser
              </button>
            </div>
          </div>

          <BestSolutionCard solution={result?.best_solution} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <ParetoChart
            solutions={result?.pareto_front ?? []}
            best={result?.best_solution}
            selectedView={paretoView}
            onViewChange={setParetoView}
          />
          <HistoryChart
            history={result?.history ?? []}
            showTemperature={showTemperature}
            onToggleTemperature={setShowTemperature}
          />
        </section>

        <ProfilesGrid profiles={result?.recommended_profiles} />
        <ParetoTable solutions={result?.pareto_front ?? []} />
        <EducationalSection />
      </main>
    </div>
  )
}

export default App

