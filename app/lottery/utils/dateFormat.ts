export const formatThaiDate = (isoDate: string) => {
  // Convert isoDate to Thai Buddhist Era date format
  const date = new Date(isoDate)
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]
  
  const day = date.getDate()
  const month = thaiMonths[date.getMonth()]
  const year = date.getFullYear() + 543 // Convert to Buddhist Era

  return `${day} ${month} ${year}`
}
