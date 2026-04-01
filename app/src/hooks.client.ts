import { getLocale, localizeUrl, localStorageKey } from "$paraglide/runtime";

export async function init() {
  const saved = localStorage.getItem(localStorageKey);
  if (saved) return;

  const detected = getLocale();
  const current = new URL(window.location.href);
  const localized = localizeUrl(current.href, { locale: detected });

  if (localized.href !== current.href) {
    localStorage.setItem(localStorageKey, detected);
    window.location.replace(localized.href);
  }
}
