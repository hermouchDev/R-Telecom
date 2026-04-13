const DEFAULT_API_BASE_URL = '/api';

const sanitizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

export const getApiBaseUrl = () => {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envBaseUrl && envBaseUrl.trim().length > 0) {
    return sanitizeBaseUrl(envBaseUrl.trim());
  }

  return DEFAULT_API_BASE_URL;
};

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
