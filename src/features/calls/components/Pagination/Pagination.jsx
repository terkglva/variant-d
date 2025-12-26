import "./Pagination.css";
import Row from "../../../../ui/Row/Row.jsx";
import Button from "../../../../ui/Button/Button.jsx";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled,
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <Row justify="space-between">
      <div className="pagination-info">
        Page <b>{page}</b> of <b>{totalPages}</b>
      </div>

      <Row justify="flex-end" gap={6}>
        <Button disabled={disabled || !canPrev} onClick={() => onPageChange(1)}>
          First
        </Button>

        <Button
          disabled={disabled || !canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>

        {start > 1 && <span className="pagination-dots">…</span>}

        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? "primary" : "default"}
            disabled={disabled}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}

        {end < totalPages && <span className="pagination-dots">…</span>}

        <Button
          disabled={disabled || !canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>

        <Button
          disabled={disabled || !canNext}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </Button>
      </Row>
    </Row>
  );
}
