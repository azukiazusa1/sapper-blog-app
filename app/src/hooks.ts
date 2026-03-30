import { deLocalizeUrl } from "$paraglide/runtime";
import type { Reroute } from "@sveltejs/kit";

export const reroute: Reroute = ({ url }) => {
  return deLocalizeUrl(url).pathname;
};
