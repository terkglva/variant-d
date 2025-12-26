import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import {
  loadCallById,
  setCurrentCallId,
  selectCurrentCall,
  selectCurrentCallError,
  selectCurrentCallStatus,
  startCallById,
  finishCallById,
  selectCallActionState,
  openTranscriptDrawer,
} from "../callsSlice";

export default function useCallDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const call = useSelector(selectCurrentCall);
  const status = useSelector(selectCurrentCallStatus);
  const error = useSelector(selectCurrentCallError);
  const actionState = useSelector(selectCallActionState(id));

  useEffect(() => {
    dispatch(setCurrentCallId(id));
    dispatch(loadCallById(id));
  }, [dispatch, id]);

  const isLoading = status === "loading";
  const isFailed = status === "failed";

  const canStart = call?.status === "scheduled";
  const canFinish = call?.status === "in_progress";
  const canTranscript = call?.status === "completed";

  const startLoading = actionState.start === "loading";
  const finishLoading = actionState.finish === "loading";

  const title = useMemo(() => `Call ${id}`, [id]);

  const onStart = useCallback(
    () => dispatch(startCallById(id)),
    [dispatch, id],
  );
  const onFinish = useCallback(
    () => dispatch(finishCallById(id)),
    [dispatch, id],
  );

  const onOpenTranscript = useCallback(
    () => dispatch(openTranscriptDrawer(id)),
    [dispatch, id],
  );

  return {
    id,
    call,
    status,
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
  };
}
