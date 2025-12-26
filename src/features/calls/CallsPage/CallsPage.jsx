import "./CallsPages.css";
import { Link } from "react-router";
import { useSelector } from "react-redux";

import Loader from "../../../ui/Loader/Loader.jsx";
import Card from "../../../ui/Card/Card";
import Row from "../../../ui/Row/Row";
import Button from "../../../ui/Button/Button";
import ErrorBox from "../../../ui/ErrorBox/ErrorBox";

import CallsFilters from "../components/CallsFilters/CallsFilters.jsx";
import Pagination from "../components/Pagination/Pagination.jsx";
import TranscriptDrawer from "../components/TranscriptDrawer/TranscriptDrawer.jsx";

import useCallsPage from "../hooks/useCallsPage.js";

function fmt(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return Number.isFinite(d.getTime()) ? d.toLocaleString() : "—";
}

export default function CallsPage() {
  const {
    items,
    listStatus,
    listError,
    page,
    totalPages,
    isLoading,
    headerText,
    refresh,
    onPageChange,
    onOpenDetails,
  } = useCallsPage();

  return (
    <Card>
      {isLoading && <Loader text="Loading calls…" />}

      <Row justify="space-between" wrap>
        <h1 className="h1 title">{headerText}</h1>
        <Button onClick={refresh} disabled={isLoading}>
          Refresh
        </Button>
      </Row>

      <div className="section">
        <CallsFilters />
      </div>

      {listStatus === "failed" && (
        <div className="section">
          <ErrorBox status="error" title="Failed to load calls">
            {String(listError || "")}
          </ErrorBox>
        </div>
      )}

      <div className="section">
        <table className="table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th>Customer</th>
              <th className="col-agent">Agent</th>
              <th className="col-status">Status</th>
              <th className="col-date">Scheduled</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  No calls found.
                </td>
              </tr>
            )}

            {!isLoading &&
              items.map((call) => (
                <tr key={call.id}>
                  <td>{call.id}</td>

                  <td>
                    <Link
                      to={`/calls/${call.id}`}
                      onClick={onOpenDetails}
                      className="link"
                    >
                      <div className="customer">{call.customerName || "—"}</div>
                      <div className="topic">{call.topic || ""}</div>
                    </Link>
                  </td>

                  <td className="muted">{call.agentName || "—"}</td>

                  <td>
                    <span className="badge">{call.status}</span>
                  </td>

                  <td className="muted">{fmt(call.scheduledAt)}</td>

                  <td>
                    <Link
                      to={`/calls/${call.id}`}
                      onClick={() => onOpenDetails(call.id)}
                      className="linkBtn"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="pagination">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <TranscriptDrawer />
    </Card>
  );
}
