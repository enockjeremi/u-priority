"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import React, { ReactNode } from "react";

export const queryClient = new QueryClient();

const QueryClientServerProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientServerProvider;
