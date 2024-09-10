import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import HomepageService from "./../services/homepage";
import ProfileService from "../services/profile";

const initialState = {
  filters: {},
  selectedFilterCount: 0,
  properties: [],
  userDetails: {},
  totalPages: 0,
  currentPage: 1,
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
      !(typeof value === "number" && value === 0) &&
      !(key === 'lat' && value === null) && // Exclude null lat
      !(key === 'lng' && value === null) && // Exclude null lng
      !(key === 'priceType' && value === "") // Exclude empty priceType
    ) {
      acc[key] = value;
    }
    return acc;
  }, {});
};


// Function to count selected filters
const countSelectedFilters = (filters) => {
  console.log("Filters before counting:", filters); // Debugging

  return Object.keys(filters).reduce((count, key) => {
    const value = filters[key];

    // Log each filter value being counted
    console.log(`Counting filter key: ${key}, value:`, value);

    // Check if the value is undefined or an empty string, and skip counting
    if (
      value !== "" && 
      value !== false && 
      value !== null && 
      value !== undefined && // Exclude undefined values
      !(Array.isArray(value) && value.length === 0) &&
      !(typeof value === "number" && value === 0) &&
      !(key === 'lat' && value === null) && // Exclude null lat
      !(key === 'lng' && value === null) && // Exclude null lng
      !(key === 'priceType' && value === "") // Exclude empty priceType
    ) {
      console.log(`Counting ${key} as valid filter`); // Debugging
      return count + 1;
    }
    return count;
  }, 0);
};





export const fetchProperties = createAsyncThunk(
  "propertySearch/fetchProperties",
  async ({ filters = {}, page = 1, size = 12 }, { rejectWithValue }) => {
    try {
      const response = await HomepageService.listProperties("", { ...filters, page, size });
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
      console.log("Updated filters:", cleanedFilters); // Debugging
      state.filters = { ...state.filters, ...cleanedFilters };
      console.log("Current state filters after merging:", state.filters); // Debugging
      state.selectedFilterCount = countSelectedFilters(cleanedFilters);
      state.currentPage = 1;
    },
    
    clearFilters: (state) => {
      state.filters = {};
      state.selectedFilterCount = 0;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Set the current page
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

export const { updateFilters, clearFilters, setProperties, setCurrentPage } =
  propertySearchSlice.actions;

export default propertySearchSlice.reducer;
