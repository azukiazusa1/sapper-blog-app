export type Theme = "system" | "light" | "dark";

export const initTheme = () => {
  if (!("theme" in localStorage) || localStorage.theme === "system") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
    localStorage.theme = "system";
  } else if (localStorage.theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const getTheme = (): Theme => {
  if (!("theme" in localStorage)) {
    return "system";
  }
  if (localStorage.theme === "dark") {
    return "dark";
  }
  if (localStorage.theme === "light") {
    return "light";
  }
  return "system";
};

export const changeTheme = (value: Theme) => {
  switch (value) {
    case "system":
      localStorage.setItem("theme", "system");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      break;
    case "light":
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      break;
    case "dark":
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      break;
  }
};
