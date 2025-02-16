import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const BANGKOK_TIMEZONE = 'Asia/Bangkok'

export const formatDisplayMatchTime = (dateStr: string): string => {
  try {
    return dayjs(dateStr).tz(BANGKOK_TIMEZONE).format('DD/MM/YYYY HH:mm')
  } catch (error) {
    console.error('Error formatting match time:', error)
    return dayjs(dateStr).format('DD/MM/YYYY HH:mm')
  }
}

export const canPredictMatch = (matchTime: string): boolean => {
  try {
    const now = dayjs().tz(BANGKOK_TIMEZONE)
    const matchDate = dayjs(matchTime).tz(BANGKOK_TIMEZONE)
    const twoHoursBefore = matchDate.subtract(2, 'hours')
    return now.isBefore(twoHoursBefore)
  } catch (error) {
    console.error('Error checking prediction time:', error)
    return false
  }
}

export const getMatchClosingTime = (matchTime: string): string => {
  try {
    const matchDate = dayjs(matchTime).tz(BANGKOK_TIMEZONE)
    const twoHoursBefore = matchDate.subtract(2, 'hours')
    return twoHoursBefore.format('HH:mm')
  } catch (error) {
    console.error('Error getting closing time:', error)
    return 'Invalid time'
  }
}
