interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

/** Page navigator with a 'Showing X to Y of N' summary, prev/next buttons and numbered page buttons. */
export default function Pagination({ currentPage, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);
  return (
    <nav className="pager">
      <span>
        Showing {from} to {to} of {total} reviews
      </span>
      <div>
        <button disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} className={n === currentPage ? "active" : ""} onClick={() => onPageChange(n)}>
            {n}
          </button>
        ))}
        <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          ›
        </button>
      </div>
    </nav>
  );
}
