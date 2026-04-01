import {
  localizeUrl,
  localStorageKey,
  locales,
  baseLocale,
} from "$paraglide/runtime";
import type { ClientInit } from "@sveltejs/kit";

// navigator.languages を優先して言語を切り替える
export const init: ClientInit = () => {
  // ユーザーが明示的に言語を切り替えていたら何もしない
  const saved = localStorage.getItem(localStorageKey);
  if (saved) return;

  // getLocale() はURLからも言語を検出するため、直接 navigator.languages を参照する
  const preferred = (navigator.languages
    .map((lang) => lang.split("-")[0].toLowerCase())
    .find((lang) => (locales as readonly string[]).includes(lang)) ??
    baseLocale) as (typeof locales)[number];

  const current = new URL(window.location.href);
  const localized = localizeUrl(current.href, { locale: preferred });

  if (localized.href !== current.href) {
    localStorage.setItem(localStorageKey, preferred);
    window.location.replace(localized.href);
  }
};
