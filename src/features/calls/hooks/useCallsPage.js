import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import useCallsUrlSync from "./useCallsUrlSync.js";
import {
  loadCalls,
  selectCalls,
  selectCallsFilters,
  selectCallsListError,
  selectCallsListStatus,
  selectCallsPagination,
  setPage,
  startCallById,
  finishCallById,
  setCurrentCallId,
} from "../callsSlice";

export default function useCallsPage() {
  const dispatch = useDispatch();

  useCallsUrlSync();

  const items = useSelector(selectCalls);
  const listStatus = useSelector(selectCallsListStatus);
  const listError = useSelector(selectCallsListError);
  const { page, totalPages, totalItems } = useSelector(selectCallsPagination);
  const filters = useSelector(selectCallsFilters);

  useEffect(() => {
    dispatch(loadCalls());
  }, [dispatch, page, filters.status, filters.from, filters.to]);

  const isLoading = listStatus === "loading";
  const headerText = useMemo(() => `Calls (${totalItems})`, [totalItems]);

  const refresh = useCallback(() => dispatch(loadCalls()), [dispatch]);
  const onPageChange = useCallback((p) => dispatch(setPage(p)), [dispatch]);

  const onStart = useCallback((id) => dispatch(startCallById(id)), [dispatch]);
  const onFinish = useCallback(
    (id) => dispatch(finishCallById(id)),
    [dispatch],
  );
  const onOpenDetails = useCallback(
    (id) => dispatch(setCurrentCallId(id)),
    [dispatch],
  );

  return {
    items,
    listStatus,
    listError,

    page,
    totalPages,
    totalItems,

    isLoading,
    headerText,

    refresh,
    onPageChange,
    onStart,
    onFinish,
    onOpenDetails,
  };
}
