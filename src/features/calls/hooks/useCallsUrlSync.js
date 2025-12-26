import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router";
import {
  selectCallsFilters,
  setFilters,
  setLimit,
  setPage,
} from "../callsSlice";

function toInt(value, fallback) {
  const n = parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function isValidISODate(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function normalizeStatus(v) {
  const allowed = new Set(["all", "scheduled", "in_progress", "completed"]);
  return allowed.has(v) ? v : "all";
}

function readQuery(searchParams) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  return {
    page: toInt(searchParams.get("page"), 1),
    limit: toInt(searchParams.get("limit"), 10),
    status: normalizeStatus(searchParams.get("status") || "all"),
    from: isValidISODate(from) ? from : "",
    to: isValidISODate(to) ? to : "",
  };
}

function writeQuery({ page, limit, filters }) {
  const next = new URLSearchParams();

  next.set("page", String(page));
  next.set("limit", String(limit));

  if (filters.status !== "all") next.set("status", filters.status);
  if (filters.from) next.set("from", filters.from);
  if (filters.to) next.set("to", filters.to);

  return next;
}

export default function useCallsUrlSync() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useSelector(selectCallsFilters);
  const page = useSelector((s) => s.calls.page);
  const limit = useSelector((s) => s.calls.limit);

  const urlKey = useMemo(() => searchParams.toString(), [searchParams]);

  const isApplyingUrlToRedux = useRef(false);
  const isApplyingReduxToUrl = useRef(false);

  useEffect(() => {
    if (isApplyingReduxToUrl.current) {
      isApplyingReduxToUrl.current = false;
      return;
    }

    const q = readQuery(searchParams);

    isApplyingUrlToRedux.current = true;

    dispatch(setLimit(q.limit));
    dispatch(setPage(q.page));
    dispatch(
      setFilters({
        status: q.status,
        from: q.from,
        to: q.to,
      }),
    );

    Promise.resolve().then(() => {
      isApplyingUrlToRedux.current = false;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, urlKey, location.pathname]);

  useEffect(() => {
    if (isApplyingUrlToRedux.current) return;

    const next = writeQuery({ page, limit, filters });
    const nextKey = next.toString();
    const currentKey = urlKey;

    if (nextKey === currentKey) return;

    isApplyingReduxToUrl.current = true;
    setSearchParams(next, { replace: true });
  }, [
    filters.status,
    filters.from,
    filters.to,
    page,
    limit,
    urlKey,
    setSearchParams,
  ]);
}
