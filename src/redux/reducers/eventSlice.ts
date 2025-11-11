// src/redux/reducers/eventSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ===== Types =====
export interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  date: string;
  image?: string;
  createdBy?: { name: string; email: string };
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
  successMessage: null,
};

const API_URL = "http://localhost:5000/api/events";

// ===== Async Thunks =====
export const getAllEvents = createAsyncThunk(
  "events/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}`);
      return data.events;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load events");
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/update",
  async (
    { _id, title }: { _id: string; title: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(`${API_URL}/update/${_id}`, { title }, { withCredentials: true });
      return data.updatedEvent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update event");
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/delete",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/${eventId}`, { withCredentials: true });
      return { eventId, message: data.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete event");
    }
  }
);

// ===== Slice =====
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all events
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        const index = state.events.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) state.events[index] = action.payload;
        state.successMessage = "Event updated successfully!";
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((e) => e._id !== action.payload.eventId);
        state.successMessage = action.payload.message;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = eventSlice.actions;
export default eventSlice.reducer;
