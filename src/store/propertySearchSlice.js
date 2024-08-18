import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import HomepageService from './../services/homepage';

const initialState = {
  filters: {},
  selectedFilterCount: 0,
  properties: [],
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
  'propertySearch/fetchProperties',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await HomepageService.listProperties('', filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const propertySearchSlice = createSlice({
  name: 'propertySearch',
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
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateFilters, clearFilters, setProperties } = propertySearchSlice.actions;

export default propertySearchSlice.reducer;
