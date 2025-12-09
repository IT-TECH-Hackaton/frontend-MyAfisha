import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "@shared/constants/queryClient";
import { Toaster } from "@shared/ui/toaster";

import { routes } from "./router";

export const Providers = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={routes} />
    <Toaster />
  </QueryClientProvider>
);
