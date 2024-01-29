import { httpGet, httpDelete } from "../../rest-api";

const apiUrlPrefix = 'user';

const UserService = {
    listCustomers: async (searchQuery) => {
        const response = await httpGet(`${apiUrlPrefix}/list-customer?q=${searchQuery}`);

        if (response?.error) {
            if (response?.error?.message && response?.error?.message.length < 0) {
                response.error.message = ["Unable to list customers, please try again later"];
            }
            
            return response;
        }

        return response.data;
    },
    deleteUser: async (id) => {
        const response = await httpDelete(`${apiUrlPrefix}/${id}`);
    
        if (response?.error) {
          if (response?.error?.message && response?.error?.message.length < 0) {
            response.error.message = ["Unable to delete user, please try again later"];
          }
          
          return response;
        }
    
        if (response?.status !== 200) {
          return { error: true, message: ["Unable to delete agent user, please try again later"] };
        }
    
        return response.data;
      },
};

export default UserService;