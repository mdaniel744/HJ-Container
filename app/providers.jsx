"use client";

import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { AltPathProvider } from "@/lib/AltPath";
import { queryClientInstance } from "@/lib/query-client";

function RouteFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
    </div>
  );
}

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <AltPathProvider>
          <CartProvider>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>{children}</Suspense>
          </CartProvider>
        </AltPathProvider>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
