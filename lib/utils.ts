export function formatMatchTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '')
}

export function canPredict(matchTime: string): boolean {
  const matchDateTime = new Date(matchTime)
  const now = new Date()
  const oneHourBefore = new Date(matchDateTime.getTime() - 60 * 60 * 1000)
  
  // Add timezone offset consideration
  return now.getTime() < oneHourBefore.getTime()
}

export function getClosingTime(matchTime: string): string {
  const matchDateTime = new Date(matchTime)
  const oneHourBefore = new Date(matchDateTime.getTime() - 60 * 60 * 1000)
  return formatMatchTime(oneHourBefore.toISOString())
}
