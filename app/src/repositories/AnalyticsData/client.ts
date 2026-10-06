import { BetaAnalyticsDataClient } from "@google-analytics/data";
import secrets from "#lib/server/secrets.js";

export const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    private_key: secrets.privateKey,
    client_email: secrets.clientEmail,
  },
});
