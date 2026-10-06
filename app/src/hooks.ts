import type { Reroute } from "@sveltejs/kit/hooks";
import { deLocalizeUrl } from "$paraglide/runtime";

export const reroute: Reroute = ({ url }) => {
  return deLocalizeUrl(url).pathname;
};
