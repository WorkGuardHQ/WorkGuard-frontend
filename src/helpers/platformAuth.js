//src/helpers/platformAuth.js

const PLATFORM_TOKEN_KEY = 'platform_token';

export const savePlatformToken = (token) =>
  localStorage.setItem(PLATFORM_TOKEN_KEY, token);

export const getPlatformToken = () =>
  localStorage.getItem(PLATFORM_TOKEN_KEY);

export const removePlatformToken = () =>
  localStorage.removeItem(PLATFORM_TOKEN_KEY);

export const getPlatformPayload = () => {
  try {
    const token = getPlatformToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      removePlatformToken();
      return null;
    }
    return payload;
  } catch { return null; }
};

export const isPlatformAuthenticated = () => !!getPlatformPayload();

export const hasPlatformPermission = (permission) => {
  const p = getPlatformPayload();
  return !!p?.permissions?.[permission];
};