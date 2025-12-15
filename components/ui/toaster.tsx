"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
          padding: "16px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        },
      }}
    />
  );
}
