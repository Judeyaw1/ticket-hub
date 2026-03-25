const AUTH_STORAGE_KEY = 'pulse:isAuthenticated';
const USER_ID_STORAGE_KEY = 'pulse:userId';

export function isUserAuthenticated() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function setUserAuthenticated(isAuthenticated: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
}

export function getCurrentUserId() {
  if (typeof window === 'undefined') {
    return 'user-1';
  }

  return window.localStorage.getItem(USER_ID_STORAGE_KEY) || 'user-1';
}

export function setCurrentUserId(userId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(USER_ID_STORAGE_KEY, userId);
}
