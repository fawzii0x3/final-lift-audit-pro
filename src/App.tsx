import { TanStackProvider } from "@modules/shared/tanstack";
import { AuthProvider } from "@modules/shared/auth/provider.tsx";
import {
  OfflineIndicator,
  useBackgroundSync,
} from "@modules/shared/offline";
import { Toaster } from "sonner";
import "./i18n";
import type { PropsWithChildren } from "react";

function App({ children }: PropsWithChildren) {
  // Initialize offline capabilities
  useBackgroundSync();

  // Disable service worker registration for now since we're using store
  // useEffect(() => {
  //   // Register service worker for background sync
  //   registerServiceWorker();

  //   // Start periodic cleanup of expired items
  //   startPeriodicCleanup();
  // }, []);

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
