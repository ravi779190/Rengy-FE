let accessToken = null;
let onLogout = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
}

export function registerLogoutHandler(handler) {
  onLogout = handler;
}

export function triggerLogout() {
  accessToken = null;
  if (onLogout) onLogout();
}
