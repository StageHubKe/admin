import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  tiktok?: string;
}

export interface ArtistProfile {
  _id?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role?: string;
  };
  stageName: string;
  genre: string;
  type: string;
  bio: string;
  experienceYears: number;
  location: string;
  socialLinks?: SocialLinks;
  videos?: string[];
  coverImage?: string;
  pricing?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArtistProfileState {
  profile: ArtistProfile | null;
  profiles: ArtistProfile[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ArtistProfileState = {
  profile: null,
  profiles: [],
  loading: false,
  error: null,
  successMessage: null,
};

const API_URL = "http://localhost:5000/api/artistProfile";
type RejectValue = string;

// ✅ Create Artist Profile
export const createArtistProfile = createAsyncThunk<
  ArtistProfile,
  Partial<ArtistProfile>,
  { rejectValue: RejectValue }
>("artistProfile/create", async (profileData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/createArtistProfile`, profileData, {
      withCredentials: true,
    });
    return res.data.profile as ArtistProfile;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || "Error creating artist profile");
  }
});

// ✅ Get current user's Artist Profile
export const getArtistProfile = createAsyncThunk<
  ArtistProfile,
  void,
  { rejectValue: RejectValue }
>("artistProfile/getMine", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/getArtistProfile`, { withCredentials: true });
    return res.data.profile as ArtistProfile;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || "Error fetching artist profile");
  }
});

// ✅ Get all Artist Profiles
export const getAllArtistProfiles = createAsyncThunk<
  ArtistProfile[],
  void,
  { rejectValue: RejectValue }
>("artistProfile/getAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/getAllArtistProfiles`);
    return res.data.profiles as ArtistProfile[];
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || "Error fetching artist profiles");
  }
});

// ✅ Update Artist Profile
// ✅ Update Artist Profile (Admin)
export const updateArtistProfile = createAsyncThunk<
  ArtistProfile,
  Partial<ArtistProfile>,
  { rejectValue: string }
>("artistProfile/update", async (updatedData, { rejectWithValue }) => {
  try {
    const res = await axios.put(
      `${API_URL}/updateArtistProfile/${updatedData._id}`,
      updatedData,
      { withCredentials: true }
    );
    return res.data.profile as ArtistProfile;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || "Error updating artist profile");
  }
});

// ✅ Delete Artist Profile (Admin)
export const deleteArtistProfile = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("artistProfile/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${API_URL}/deleteArtistProfile/${id}`, {
      withCredentials: true,
    });
    return res.data.message as string;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || "Error deleting artist profile");
  }
});


const artistProfileSlice = createSlice({
  name: "artistProfile",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createArtistProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArtistProfile.fulfilled, (state, action: PayloadAction<ArtistProfile>) => {
        state.loading = false;
        state.profile = action.payload;
        state.successMessage = "Artist profile created successfully";
      })
      .addCase(createArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error creating artist profile";
      })

      // Get current user
      .addCase(getArtistProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArtistProfile.fulfilled, (state, action: PayloadAction<ArtistProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching artist profile";
      })

      // Get all
      .addCase(getAllArtistProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllArtistProfiles.fulfilled, (state, action: PayloadAction<ArtistProfile[]>) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(getAllArtistProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching artist profiles";
      })

      // Update
      .addCase(updateArtistProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateArtistProfile.fulfilled, (state, action: PayloadAction<ArtistProfile>) => {
        state.loading = false;
        state.profile = action.payload;
        state.successMessage = "Artist profile updated successfully";
      })
      .addCase(updateArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error updating artist profile";
      })

      // Delete
      .addCase(deleteArtistProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteArtistProfile.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.profile = null;
        state.successMessage = action.payload;
      })
      .addCase(deleteArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error deleting artist profile";
      });
  },
});

export const { clearMessages } = artistProfileSlice.actions;
export default artistProfileSlice.reducer;
