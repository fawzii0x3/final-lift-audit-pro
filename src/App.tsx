import { TanStackProvider } from "@modules/shared/tanstack";
import { AuthProvider } from "@modules/shared/auth/provider.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Toaster } from "sonner";
import "./i18n";

function App() {
  return (
    <TanStackProvider>
      <AuthProvider>
        <Button>hello world</Button>
        <Toaster />
      </AuthProvider>
    </TanStackProvider>
  );
}

export default App;
