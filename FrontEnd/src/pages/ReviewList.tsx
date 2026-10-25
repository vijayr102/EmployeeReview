import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { errorMessage, getEmployees, getPeriods, getReviews } from "../api/client";
import Pagination from "../components/Pagination";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import type { Employee, Review, ReviewPeriod } from "../types";

const PAGE_SIZE = 5;

interface Filters {
  period_id?: number;
  employee_id?: number;
}

/** Paginated table of reviews, filterable by period and employee. Shows a success flash after a new review is submitted. */
export default function ReviewList() {
  const location = useLocation();
  const flash = (location.state as { flash?: string } | null)?.flash;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [periods, setPeriods] = useState<ReviewPeriod[]>([]);
  const [periodId, setPeriodId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [lookupError, setLookupError] = useState("");

  const { pageData: visible, total, loading, error: fetchError, page, totalPages, setPage } =
    usePaginatedFetch<Review, Filters>(getReviews, filters, PAGE_SIZE);
  const error = fetchError ?? lookupError;

  // Load employees and periods to populate the filter dropdowns.
  useEffect(() => {
    Promise.all([getEmployees(), getPeriods()])
      .then(([e, p]) => {
        setEmployees(e);
        setPeriods(p);
      })
      .catch((e) => setLookupError(errorMessage(e)));
  }, []);

  /** Applies the selected dropdown values as the active filters (triggers a refetch). */
  const search = () =>
    setFilters({
      period_id: periodId ? Number(periodId) : undefined,
      employee_id: employeeId ? Number(employeeId) : undefined,
    });

  return (
    <div className="card">
      <h2>Performance Reviews</h2>
      {flash && <div className="alert success">{flash}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="filters">
        <label className="field">
          Review Period
          <select value={periodId} onChange={(e) => setPeriodId(e.target.value)}>
            <option value="">All Periods</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Employee
          <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">All Employees</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <button className="btn primary" onClick={search}>
          Search
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Period</th>
            <th>Ratings</th>
            <th>Average</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="muted">
                Loading...
              </td>
            </tr>
          ) : visible.length === 0 ? (
            <tr>
              <td colSpan={7} className="muted">
                No reviews found
              </td>
            </tr>
          ) : (
            visible.map((r) => (
              <tr key={r.id}>
                <td>{r.employee_code}</td>
                <td>{r.employee_name}</td>
                <td>{r.period_name.split(" (")[0]}</td>
                <td>
                  {r.quality_rating}, {r.delivery_rating}, {r.teamwork_rating}
                </td>
                <td>{r.average_rating.toFixed(1)}</td>
                <td>
                  <span className="pill">{r.status}</span>
                </td>
                <td>
                  <Link to={`/reviews/${r.id}`}>View</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination currentPage={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
