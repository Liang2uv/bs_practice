//计算两点位置距离
export function getDistance(lat1, lng1, lat2, lng2) {
  lat1 = lat1 || 0
  lng1 = lng1 || 0
  lat2 = lat2 || 0
  lng2 = lng2 || 0    
  let rad1 = lat1 * Math.PI / 180.0    
  let rad2 = lat2 * Math.PI / 180.0    
  let a = rad1 - rad2    
  let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0    
  let r = 6378137  //地球半径
  let distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))
  return distance
}