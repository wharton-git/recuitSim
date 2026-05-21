import axios from 'axios'
import type {
  DefaultConfigResponse,
  LaptopConfiguration,
  OptimizationRequest,
  OptimizationResponse,
  Solution,
} from '../types'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  timeout: 12_000,
})

export async function checkHealth() {
  const { data } = await apiClient.get<{ status: string; service: string }>('/health')
  return data
}

export async function getDefaultConfig() {
  const { data } = await apiClient.get<DefaultConfigResponse>('/api/config/default')
  return data
}

export async function evaluateConfiguration(config: LaptopConfiguration) {
  const { data } = await apiClient.post<Solution>('/api/evaluate', config)
  return data
}

export async function optimizeConfiguration(request: OptimizationRequest) {
  const { data } = await apiClient.post<OptimizationResponse>('/api/optimize', request)
  return data
}

export function createMockOptimizationResponse(): OptimizationResponse {
  const solution = (
    brightness: number,
    cpu_frequency: number,
    fan_mode: Solution['fan_mode'],
    power_mode: Solution['power_mode'],
    profile_label: string,
    metrics: Solution['metrics'],
    score: number,
  ): Solution => ({
    brightness,
    cpu_frequency,
    fan_mode,
    power_mode,
    profile_label,
    metrics,
    score,
  })

  const pareto_front = [
    solution(48, 1.7, 'silent', 'eco', 'eco', { performance: 45, battery: 86, temperature: 39, noise: 28, energy: 31 }, 0.82),
    solution(60, 2.1, 'normal', 'balanced', 'balanced', { performance: 65, battery: 72, temperature: 52, noise: 38, energy: 48 }, 0.78),
    solution(72, 3.1, 'performance', 'performance', 'performance', { performance: 91, battery: 44, temperature: 76, noise: 58, energy: 75 }, 0.71),
    solution(42, 1.5, 'silent', 'balanced', 'silent', { performance: 49, battery: 80, temperature: 43, noise: 25, energy: 37 }, 0.8),
    solution(52, 1.8, 'performance', 'eco', 'cool', { performance: 54, battery: 77, temperature: 36, noise: 55, energy: 43 }, 0.76),
  ]

  return {
    best_solution: pareto_front[0],
    pareto_front,
    recommended_profiles: {
      eco: pareto_front[0],
      balanced: pareto_front[1],
      performance: pareto_front[2],
      silent: pareto_front[3],
      cool: pareto_front[4],
    },
    history: Array.from({ length: 42 }, (_, index) => ({
      iteration: index + 1,
      temperature: Number((100 * Math.pow(0.92, index)).toFixed(2)),
      candidate_score: Number((0.48 + Math.min(index / 90, 0.25) + Math.sin(index / 4) * 0.025).toFixed(4)),
      current_score: Number((0.5 + Math.min(index / 80, 0.26)).toFixed(4)),
      best_score: Number((0.55 + Math.min(index / 65, 0.27)).toFixed(4)),
      accepted: index % 3 !== 0,
      acceptance_probability: Number(Math.max(0.08, 0.95 - index / 55).toFixed(4)),
      score_delta: Number((Math.sin(index / 3) * 0.035).toFixed(4)),
    })),
    summary: {
      iterations: 42,
      accepted_moves: 29,
      acceptance_rate: 0.69,
      candidate_count: 65,
      pareto_count: pareto_front.length,
      best_score: pareto_front[0].score,
      average_score: 0.7,
      final_temperature: 2.9,
    },
  }
}

