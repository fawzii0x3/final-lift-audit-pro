import { useCallback, type KeyboardEvent } from "react";
import type { ChecklistItemData, StatusType } from "./types";
import { cycleStatus } from "./utils";

export function useStatusHandlers(
  disabled: boolean,
  onStatusChange: (componentId: string, status: StatusType) => void,
  onComponentSelect: (component: ChecklistItemData) => void,
) {
  const handleStatusClick = useCallback(
    (component: ChecklistItemData) => {
      if (disabled) return;

      const newStatus = cycleStatus(component.status);
      onStatusChange(component.id, newStatus);

      if (newStatus === "issue") {
        onComponentSelect(component);
      }
    },
    [disabled, onStatusChange, onComponentSelect],
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, component: ChecklistItemData) => {
      if (disabled) return;

      // Space or Enter to toggle status
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        handleStatusClick(component);
      }
      // Number keys for direct status setting
      else if (event.key >= "1" && event.key <= "3") {
        event.preventDefault();
        const statusMap = {
          "1": "unchecked" as const,
          "2": "checked_ok" as const,
          "3": "issue" as const,
        };
        const newStatus = statusMap[event.key as "1" | "2" | "3"];
        onStatusChange(component.id, newStatus);

        if (newStatus === "issue") {
          onComponentSelect(component);
        }
      }
    },
    [disabled, handleStatusClick, onStatusChange, onComponentSelect],
  );

  return {
    handleStatusClick,
    handleKeyPress,
  };
}
