// วันหวยออกปี 2568 (2025)
const LOTTERY_DATES_2025 = [
  { date: '16 มกราคม 2568', isoDate: '2025-01-16T14:00:00' },
  { date: '1 กุมภาพันธ์ 2568', isoDate: '2025-02-01T03:45:00' },
  { date: '22 กุมภาพันธ์ 2568', isoDate: '2025-02-22T04:30:00' },
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

const isLotteryExpired = (targetDate: string) => {
  const now = new Date().getTime();
  const drawTime = new Date(targetDate).getTime();
  return now >= drawTime;
};

const getNextLotteryDate = () => {
  const now = new Date();
  return LOTTERY_DATES_2025.find(draw => new Date(draw.isoDate) > now) || LOTTERY_DATES_2025[0];
};

const getLastLotteryDate = () => {
  const now = new Date();
  const reversedDates = [...LOTTERY_DATES_2025].reverse();
  return reversedDates.find(draw => new Date(draw.isoDate) < now) || LOTTERY_DATES_2025[LOTTERY_DATES_2025.length - 1];
};

const getNextLotteryAfter = (currentDate: string) => {
  const currentIdx = LOTTERY_DATES_2025.findIndex(draw => draw.date === currentDate);
  if (currentIdx < LOTTERY_DATES_2025.length - 1) {
    return LOTTERY_DATES_2025[currentIdx + 1];
  }
  return LOTTERY_DATES_2025[0]; // Loop back to first date if at end
};

const nextDraw = getNextLotteryDate();
const lastDraw = getLastLotteryDate();

export const lotteries = [
  {
    id: '1',
    date: nextDraw.date, // Use the formatted Thai date directly
    isoDate: nextDraw.isoDate, // Keep ISO date for calculations
    nextDate: getNextLotteryAfter(nextDraw.date).date,
    reward: '6,000,000 บาท',
    status: isLotteryExpired(nextDraw.isoDate) ? 'closed' : 'open' as const,
    targetDate: nextDraw.isoDate
  },
  {
    id: '2',
    date: lastDraw.date,
    isoDate: lastDraw.isoDate,
    nextDate: getNextLotteryAfter(lastDraw.date).date,
    reward: '6,000,000 บาท',
    status: 'closed' as const,
    targetDate: lastDraw.isoDate
  }
];

// Add exports for utility functions
export { isLotteryExpired, getNextLotteryAfter, getNextLotteryDate }