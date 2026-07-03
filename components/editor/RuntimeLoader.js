"use client";

import { useEffect } from "react";

export default function RuntimeLoader() {
  useEffect(() => {
    if (window.__PATHFORGE_RUNTIME_LOADED__) return;
    window.__PATHFORGE_RUNTIME_LOADED__ = true;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "/editorRuntime.js";
    document.body.appendChild(script);
  }, []);

  return null;
}
