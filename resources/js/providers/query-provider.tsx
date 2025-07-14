import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
                if (error?.response?.status >= 400 && error?.response?.status < 500) {
                    return false;
                }
                return failureCount < 3;
            },
            staleTime: 5 * 60 * 1000,
        },
        mutations: {
            retry: false,
        },
    },
});

interface QueryProviderProps {
    children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
