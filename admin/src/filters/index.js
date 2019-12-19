import moment from 'moment'
export function dateformat(val, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(val).format(format)
}