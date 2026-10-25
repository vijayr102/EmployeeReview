import { NavLink, Outlet } from "react-router-dom";

/** App shell: sidebar navigation plus an <Outlet /> where the active page renders. */
export default function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">Testleaf</div>
        <nav>
          <NavLink to="/reviews/new">Submit Review</NavLink>
          <NavLink to="/reviews" end>
            Reviews
          </NavLink>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
