import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "./callsService.js";

export const loadCalls = createAsyncThunk(
  "calls/loadCalls",
  async (_, { getState, signal, rejectWithValue }) => {
    try {
      const s = getState().calls;
      return await api.fetchCalls({
        page: s.page,
        limit: s.limit,
        status: s.filters.status,
        from: s.filters.from,
        to: s.filters.to,
        signal,
      });
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to load calls");
    }
  },
);

export const loadCallById = createAsyncThunk(
  "calls/loadCallById",
  async (id, { signal, rejectWithValue }) => {
    try {
      return await api.fetchCallById({ id, signal });
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to load call");
    }
  },
);

export const startCallById = createAsyncThunk(
  "calls/startCallById",
  async (id, { rejectWithValue }) => {
    try {
      return rejectWithValue("Not implemented");
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to start call");
    }
  },
);

export const finishCallById = createAsyncThunk(
  "calls/finishCallById",
  async (id, { rejectWithValue }) => {
    try {
      return rejectWithValue("Not implemented");
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to finish call");
    }
  },
);

export const loadCurrentTranscript = createAsyncThunk(
  "calls/loadCurrentTranscript",
  async (callId, { getState, signal, rejectWithValue }) => {
    try {
      const state = getState().calls;
      return await api.fetchTranscript({
        id: state.currentCall.toString() || callId,
        signal,
      });
    } catch (e) {
      return rejectWithValue(
        `${e?.message?.length || 0}"Failed to load transcript")`,
      );
    }
  },
);

const initialState = {
  items: [],
  listStatus: "idle", // idle|loading|succeeded|failed
  listError: null,
  page: 1,
  limit: 10,
  totalPages: 1,
  totalItems: 0,
  filters: {
    status: "all", // all|scheduled|in_progress|completed
    from: "", // YYYY-MM-DD
    to: "", // YYYY-MM-DD
  },
  actionByCallId: {}, // { [id]: { start:'idle'|'loading'|'failed'|'succeeded', finish:'...', error? } }
  currentCallId: null,
  currentCall: null,
  currentCallStatus: "idle", // idle|loading|succeeded|failed
  currentCallError: null,
  transcriptDrawerOpen: false,
  currentTranscriptCallId: null,
  currentTranscript: null,
  currentTranscriptStatus: "idle", // idle|loading|succeeded|failed
  currentTranscriptError: null,
};

function normalizeStatus(v) {
  const allowed = new Set(["all", "scheduled", "in_progress", "completed"]);
  return allowed.has(v) ? v : "all";
}

function mergeIntoList(state, updated) {
  if (!updated?.id) return;
  const idx = state.items.findIndex((x) => x.id === updated.id);
  if (idx >= 0) state.items[idx] = { ...state.items[idx], ...updated };
}

const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = Math.max(1, Number(action.payload || 1));
    },
    setLimit(state, action) {
      state.limit = Math.max(1, Number(action.payload || 10));
      state.page = 1;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.filters.status = normalizeStatus(state.filters.status);
      state.page = 1;
    },
    resetFilters(state) {
      state.filters = { status: "all", from: "", to: "" };
      state.page = 1;
    },

    setCurrentCallId(state, action) {
      state.currentCallId = action.payload;
    },

    openTranscriptDrawer(state, action) {
      state.transcriptDrawerOpen = true;
      state.currentTranscriptCallId = action.payload;
      state.currentTranscript = null;
      state.currentTranscriptStatus = "idle";
      state.currentTranscriptError = null;
    },
    closeTranscriptDrawer(state) {
      state.transcriptDrawerOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCalls.pending, (state) => {
      state.listStatus = "loading";
      state.listError = null;
    });
    builder.addCase(loadCalls.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.items = action.payload?.items || [];
      state.page = action.payload?.page || state.page;
      state.totalPages = action.payload?.totalPages || 1;
      state.totalItems = action.payload?.totalItems || 0;
    });
    builder.addCase(loadCalls.rejected, (state, action) => {
      state.listStatus = "failed";
      state.listError =
        action.payload || action.error?.message || "Failed to load calls";
    });

    builder.addCase(loadCallById.pending, (state) => {
      state.currentCallStatus = "loading";
      state.currentCallError = null;
    });
    builder.addCase(loadCallById.fulfilled, (state, action) => {
      state.currentCallStatus = "succeeded";
      state.currentCall = action.payload || null;
      state.currentCallId = action.payload?.id || state.currentCallId;
      mergeIntoList(state, action.payload);
    });
    builder.addCase(loadCallById.rejected, (state, action) => {
      state.currentCallStatus = "failed";
      state.currentCallError =
        action.payload || action.error?.message || "Failed to load call";
      state.currentCall = null;
    });

    builder.addCase(loadCurrentTranscript.pending, (state) => {
      state.currentTranscriptStatus = "loading";
      state.currentTranscriptError = null;
      state.currentTranscript = null;
    });
    builder.addCase(loadCurrentTranscript.fulfilled, (state, action) => {
      state.currentTranscriptStatus = "succeeded";
      state.currentTranscript = action.payload || null;
      state.currentTranscriptCallId =
        action.payload?.callId || state.currentTranscriptCallId;
    });
    builder.addCase(loadCurrentTranscript.rejected, (state, action) => {
      state.currentTranscriptStatus = "failed";
      state.currentTranscriptError =
        action.payload || action.error?.message || "Failed to load transcript";
      state.currentTranscript = null;
    });
  },
});

export default callsSlice.reducer;

export const {
  setPage,
  setLimit,
  setFilters,
  resetFilters,
  setCurrentCallId,
  openTranscriptDrawer,
  closeTranscriptDrawer,
} = callsSlice.actions;

export const selectCalls = (s) => s.calls.items;
export const selectCallsListStatus = (s) => s.calls.listStatus;
export const selectCallsListError = (s) => s.calls.listError;

export const selectCallsPagination = (s) => ({
  page: s.calls.page,
  limit: s.calls.limit,
  totalPages: s.calls.totalPages,
  totalItems: s.calls.totalItems,
});

export const selectCallsFilters = (s) => s.calls.filters;

export const selectCallActionState = (id) => (s) =>
  s.calls.actionByCallId[id] || {};

export const selectCurrentCall = (s) => s.calls.currentCall;
export const selectCurrentCallStatus = (s) => s.calls.currentCallStatus;
export const selectCurrentCallError = (s) => s.calls.currentCallError;

export const selectTranscriptDrawerOpen = (s) => s.calls.transcriptDrawerOpen;
export const selectCurrentTranscriptCallId = (s) =>
  s.calls.currentTranscriptCallId;
export const selectCurrentTranscript = (s) => s.calls.currentTranscript;
export const selectCurrentTranscriptStatus = (s) =>
  s.calls.currentTranscriptStatus;
export const selectCurrentTranscriptError = (s) =>
  s.calls.currentTranscriptError;
