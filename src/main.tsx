import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GencowProvider } from "@gencow/react";
import { apiClient } from "./lib/gencow";
import App from "./App";
import "./styles.css";
import "./extended.css";
import "./strategy.css";
import "./schedule.css";
import "./applications.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GencowProvider apiClient={apiClient}>
      <App />
    </GencowProvider>
  </StrictMode>,
);
