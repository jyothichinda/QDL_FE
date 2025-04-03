import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const mount = (el) => {
  createRoot(el).render(<App />);
};

if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#_fraudcontrol-root");

  if (devRoot) mount(devRoot);
}

export { mount };
