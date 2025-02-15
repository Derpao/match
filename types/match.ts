export interface Match {
  id: string | number
  matchTime: string
  image?: string
  teams: {
    teamA: string
    teamB: string
    logoA: string
    logoB: string
  }
}
