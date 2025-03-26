import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const init = () => {
  let isContainer = document.querySelector("#voxxyfy-extension");

  if (!isContainer) {
    isContainer = document.createElement("div");
    isContainer.id = "voxxyfy-extension";
    document.body.appendChild(isContainer);
    isContainer = document.querySelector("#voxxyfy-extension");
  }
  createRoot(isContainer).render(<App />);
};

init();
