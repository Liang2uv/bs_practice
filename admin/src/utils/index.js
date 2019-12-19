import moment from 'moment'
export function getDateDiff(start, end, type) {
  const mstart = moment(start)
  const mend = moment(end)
  return mend.diff(mstart, type)
}