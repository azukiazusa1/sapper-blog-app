import secrets from "#lib/server/secrets.js";
import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async () => {
  return {
    isTestBuild: secrets.environments === "test",
  };
};
