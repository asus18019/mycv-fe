export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const reqOptions = await buildReqOptions(init);
  const response = await fetch(`${BASE_URL}${path}`, reqOptions);

  if (!response.ok) {
    throw new ApiError(response.status, `${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "GET" }),

  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "DELETE" }),
};

async function buildReqOptions (init?: RequestInit) {
  let options: RequestInit = {
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  };

  // forward cookies from the incoming request when running on the server
  if(typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    options.headers = {
      ...options.headers,
      Cookie: cookieStore.toString()
    }
  }

  if(init?.headers) {
    options.headers = {
      ...options.headers,
      ...init?.headers
    }
  }

  options = {
    ...options,
    ...init
  }
  return options;
}