export type FanMode = 'silent' | 'normal' | 'performance'
export type PowerMode = 'eco' | 'balanced' | 'performance'

export type Weights = {
  performance: number
  battery: number
  temperature: number
  noise: number
  energy: number
}

export type AnnealingSettings = {
  initial_temperature: number
  cooling_rate: number
  min_temperature: number
  max_iterations: number
}

export type LaptopConfiguration = {
  brightness: number
  cpu_frequency: number
  fan_mode: FanMode
  power_mode: PowerMode
}

export type Metrics = {
  performance: number
  battery: number
  temperature: number
  noise: number
  energy: number
}

export type Solution = LaptopConfiguration & {
  metrics: Metrics
  score: number
  profile_label: string
}

export type OptimizationRequest = {
  weights: Weights
  settings: AnnealingSettings
}

export type HistoryEntry = {
  iteration: number
  temperature: number
  candidate_score: number
  current_score: number
  best_score: number
  accepted: boolean
  acceptance_probability: number
  score_delta: number
}

export type RecommendedProfiles = Record<string, Solution>

export type OptimizationSummary = {
  iterations: number
  accepted_moves: number
  acceptance_rate: number
  candidate_count: number
  pareto_count: number
  best_score: number
  average_score: number
  final_temperature: number
}

export type OptimizationResponse = {
  best_solution: Solution
  pareto_front: Solution[]
  recommended_profiles: RecommendedProfiles
  history: HistoryEntry[]
  summary: OptimizationSummary
}

export type DefaultConfigResponse = {
  weights: Weights
  settings: AnnealingSettings
  search_space: {
    brightness: { min: number; max: number }
    cpu_frequency: { min: number; max: number }
    fan_modes: FanMode[]
    power_modes: PowerMode[]
  }
  example_configuration: LaptopConfiguration
}

export type AxisKey = keyof Metrics

