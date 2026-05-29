const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

export function getApiBaseUrl(): string {
  return API_URL.replace(/\/$/, '');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch(
  path: string,
  getToken: () => Promise<string | null>,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });
}

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function parseApiResponse<T>(response: Response): Promise<T> {
  let payload: ApiEnvelope<T> | { error?: string } | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<T> | { error?: string };
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload && 'error' in payload && payload.error) ||
      (payload && 'success' in payload && payload.error) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (!payload || !('success' in payload) || !payload.success || payload.data === undefined) {
    throw new ApiError('Invalid API response', response.status);
  }

  return payload.data;
}
