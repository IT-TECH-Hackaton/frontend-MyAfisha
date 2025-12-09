import { createRoot } from "react-dom/client";

import { Providers } from "@app/providers";

import "./assets/index.css";

const initTheme = () => {
  const stored = localStorage.getItem("theme");
  const root = document.documentElement;
  if (stored === "dark") {
    root.classList.add("dark");
  } else if (stored === "light") {
    root.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
};

initTheme();

createRoot(document.getElementById("root")!).render(<Providers />);
