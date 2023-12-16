import secrets from "$lib/server/secrets";
import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async () => {
  return {
    isTestBuild: secrets.environments === "test",
  };
};
