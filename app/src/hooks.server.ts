import type { Handle } from "@sveltejs/kit/hooks";
import "@inlang/paraglide-js/urlpattern-polyfill";
import { paraglideMiddleware } from "$paraglide/server";

export const handle: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    return resolve(
      { ...event, request },
      {
        transformPageChunk: ({ html }) =>
          html.replace("%paraglide.lang%", locale),
      },
    );
  });
