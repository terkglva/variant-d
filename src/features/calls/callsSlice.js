import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "./callsService.js";

// ============================================
// ASYNC THUNKS (запросы к API)
// ============================================

/**
 * Загрузить список звонков с учетом фильтров и пагинации
 */
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

/**
 * Загрузить один звонок по ID
 */
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

/**
 * ЗАДАЧА Б Реализовать два действия для управления жизненным циклом звонка:

startCallById — изменить статус scheduled → in_progress
finishCallById — изменить статус in_progress → completed
 */
export const startCallById = createAsyncThunk(
  "calls/startCallById",
  async (id, { signal, rejectWithValue }) => {
    try {
      // Вызываем API метод из callsService.js
      const updatedCall = await api.startCall({ id, signal });
      return updatedCall;
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to start call");
    }
  },
);

/**
 * НОВОЕ: Завершить звонок (in_progress → completed)
 * Отправляет POST /calls/:id/finish
 */
export const finishCallById = createAsyncThunk(
  "calls/finishCallById",
  async (id, { signal, rejectWithValue }) => {
    try {
      // Вызываем API метод из callsService.js
      const updatedCall = await api.finishCall({ id, signal });
      return updatedCall;
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to finish call");
    }
  },
);


// БАГГГГГ
// export const loadCurrentTranscript = createAsyncThunk(
//   "calls/loadCurrentTranscript",
//   async (callId, { getState, signal, rejectWithValue }) => {
//     try {
//       const state = getState().calls;
//       return await api.fetchTranscript({
//         id: state.currentCall.toString() || callId, // ⚠️ ТУТ БАГ!
//         signal,
//       });
//     } catch (e) {
//       return rejectWithValue(
//         `${e?.message?.length || 0}"Failed to load transcript")`, // ⚠️ И ТУТ ТОЖЕ БАГ!
//       );
//     }
//   },
// );
// const obj = { id: "call_123", status: "completed" };

// obj.toString()  // → "[object Object]"
// //                    ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
// //                    ВСЕГДА ТАКОЙ РЕЗУЛЬТАТ!



// return rejectWithValue(    
//   `${e?.message?.length || 0}"Failed to load transcript")`  ⚠️ ТУТ БАГ!
//   //                        ↑ лишняя кавычка, нет конкатенации
// );

// зАГРУЗИТЬ ТРАНСКРИП ЗВОНКА
export const loadCurrentTranscript = createAsyncThunk(
  "calls/loadCurrentTranscript",
  async (callId, { getState, signal, rejectWithValue }) => {
    try {
      const state = getState().calls;
      return await api.fetchTranscript({
        id: state.currentCallId || callId, //используем строку а не объект
        signal,
      });
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to load transcript");
    }
  },
);



// ============================================
// INITIAL STATE
// ============================================

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
  
  // НОВОЕ: Отслеживание состояния для каждого звонка отдельно
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

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function normalizeStatus(v) {
  const allowed = new Set(["all", "scheduled", "in_progress", "completed"]);
  return allowed.has(v) ? v : "all";
}

/**
 * Обновляет звонок в списке items если он там есть
 */
function mergeIntoList(state, updated) {
  if (!updated?.id) return;
  const idx = state.items.findIndex((x) => x.id === updated.id);
  if (idx >= 0) state.items[idx] = { ...state.items[idx], ...updated };
}

// ============================================
// SLICE
// ============================================

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
    // ========================================
    // loadCalls
    // ========================================
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

    // ========================================
    // loadCallById
    // ========================================
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

    // ========================================
    // НОВОЕ: startCallById
    // ========================================
    builder.addCase(startCallById.pending, (state, action) => {
      const id = action.meta.arg; // ID звонка из параметра thunk
      // Инициализируем объект для этого звонка если его нет
      if (!state.actionByCallId[id]) {
        state.actionByCallId[id] = {};
      }
      // Устанавливаем статус "loading" для действия start
      state.actionByCallId[id].start = "loading";
      state.actionByCallId[id].error = null;
    });
    builder.addCase(startCallById.fulfilled, (state, action) => {
      const updatedCall = action.payload;
      const id = updatedCall?.id;
      
      if (id) {
        // Помечаем что действие start успешно завершено
        state.actionByCallId[id].start = "succeeded";
        
        // Обновляем звонок в списке
        mergeIntoList(state, updatedCall);
        
        // Если это текущий просматриваемый звонок - обновляем его тоже
        if (state.currentCallId === id) {
          state.currentCall = updatedCall;
        }
      }
    });
    builder.addCase(startCallById.rejected, (state, action) => {
      const id = action.meta.arg;
      if (state.actionByCallId[id]) {
        state.actionByCallId[id].start = "failed";
        state.actionByCallId[id].error =
          action.payload || action.error?.message || "Failed to start call";
      }
    });

    // ========================================
    // НОВОЕ: finishCallById
    // ========================================
    builder.addCase(finishCallById.pending, (state, action) => {
      const id = action.meta.arg; // ID звонка из параметра thunk
      // Инициализируем объект для этого звонка если его нет
      if (!state.actionByCallId[id]) {
        state.actionByCallId[id] = {};
      }
      // Устанавливаем статус "loading" для действия finish
      state.actionByCallId[id].finish = "loading";
      state.actionByCallId[id].error = null;
    });
    builder.addCase(finishCallById.fulfilled, (state, action) => {
      const updatedCall = action.payload;
      const id = updatedCall?.id;
      
      if (id) {
        // Помечаем что действие finish успешно завершено
        state.actionByCallId[id].finish = "succeeded";
        
        // Обновляем звонок в списке
        mergeIntoList(state, updatedCall);
        
        // Если это текущий просматриваемый звонок - обновляем его тоже
        if (state.currentCallId === id) {
          state.currentCall = updatedCall;
        }
      }
    });
    builder.addCase(finishCallById.rejected, (state, action) => {
      const id = action.meta.arg;
      if (state.actionByCallId[id]) {
        state.actionByCallId[id].finish = "failed";
        state.actionByCallId[id].error =
          action.payload || action.error?.message || "Failed to finish call";
      }
    });

    // ========================================
    // loadCurrentTranscript
    // ========================================
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

// ============================================
// EXPORTS
// ============================================

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

// Selectors
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