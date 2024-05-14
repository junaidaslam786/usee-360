import { httpGet, httpPost } from "../../rest-api";

const AgentAnalyticsService = {
  getTokensDetails: async (startDate, endDate) => {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      }).toString();

      const response = await httpGet(
        `agent/analytics/tokens?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Error while fetching tokens details", error);
      return null;
    }
  },

  // getPropertyOffers: async (startDate, endDate) => {
  //   try {
  //     const queryParams = new URLSearchParams({
  //       startDate,
  //       endDate,
  //     }).toString();

  //     const response = await httpPost(
  //       `agent/analytics/property-offers?${queryParams}`
  //     );
  //     return response;
  //   } catch (error) {
  //     console.error("Error while fetching property offers", error);
  //     return null;
  //   }
  // },

  getPropertyOffers: async () => {
    try {
      // const queryParams = new URLSearchParams({
      //   startDate,
      //   endDate,
      // }).toString();

      const response = await httpPost(
        `agent/analytics/property-offers`
      );
      return response;
    } catch (error) {
      console.error("Error while fetching property offers", error);
      return null;
    }
  },

  getPropertyVisits: async () => {
    try {
      // const queryParams = new URLSearchParams({
      //   startDate,
      //   endDate,
      // }).toString();

      const response = await httpPost(
        `agent/analytics/property-visits`
      );
      return response;
    } catch (error) {
      console.error("Error while fetching property visits", error);
      return null;
    }
  },

  getPropertyListings: async (startDate, endDate) => {
    try {
      // const queryParams = new URLSearchParams({
      //   startDate,
      //   endDate,
      // }).toString();

      const response = await httpPost(
        `agent/analytics/properties-listed`
      );
      return response;
    } catch (error) {
      console.error("Error while fetching property listings", error);
      return null;
    }
  },

  fetchUsersData: async () => {
    const userCategories = ['agent']; // Hardcoded categories
    try {
      const response = await httpPost('agent/reports/users', { userCategories });
      return response;
    } catch (error) {
      console.error("Error while fetching users data", error);
      return null;
    }
  },

  fetchPropertiesData: async () => {
    const propertyCategories = ['listed', 'sold', 'unsold']; // Hardcoded categories
    try {
      const response = await httpPost('agent/reports/properties', { propertyCategories });
      return response;
    } catch (error) {
      console.error("Error while fetching properties data", error);
      return null;
    }
  },

  fetchServicesData: async () => {
    const serviceCategories = ["videoCall", "propertyListing", "apiSubscription", "analytics"]; // Hardcoded categories
    try {
      const response = await httpPost('agent/reports/services', { serviceCategories });
      return response;
    } catch (error) {
      console.error("Error while fetching services data", error);
      return null;
    }
  },

  propertyCarbonData: async () => {
    try {
      const response = await httpPost('agent/analytics/property-carbon-footprint');
      return response;
    } catch (error) {
      console.error("Error while fetching property carbon data", error);
      return null;
    }
  },
  
  appointmentCarbonData: async () => {
    try {
      const response = await httpPost('agent/analytics/appointment-carbon-footprint');
      return response;
    } catch (error) {
      console.error("Error while fetching appointment carbon data", error);
      return null;
    }
  }
  
 
};

export default AgentAnalyticsService;
