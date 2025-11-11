import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ===== Types =====
export interface GigPoster {
  _id: string;
  eventType: string;
  artistCategory: string;
  instrumentsProvided?: string;
  performerEquipment?: string;
  guestCount: number;
  venueAddress: string;
  eventName: string;
  eventDescription: string;
  performanceDuration: string;
  planningStage: string;
  budget: string;
  eventPlannerName: string;
  contactInfo: string;
  multiDay: boolean;
  eventStartDate: string;
  eventEndDate?: string;
  posterImage?: string;
  status?: string;
  createdBy?: { name: string; email: string };
}

interface GigPosterState {
  gigs: GigPoster[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: GigPosterState = {
  gigs: [],
  loading: false,
  error: null,
  successMessage: null,
};

const API_URL = "http://localhost:5000/api/gigposter";

// ===== Async Thunks =====

// Fetch all gigs
export const getAllGigPosters = createAsyncThunk(
  "gigposters/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}`);
      return data.gigs;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load gig posters");
    }
  }
);

// Update a gig (admin only)
export const updateGigPoster = createAsyncThunk(
  "gigposters/update",
  async (
    { _id, updatedData }: { _id: string; updatedData: Partial<GigPoster> },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(`${API_URL}/updatePoster/${_id}`, updatedData, {
        withCredentials: true,
      });
      return data.updateGig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update gig poster");
    }
  }
);

// Delete a gig (admin only)
export const deleteGigPoster = createAsyncThunk(
  "gigposters/delete",
  async (gigId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/deletePoster/${gigId}`, {
        withCredentials: true,
      });
      return { gigId, message: data.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete gig poster");
    }
  }
);

// ===== Slice =====
const gigPosterSlice = createSlice({
  name: "gigposter",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all gigs
      .addCase(getAllGigPosters.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGigPosters.fulfilled, (state, action: PayloadAction<GigPoster[]>) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(getAllGigPosters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update gig
      .addCase(updateGigPoster.fulfilled, (state, action: PayloadAction<GigPoster>) => {
        state.loading = false;
        const index = state.gigs.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) state.gigs[index] = action.payload;
        state.successMessage = "Gig poster updated successfully!";
      })
      .addCase(updateGigPoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete gig
      .addCase(deleteGigPoster.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = state.gigs.filter((g) => g._id !== action.payload.gigId);
        state.successMessage = action.payload.message;
      })
      .addCase(deleteGigPoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = gigPosterSlice.actions;
export default gigPosterSlice.reducer;
