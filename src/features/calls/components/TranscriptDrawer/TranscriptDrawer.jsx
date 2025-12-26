import "./TranscriptDrawer.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Drawer from "../../../../ui/Drawer/Drawer";
import Card from "../../../../ui/Card/Card";
import Row from "../../../../ui/Row/Row";
import Button from "../../../../ui/Button/Button";
import ErrorBox from "../../../../ui/ErrorBox/ErrorBox";
import Loader from "../../../../ui/Loader/Loader.jsx";

import {
  closeTranscriptDrawer,
  loadCurrentTranscript,
  selectTranscriptDrawerOpen,
  selectCurrentTranscriptCallId,
  selectCurrentTranscript,
  selectCurrentTranscriptStatus,
  selectCurrentTranscriptError,
} from "../../callsSlice";

export default function TranscriptDrawer() {
  const dispatch = useDispatch();

  const isOpen = useSelector(selectTranscriptDrawerOpen);
  const callId = useSelector(selectCurrentTranscriptCallId);

  const transcript = useSelector(selectCurrentTranscript);
  const status = useSelector(selectCurrentTranscriptStatus);
  const error = useSelector(selectCurrentTranscriptError);

  useEffect(() => {
    if (!isOpen || !callId) return;
    dispatch(loadCurrentTranscript(callId));
  }, [dispatch, isOpen, callId]);

  const onClose = () => dispatch(closeTranscriptDrawer());

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="drawerBody">
        <Row justify="space-between" wrap>
          <div className="title">
            Transcript <span className="subtitle">({callId || "—"})</span>
          </div>

          <Button onClick={onClose}>Close</Button>
        </Row>

        <div className="section">
          {status === "loading" && <Loader text="Loading transcript…" />}

          {status === "failed" && (
            <ErrorBox status="error" title="Transcript not available">
              {String(error || "")}
            </ErrorBox>
          )}

          {status === "idle" && (
            <div className="muted">No transcript loaded.</div>
          )}

          {status === "succeeded" && transcript && (
            <div>
              <div className="meta">
                Created:{" "}
                <b>
                  {transcript.createdAt
                    ? new Date(transcript.createdAt).toLocaleString()
                    : "—"}
                </b>
              </div>

              <div className="list">
                {(transcript.segments || []).map((s, idx) => (
                  <Card key={idx}>
                    <div
                      className={`segment ${
                        s.speaker === "agent"
                          ? "segment--agent"
                          : "segment--customer"
                      }`}
                    >
                      <div className="segmentHeader">
                        <span className="speaker">
                          {s.speaker === "agent" ? "Agent" : "Customer"}
                        </span>
                        <span className="time">t={s.t}s</span>
                      </div>

                      <div className="segmentText">{s.text}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
