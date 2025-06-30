"use client";

import { useEffect } from "react";

const SecurityWrapper = ({ children }) => {
  useEffect(() => {
    const handleDevToolsOpen = () => {
      if (
        window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 200
      ) {
        console.warn("Developer tools are open!");
      }
    };

    window.addEventListener("resize", handleDevToolsOpen);
    window.addEventListener("focus", handleDevToolsOpen);

    return () => {
      window.removeEventListener("resize", handleDevToolsOpen);
      window.removeEventListener("focus", handleDevToolsOpen);
    };
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Windows/Linux shortcuts
      if (
        (event.ctrlKey &&
          event.shiftKey &&
          (event.key === "I" ||
            event.key === "i" ||
            event.key === "J" ||
            event.key === "j" ||
            event.key === "C" ||
            event.key === "c")) ||
        event.key === "F12"
      ) {
        event.preventDefault();
      }

      // macOS shortcuts
      if (
        (event.metaKey &&
          event.altKey &&
          (event.key === "I" ||
            event.key === "i" ||
            event.key === "J" ||
            event.key === "j" ||
            event.key === "C" ||
            event.key === "c" ||
            event.key === "K" ||
            event.key === "k")) ||
        (event.metaKey && event.shiftKey && event.key === "C")
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return <>{children}</>;
};

export default SecurityWrapper;
