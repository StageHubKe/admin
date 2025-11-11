import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/authSlice";
import artistReducer from "./reducers/artistSlice";
import eventReducer from "./reducers/eventSlice";
import gigPosterSlice from "./reducers/gigPosterSlice"

export const store = configureStore({
  reducer: {
    auth: userReducer,
    artist: artistReducer,
    event: eventReducer,
    gigPoster: gigPosterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
