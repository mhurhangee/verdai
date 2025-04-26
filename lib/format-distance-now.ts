import { formatDistanceToNow } from 'date-fns'

export function formatDistanceNow(date: Date | string | number): string {
    const dateObj = date instanceof Date ? date : new Date(date)
    return formatDistanceToNow(dateObj, { addSuffix: true })
      .replace('minutes', 'mins')
      .replace('minute', 'min')
      .replace('seconds', 'secs')
      .replace('second', 'sec')
  }