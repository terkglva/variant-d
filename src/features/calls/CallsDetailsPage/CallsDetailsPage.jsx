import "./CallsDetailsPage.css";
import { Link } from "react-router";

import Loader from "../../../ui/Loader/Loader.jsx";
import Card from "../../../ui/Card/Card";
import Row from "../../../ui/Row/Row";
import Button from "../../../ui/Button/Button";
import ErrorBox from "../../../ui/ErrorBox/ErrorBox";

import TranscriptDrawer from "../components/TranscriptDrawer/TranscriptDrawer.jsx";
import useCallDetailsPage from "../hooks/useCallDetailsPage.js";

function fmt(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return Number.isFinite(d.getTime()) ? d.toLocaleString() : "—";
}

function InfoRow({ label, value, type }) {
  const v = value || "—";
  const statusClass =
    type === "status"
      ? v === "scheduled"
        ? "value--scheduled"
        : v === "in_progress"
          ? "value--inprogress"
          : v === "completed"
            ? "value--completed"
            : ""
      : "";

  return (
    <div className="infoRow">
      <div className="infoLabel">{label}</div>
      <div className={`infoValue ${statusClass}`}>{v}</div>
    </div>
  );
}

export default function CallDetailsPage() {
  const {
    call,
    error,

    isLoading,
    isFailed,

    canStart,
    canFinish,
    canTranscript,

    startLoading,
    finishLoading,

    title,

    onStart,
    onFinish,
    onOpenTranscript,
  } = useCallDetailsPage();

  return (
    <Card>
      {isLoading && <Loader text="Loading call…" />}

      <Row justify="space-between" wrap>
        <div>
          <h1 className="h1 title">{title}</h1>
          <div className="back">
            <Link to="/calls" className="backLink">
              ← Back to calls
            </Link>
          </div>
        </div>

        <Row gap={8} wrap>
          <Button disabled={!canStart || startLoading} onClick={onStart}>
            {startLoading ? "Starting…" : "Start"}
          </Button>

          <Button disabled={!canFinish || finishLoading} onClick={onFinish}>
            {finishLoading ? "Finishing…" : "Finish"}
          </Button>

          <Button disabled={!canTranscript} onClick={onOpenTranscript}>
            Transcript
          </Button>
        </Row>
      </Row>

      {isFailed && (
        <div className="section">
          <ErrorBox status="error" title="Failed to load call">
            {String(error || "")}
          </ErrorBox>
        </div>
      )}

      {call && (
        <div className="section">
          <div className="grid">
            <Card>
              <div className="panel">
                <div className="panelTitle">Main info</div>

                <InfoRow label="Status" value={call.status} type="status" />
                <InfoRow label="Customer" value={call.customerName} />
                <InfoRow label="Agent" value={call.agentName} />
                <InfoRow label="Topic" value={call.topic} />
                <InfoRow label="Scheduled" value={fmt(call.scheduledAt)} />
                <InfoRow label="Started" value={fmt(call.startedAt)} />
                <InfoRow label="Finished" value={fmt(call.finishedAt)} />
              </div>
            </Card>

            <Card>
              <div className="panel">
                <div className="panelTitle">Notes</div>
                <div className="notes">{call.notes || "—"}</div>

                <div className="subSection">
                  <div className="panelTitle">Transcript</div>

                  {call.status !== "completed" ? (
                    <div className="muted">
                      Transcript becomes available only after finishing the
                      call.
                    </div>
                  ) : (
                    <Button onClick={onOpenTranscript}>Open transcript</Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      <TranscriptDrawer />
    </Card>
  );
}
