const TokenKey = 'Admin-Token'

export function getToken() {
  return window.localStorage.getItem(TokenKey) || ''
}

export function setToken(token) {
  return window.localStorage.setItem(TokenKey, token)
}

export function clearToken() {
  window.localStorage.removeItem(TokenKey)
}