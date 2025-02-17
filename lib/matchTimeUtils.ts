export function isPredictionClosed(matchTime: string): boolean {
  const now = new Date();
  const matchDate = new Date(matchTime);
  const twoHoursBeforeMatch = new Date(matchTime);
  twoHoursBeforeMatch.setHours(matchDate.getHours() - 2);
  
  return now >= twoHoursBeforeMatch;
}
