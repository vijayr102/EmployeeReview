import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReview, errorMessage, getEmployees, getPeriods } from "../api/client";
import StarRating from "../components/StarRating";
import type { Employee, ReviewPeriod } from "../types";

const CRITERIA = [
  { key: "quality_rating", label: "Quality of Work" },
  { key: "delivery_rating", label: "Delivery & Ownership" },
  { key: "teamwork_rating", label: "Teamwork & Collaboration" },
] as const;

type RatingKey = (typeof CRITERIA)[number]["key"];

const emptyRatings: Record<RatingKey, number> = {
  quality_rating: 0,
  delivery_rating: 0,
  teamwork_rating: 0,
};

/** Form to submit a new review. Only open periods are selectable; validates input before posting. */
export default function ReviewForm() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [periods, setPeriods] = useState<ReviewPeriod[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [ratings, setRatings] = useState(emptyRatings);
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load employees and open review periods; auto-select the period when only one is open.
  useEffect(() => {
    Promise.all([getEmployees(), getPeriods()])
      .then(([e, p]) => {
        setEmployees(e);
        const open = p.filter((x) => x.status === "Open");
        setPeriods(open);
        if (open.length === 1) setPeriodId(String(open[0].id));
      })
      .catch((e) => setServerError(errorMessage(e)));
  }, []);

  /** Clears all fields and errors (keeps the period preselected when only one is open). */
  const reset = () => {
    setEmployeeId("");
    setPeriodId(periods.length === 1 ? String(periods[0].id) : "");
    setRatings(emptyRatings);
    setComments("");
    setErrors({});
    setServerError("");
  };

  /** Checks required fields, stores messages in `errors` and returns true when the form is valid. */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!employeeId) e.employee = "Employee is required";
    if (!periodId) e.period = "Review period is required";
    CRITERIA.forEach((c) => {
      if (ratings[c.key] < 1) e[c.key] = "Rating is required";
    });
    if (!comments.trim()) e.comments = "Overall comments are required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** Validates, posts the review, then goes to the list with a success message; shows server errors on failure. */
  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createReview({
        employee_id: Number(employeeId),
        period_id: Number(periodId),
        ...ratings,
        comments: comments.trim(),
      });
      navigate("/reviews", { state: { flash: "Review submitted successfully" } });
    } catch (err) {
      setServerError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={submit} noValidate>
      <h2>Submit Performance Review</h2>
      {serverError && <div className="alert error">{serverError}</div>}

      <div className="row">
        <label className="field">
          Employee *
          <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.employee_id} - {e.name}
              </option>
            ))}
          </select>
          {errors.employee && <small className="err">{errors.employee}</small>}
        </label>
        <label className="field">
          Review Period *
          <select value={periodId} onChange={(e) => setPeriodId(e.target.value)}>
            <option value="">Select period</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.period && <small className="err">{errors.period}</small>}
        </label>
      </div>

      <h3>Performance Ratings (1 - 5)</h3>
      {CRITERIA.map((c) => (
        <div className="rating-row" key={c.key}>
          <span>{c.label} *</span>
          <StarRating value={ratings[c.key]} onChange={(v) => setRatings({ ...ratings, [c.key]: v })} />
          {errors[c.key] && <small className="err">{errors[c.key]}</small>}
        </div>
      ))}

      <label className="field">
        Overall Comments *
        <textarea
          rows={5}
          placeholder="Enter your feedback, strengths, areas of improvement..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        {errors.comments && <small className="err">{errors.comments}</small>}
      </label>

      <div className="actions">
        <button type="button" className="btn secondary" onClick={reset}>
          Reset
        </button>
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}
