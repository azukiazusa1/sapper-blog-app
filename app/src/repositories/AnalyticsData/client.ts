import { BetaAnalyticsDataClient } from "@google-analytics/data";
import secrets from "$lib/server/secrets";

export const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    private_key: secrets.privateKey,
    client_email: secrets.clientEmail,
  },
});
