import { configureStore } from "@reduxjs/toolkit";

import callsReducer from "../features/calls/callsSlice.js";

export const store = configureStore({
  reducer: {
    calls: callsReducer,
  },
});
