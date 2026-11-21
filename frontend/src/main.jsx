
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Khong tim thay phan tu #root trong index.html"
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);