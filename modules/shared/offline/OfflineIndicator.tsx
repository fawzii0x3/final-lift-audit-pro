import { useNetworkStatus } from "./network";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const isOnline = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="destructive" className="flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        Offline Mode
      </Badge>
    </div>
  );
}

export function OnlineIndicator() {
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="default" className="flex items-center gap-2">
        <Wifi className="h-4 w-4" />
        Online
      </Badge>
    </div>
  );
}
