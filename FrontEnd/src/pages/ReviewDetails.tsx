import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { errorMessage, getReview } from "../api/client";
import StarRating from "../components/StarRating";
import type { Review } from "../types";

/** Read-only view of a single review: employee, period, overall rating, per-criteria stars and comments. */
export default function ReviewDetails() {
  const { id } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState("");

  // Load the review identified by the :id route parameter.
  useEffect(() => {
    getReview(Number(id))
      .then(setReview)
      .catch((e) => setError(errorMessage(e)));
  }, [id]);

  if (error)
    return (
      <div className="card">
        <div className="alert error">{error}</div>
        <Link to="/reviews">Back to List</Link>
      </div>
    );
  if (!review) return <div className="card muted">Loading...</div>;

  const criteria = [
    ["Quality of Work", review.quality_rating],
    ["Delivery & Ownership", review.delivery_rating],
    ["Teamwork & Collaboration", review.teamwork_rating],
  ] as const;

  return (
    <div className="card">
      <div className="title-row">
        <h2>Review Details</h2>
        <Link to="/reviews" className="btn secondary">
          Back to List
        </Link>
      </div>

      <div className="summary">
        <div>
          <small>Employee</small>
          <strong>
            {review.employee_code} - {review.employee_name}
          </strong>
        </div>
        <div>
          <small>Review Period</small>
          <strong>{review.period_name}</strong>
        </div>
        <div className="overall">
          <small>Overall Rating</small>
          <strong>{review.average_rating.toFixed(1)} / 5</strong>
        </div>
      </div>

      <h3>Performance Criteria</h3>
      <table>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map(([label, value]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>
                <StarRating value={value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Manager Comments</h3>
      <p className="comments">{review.comments}</p>
    </div>
  );
}
