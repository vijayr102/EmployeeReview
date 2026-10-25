import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ReviewDetails from "./pages/ReviewDetails";
import ReviewForm from "./pages/ReviewForm";
import ReviewList from "./pages/ReviewList";

/** Root component: maps URL paths to pages, all wrapped in the shared Layout. '/' redirects to the review list. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/reviews" replace />} />
        <Route path="reviews" element={<ReviewList />} />
        <Route path="reviews/new" element={<ReviewForm />} />
        <Route path="reviews/:id" element={<ReviewDetails />} />
      </Route>
    </Routes>
  );
}
