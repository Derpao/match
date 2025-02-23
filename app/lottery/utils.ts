export const LOTTERY_DATES = [
    { date: '16 มกราคม 2568', isoDate: '2025-01-16T14:00:00' },
    { date: '1 กุมภาพันธ์ 2568', isoDate: '2025-02-01T03:45:00' },
    { date: '23 กุมภาพันธ์ 2568', isoDate: '2025-02-23T04:30:00' },
    { date: '1 มีนาคม 2568', isoDate: '2025-03-01T14:00:00' },
    { date: '16 มีนาคม 2568', isoDate: '2025-03-16T14:00:00' },
    { date: '1 เมษายน 2568', isoDate: '2025-04-01T14:00:00' },
    { date: '16 เมษายน 2568', isoDate: '2025-04-16T14:00:00' },
    { date: '2 พฤษภาคม 2568', isoDate: '2025-05-02T14:00:00' },
    { date: '16 พฤษภาคม 2568', isoDate: '2025-05-16T14:00:00' },
    { date: '1 มิถุนายน 2568', isoDate: '2025-06-01T14:00:00' },
    { date: '16 มิถุนายน 2568', isoDate: '2025-06-16T14:00:00' },
    { date: '1 กรกฎาคม 2568', isoDate: '2025-07-01T14:00:00' },
    { date: '16 กรกฎาคม 2568', isoDate: '2025-07-16T14:00:00' },
    { date: '1 สิงหาคม 2568', isoDate: '2025-08-01T14:00:00' },
    { date: '16 สิงหาคม 2568', isoDate: '2025-08-16T14:00:00' },
    { date: '1 กันยายน 2568', isoDate: '2025-09-01T14:00:00' },
    { date: '16 กันยายน 2568', isoDate: '2025-09-16T14:00:00' },
    { date: '1 ตุลาคม 2568', isoDate: '2025-10-01T14:00:00' },
    { date: '16 ตุลาคม 2568', isoDate: '2025-10-16T14:00:00' },
    { date: '1 พฤศจิกายน 2568', isoDate: '2025-11-01T14:00:00' },
    { date: '16 พฤศจิกายน 2568', isoDate: '2025-11-16T14:00:00' },
    { date: '1 ธันวาคม 2568', isoDate: '2025-12-01T14:00:00' },
    { date: '16 ธันวาคม 2568', isoDate: '2025-12-16T14:00:00' },
    { date: '30 ธันวาคม 2568', isoDate: '2025-12-30T14:00:00' }
  ];

const isDrawingTime = (isoDate: string) => {
  const drawTime = new Date(isoDate).getTime()
  const now = new Date().getTime()
  const fourHoursInMs = 4 * 60 * 60 * 1000
  
  return now >= drawTime && now <= (drawTime + fourHoursInMs)
}

export const getCurrentLottery = () => {
  const now = new Date()
  const nextLottery = LOTTERY_DATES.find(lottery => 
    new Date(lottery.isoDate) > now
  ) || LOTTERY_DATES[0]

  let drawingStatus = false
  LOTTERY_DATES.forEach(lottery => {
    if (isDrawingTime(lottery.isoDate)) {
      console.log('อยู่ระหว่างหวยออก - วันที่', lottery.date)
      drawingStatus = true
    }
  })

  return {
    id: '1',
    date: nextLottery.date,
    targetDate: nextLottery.isoDate,
    reward: '100,000 บาท',
    allDates: LOTTERY_DATES,
    isDrawing: drawingStatus
  }
}
