const DEV = import.meta.env.DEV;
const authApi = '/api/auth';
const authReturn = DEV ? '?return=vite' : '';

export const HOME_URL = '/';
export const SERVICE_URL = '/api';
export const LOGIN_URL = `${authApi}/login${authReturn}`;
export const DEMO_URL = `${SERVICE_URL}/demo`;
export const CHANGE_USER_URL = `${authApi}/change_user${authReturn}`;
