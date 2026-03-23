import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

type TonedeafQueryClientProviderProps = {
    children: React.ReactNode;
};

export function TonedeafQueryClientProvider({ children }: TonedeafQueryClientProviderProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
