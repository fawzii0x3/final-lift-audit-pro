import { TanStackProvider } from "@modules/shared/tanstack";
import { AuthProvider } from "@modules/shared/auth/provider.tsx";
import { Toaster } from "sonner";
import "./i18n";
import type { PropsWithChildren } from "react";

function App({ children }: PropsWithChildren) {
  return (
    <TanStackProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </TanStackProvider>
  );
}

export default App;
