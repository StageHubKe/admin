/* eslint-disable @typescript-eslint/no-unused-vars */
// src/redux/reducers/authSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

// ====== TYPES ======
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  profilePicture?: string;
  createdAt?: string;
}

// ====== STATE TYPES ======
interface AuthState {
  admin: AdminUser | null;
  users: User[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// ====== INITIAL STATE ======
const initialState: AuthState = {
  admin: null,
  users: [],
  loading: false,
  error: null,
  isAuthenticated: false,
};

const API_URL = "http://localhost:5000/api/auth";

// Ensure Axios sends cookies with every request
axios.defaults.withCredentials = true;

// 🔹 Admin Login
export const adminLogin = createAsyncThunk<
  AdminUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/adminLogin", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true } // Important for cookie auth
    );

    const { user } = response.data;

    if (!user || user.role !== "admin") {
      return rejectWithValue("Access denied. Admins only.");
    }

    return user as AdminUser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Login failed. Please try again."
    );
  }
});

// 🔹 Logout
export const adminLogout = createAsyncThunk("auth/adminLogout", async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (err) {
    console.error("Logout error:", err);
  }
});

export const checkAdminSession = createAsyncThunk<
  AdminUser,
  void,
  { rejectValue: string }
>(
  "auth/checkAdminSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin-session`, { withCredentials: true });
      const { user } = response.data;
      if (!user || user.role !== "admin") {
        return rejectWithValue("Unauthorized access. Admin only.");
      }
      return user as AdminUser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue("No active admin session.");
    }
  }
);

// 🔹 Fetch All Users (requires admin session cookie)
export const getAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/getAllUsers`, {
      withCredentials: true,
    });
    return response.data.users as User[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});

// Update User
export const updateUser = createAsyncThunk<
  User,
  { id: string; data: Partial<User> },
  { rejectValue: string }
>("users/updateUser", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/user/${id}`, data, {
      withCredentials: true,
    });
    return response.data.user as User;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update user"
    );
  }
});

// Delete User
export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/user/${id}`, { withCredentials: true });
    return id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user"
    );
  }
});



// ====== SLICE ======
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Admin Login ===
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        adminLogin.fulfilled,
        (state, action: PayloadAction<AdminUser>) => {
          state.loading = false;
          state.admin = action.payload;
          state.isAuthenticated = true;
        }
      )
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // === Admin Logout ===
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })

      // === Check Session ===
      .addCase(checkAdminSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAdminSession.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAdminSession.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // === Get All Users ===
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user in state
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
      })

      // Remove user from state
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

// ====== EXPORTS ======
export default authSlice.reducer;
