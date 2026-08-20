"use client";

import { useEffect, useState } from "react";

const KEY = "desk-theme";

/** A panel switch, not a sun and a moon. The label reads the position it is
 *  currently in; the accessible name says what pressing it will do. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // The inline script in the document head has already set this before paint.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function flip() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Private browsing. The choice just will not survive a reload.
    }
  }

  return (
    <button
      className="tog"
      type="button"
      onClick={flip}
      aria-pressed={theme === "light"}
      aria-label={`Switch to the ${theme === "light" ? "dark" : "light"} desk`}
      title={`Switch to the ${theme === "light" ? "dark" : "light"} desk`}
    >
      <span className="tog__track" aria-hidden="true"><span className="tog__cap" /></span>
      <span className="tog__label" aria-hidden="true">{theme === "light" ? "Light" : "Dark"}</span>
    </button>
  );
}
