import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// กำหนด timezone เป็นของประเทศไทย
dayjs.tz.setDefault('Asia/Bangkok')

export function convertThaiToISODate(thaiDate: string): string {
  try {
    const [date, time] = thaiDate.split(' ')
    const [day, month, yearBE] = date.split('/')
    const yearCE = parseInt(yearBE) - 543
    const [hours, minutes] = time.split(':')

    // สร้างวันที่ในโซนเวลาของไทย
    const bangkokDate = dayjs.tz(
      `${yearCE}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hours}:${minutes}`,
      'Asia/Bangkok'
    )
    
    // แปลงเป็น ISO string โดยยังคงค่า timezone
    return bangkokDate.toISOString()
  } catch (error) {
    console.error('Date conversion error:', error)
    throw new Error('Invalid date format. Please use DD/MM/YYYY HH:mm')
  }
}

export function convertISOToThaiDate(isoDate: string): string {
  try {
    // แปลง ISO string เป็นวันที่ในโซนเวลาของไทย
    const bangkokDate = dayjs(isoDate).tz('Asia/Bangkok')
    
    // แปลงเป็นรูปแบบวันที่ไทย
    const yearBE = bangkokDate.year() + 543
    return bangkokDate.format(`DD/MM/${yearBE} HH:mm`)
  } catch (error) {
    console.error('Date conversion error:', error)
    return isoDate
  }
}
