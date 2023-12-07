import { httpGet } from "../../rest-api";

const AgentAnalyticsService = {
    getTokensDetails: async () => {
        try {
            const response = await httpGet("agent/analytics/tokens?start=2023-01-01&end=2023-12-31");
            return response;
        }
        catch (error) {
            console.error("Error while fetching tokens details", error);
            return null;
        }
    }
}

export default AgentAnalyticsService;