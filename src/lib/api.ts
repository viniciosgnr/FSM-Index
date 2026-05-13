import { fleetData, fpsoData, MonthlyRow, FpsoUnit } from "./mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/**
 * Robust fetcher that handles both server-side (absolute URL) 
 * and client-side (relative URL) requests.
 */
async function fetchWithFallback<T>(url: string, mockFallback: T): Promise<T> {
  if (USE_MOCK) return mockFallback;

  try {
    // If on server, we might need an absolute URL. 
    // We prefer calling the Python backend directly from the server.
    const isServer = typeof window === "undefined";
    const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
    
    let targetUrl = url;
    if (isServer) {
      // Map BFF routes to Python backend routes when on server
      if (url === "/api/fsm/fleet") targetUrl = `${backendUrl}/api/v1/snapshots/fleet`;
      if (url === "/api/fsm/fpso") targetUrl = `${backendUrl}/api/v1/snapshots/fpso`;
    }

    const res = await fetch(targetUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`API failed with status ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching from ${url}, falling back to mock:`, error);
    return mockFallback;
  }
}

export async function getFleetSnapshots(): Promise<MonthlyRow[]> {
  return fetchWithFallback<MonthlyRow[]>("/api/fsm/fleet", fleetData);
}

export async function getFpsoSnapshots(): Promise<FpsoUnit[]> {
  return fetchWithFallback<FpsoUnit[]>("/api/fsm/fpso", fpsoData);
}
