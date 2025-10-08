import { TanStackProvider } from "@modules/shared/tanstack";
import { AuthProvider } from "@modules/shared/auth/provider.tsx";
import {
  OfflineIndicator,
  useBackgroundSync,
  registerServiceWorker,
  startPeriodicCleanup,
} from "@modules/shared/offline";
import { Toaster } from "sonner";
import { useEffect } from "react";
import "./i18n";
import type { PropsWithChildren } from "react";

function App({ children }: PropsWithChildren) {
  // Initialize offline capabilities
  useBackgroundSync();

  useEffect(() => {
    // Register service worker for background sync
    registerServiceWorker();

    // Start periodic cleanup of expired items
    startPeriodicCleanup();
  }, []);

  return (
    <TanStackProvider>
      <AuthProvider>
        {children}
        <OfflineIndicator />
        <Toaster />
      </AuthProvider>
    </TanStackProvider>
  );
}

export default App;
