import { Keyboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ChecklistItemData } from "./types";
import { getStatusIcon, getTooltipText } from "./utils";

interface StatusIconProps {
  component: ChecklistItemData;
  disabled: boolean;
  showKeyboardHints: boolean;
  onStatusClick: (component: ChecklistItemData) => void;
  onKeyPress: (
    event: React.KeyboardEvent<HTMLDivElement>,
    component: ChecklistItemData,
  ) => void;
}

export function StatusIcon({
  component,
  disabled,
  showKeyboardHints,
  onStatusClick,
  onKeyPress,
}: StatusIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:scale-110"
            }`}
            onClick={() => onStatusClick(component)}
            onKeyDown={(e) => onKeyPress(e, component)}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-label={`${component.component_name} status: ${component.status}`}
            aria-disabled={disabled}
          >
            {getStatusIcon(component.status)}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p>{getTooltipText(component.status)}</p>
            {showKeyboardHints && !disabled && (
              <div className="text-xs mt-1 text-muted-foreground">
                <Keyboard className="inline w-3 h-3 mr-1" />
                Space/Enter to toggle • 1-3 for direct status
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
