import "./CallsFilters.css";
import { useDispatch, useSelector } from "react-redux";
import { selectCallsFilters, setFilters, resetFilters } from "../../callsSlice";

import Card from "../../../../ui/Card/Card";
import Row from "../../../../ui/Row/Row";
import Button from "../../../../ui/Button/Button";

export default function CallsFilters() {
  const dispatch = useDispatch();
  const filters = useSelector(selectCallsFilters);

  return (
    <Card>
      <div className="panel">
        <Row gap={10} wrap>
          <select
            className="select"
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
            aria-label="Status"
          >
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>

          <Row gap={8}>
            <span className="label">From</span>
            <input
              className="input date"
              type="date"
              value={filters.from}
              onChange={(e) => dispatch(setFilters({ from: e.target.value }))}
              aria-label="From date"
            />
          </Row>

          <Row gap={8}>
            <span className="label">To</span>
            <input
              className="input date"
              type="date"
              value={filters.to}
              onChange={(e) => dispatch(setFilters({ to: e.target.value }))}
              aria-label="To date"
            />
          </Row>

          <Button onClick={() => dispatch(resetFilters())}>Reset</Button>
        </Row>
      </div>
    </Card>
  );
}
