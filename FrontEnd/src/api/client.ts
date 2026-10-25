import type { Employee, Review, ReviewCreate, ReviewPeriod } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

/** Shared fetch wrapper: prefixes the base URL, turns network/HTTP failures into readable Errors, returns parsed JSON. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, init);
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    if (typeof body?.message === "string") throw new Error(body.message);
    if (Array.isArray(body?.detail)) throw new Error(body.detail.map((d: { msg: string }) => d.msg).join(", "));
    throw new Error("Something went wrong");
  }
  return response.json();
}

/** Builds a '?a=1&b=2' query string from the params, skipping undefined values. */
const query = (params: Record<string, number | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => value !== undefined && search.set(key, String(value)));
  const text = search.toString();
  return text ? `?${text}` : "";
};

/** GET /employees - all employees. */
export const getEmployees = () => request<Employee[]>("/employees");

/** GET /review-periods - all review periods. */
export const getPeriods = () => request<ReviewPeriod[]>("/review-periods");

/** GET /reviews - reviews, optionally filtered by period and/or employee. */
export const getReviews = (filters: { period_id?: number; employee_id?: number } = {}) =>
  request<Review[]>(`/reviews${query(filters)}`);

/** GET /reviews/{id} - a single review's details. */
export const getReview = (id: number) => request<Review>(`/reviews/${id}`);

/** POST /reviews - submits a new review and returns the created record. */
export const createReview = (body: ReviewCreate) =>
  request<Review>("/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

/** Extracts a display message from an unknown thrown value. */
export const errorMessage = (err: unknown): string => (err instanceof Error ? err.message : "Something went wrong");
