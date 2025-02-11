export interface Teams {
  teamA: string
  teamB: string
  logoA: string
  logoB: string
}

export interface Match {
  id: number
  teams: Teams
  matchTime: string
  
}

export interface PredictionData {
  match_id: number
  team_a: string
  team_b: string
  score_a: number
  score_b: number
  phone_number: string
  submission_time: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface PredictionResponse {
  success: boolean
  message: string
  predictionId?: string
}

// Add type for form submission response
export interface SubmissionResponse {
  success: boolean
  message: string
  error?: string
}
