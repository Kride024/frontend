// apps/rentals/src/router.tsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "@pages/Landing";
import RentalsApp from "./App";

// THIS WORKS 100% — Use relative path from monorepo root
const StudioApp = React.lazy(() => import("../../studio/src/App"));
const PGApp = React.lazy(() => import("../../pg/src/App"));

export default function AppRouter() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen text-2xl font-bold bg-gray-100">
        Loading App...
      </div>
    }>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/rentals/*" element={<RentalsApp />} />
        <Route path="/studio/*" element={<StudioApp />} />
        <Route path="/pg/*" element={<PGApp />} />
        <Route path="*" element={<div className="p-20 text-4xl text-center">404 - Not Found</div>} />
      </Routes>
    </Suspense>
  );
}