import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

export function convertThaiToISODate(thaiDate: string): string {
  try {
    // Split date and time
    const [date, time] = thaiDate.split(' ')
    const [day, month, yearBE] = date.split('/')
    const yearCE = parseInt(yearBE) - 543
    const [hours, minutes] = time.split(':')

    // Create date string in CE format with timezone offset for Bangkok
    const formattedDate = `${yearCE}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`
    
    // Construct ISO string with timezone offset
    return `${formattedDate}T${formattedTime}+07:00`
  } catch (error) {
    console.error('Date conversion error:', error)
    throw new Error('Invalid date format. Please use DD/MM/YYYY HH:mm')
  }
}

export function convertISOToThaiDate(isoDate: string): string {
  try {
    const bangkokDate = dayjs(isoDate).tz('Asia/Bangkok')
    const yearBE = bangkokDate.year() + 543
    return bangkokDate.format(`DD/MM/${yearBE} HH:mm`)
  } catch (error) {
    console.error('Date conversion error:', error)
    return isoDate
  }
}