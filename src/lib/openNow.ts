export type Hours = { monFri: string; satSun: string }

function parseRange(range: string) {
  const [a, b] = range.split('-')
  const [ah, am] = a.split(':').map(Number)
  const [bh, bm] = b.split(':').map(Number)
  return { open: ah * 60 + am, close: bh * 60 + bm }
}

function fmtTime(mins: number) {
  const h24 = Math.floor(mins / 60) % 24
  const m = mins % 60
  const ap = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`
}

export function getKolkataParts(d: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = get('weekday') // Mon Tue ...
  const hour = Number(get('hour'))
  const minute = Number(get('minute'))
  return { day, mins: (hour === 24 ? 0 : hour) * 60 + minute }
}

export function getVisitStatus(now: Date, hours: Hours) {
  const { day, mins } = getKolkataParts(now)
  const weekend = day === 'Sat' || day === 'Sun'
  const range = parseRange(weekend ? hours.satSun : hours.monFri)
  if (mins >= range.open && mins < range.close) {
    return { open: true, label: 'OPEN NOW', detail: `Closes ${fmtTime(range.close)}` }
  }
  let next = ''
  if (mins < range.open) {
    next = `Opens today ${fmtTime(range.open)}`
  } else {
    const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const idx = dayOrder.indexOf(day)
    const nextDay = dayOrder[(idx + 1) % 7]
    const nextWeekend = nextDay === 'Sat' || nextDay === 'Sun'
    const nextRange = parseRange(nextWeekend ? hours.satSun : hours.monFri)
    next = `Opens ${nextDay} ${fmtTime(nextRange.open)}`
  }
  return { open: false, label: 'CLOSED', detail: next }
}
