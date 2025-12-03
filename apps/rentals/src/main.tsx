// apps/rentals/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./global.css"; // or your global styles
import { AuthProvider } from "@pg/app/shared/hooks/context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <App />
     </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);