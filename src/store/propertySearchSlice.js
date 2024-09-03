import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import HomepageService from "./../services/homepage";
import ProfileService from "../services/profile";

const initialState = {
  filters: {},
  selectedFilterCount: 0,
  properties: [],
  userDetails: {},
  totalPages: 0,
  loading: false,
  error: null,
};

// Function to filter out unselected filters
const filterOutUnselected = (filters) => {
  return Object.keys(filters).reduce((acc, key) => {
    const value = filters[key];
    if (
      value !== "" &&
      value !== false &&
      value !== null &&
      !(Array.isArray(value) && value.length === 0) &&
      !(typeof value === "number" && value === 0)
    ) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// Function to count selected filters
const countSelectedFilters = (filters) => {
  return Object.keys(filters).reduce((count, key) => {
    const value = filters[key];
    if (
      value !== "" &&
      value !== false &&
      value !== null &&
      !(Array.isArray(value) && value.length === 0) &&
      !(typeof value === "number" && value === 0)
    ) {
      return count + 1;
    }
    return count;
  }, 0);
};

export const fetchProperties = createAsyncThunk(
  "propertySearch/fetchProperties",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await HomepageService.listProperties("", filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "propertySearch/fetchUserDetails",
  async (userIds, { rejectWithValue }) => {
    try {
      const responses = await Promise.all(
        userIds.map((userId) => ProfileService.getUserBasicDetail(userId))
      );
      const userDetails = responses.reduce((acc, response, index) => {
        acc[userIds[index]] = response;
        return acc;
      }, {});
      return userDetails;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const propertySearchSlice = createSlice({
  name: "propertySearch",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      const cleanedFilters = filterOutUnselected(action.payload);
      state.filters = cleanedFilters;
      state.selectedFilterCount = countSelectedFilters(cleanedFilters);
    },
    clearFilters: (state) => {
      state.filters = {};
      state.selectedFilterCount = 0;
    },
    setProperties: (state, action) => {
      state.properties = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        // console.log("fetchProperties fulfilled:", action.payload);
        state.loading = false;
        state.properties = action.payload.data;
        state.totalPages = action.payload.totalPage || 1;
        // console.log("Updated state:", state);
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = { ...state.userDetails, ...action.payload };
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateFilters, clearFilters, setProperties } =
  propertySearchSlice.actions;

export default propertySearchSlice.reducer;
