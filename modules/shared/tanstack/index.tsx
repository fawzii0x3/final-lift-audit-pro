import {QueryClient} from '@tanstack/react-query'
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister'
import type {PropsWithChildren} from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
})

const asyncStoragePersister = createAsyncStoragePersister({
    storage: window.localStorage,
})

export function TanStackProvider({children}: PropsWithChildren) {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{persister: asyncStoragePersister}}
        >
            {children}
        </PersistQueryClientProvider>
    )
}

