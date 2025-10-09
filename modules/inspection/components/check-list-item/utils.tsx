import { CheckCircle, XCircle, Circle } from "lucide-react";
import type { ChecklistItemData, StatusType } from "./types";

export function getStatusIcon(status: StatusType) {
  switch (status) {
    case "checked_ok":
      return <CheckCircle className="w-8 h-8 text-green-600" />;
    case "issue":
      return <XCircle className="w-8 h-8 text-red-600" />;
    default:
      return <Circle className="w-8 h-8 text-gray-400" />;
  }
}

export function getTooltipText(status: StatusType) {
  switch (status) {
    case "unchecked":
      return "Click to mark as OK";
    case "checked_ok":
      return "Click to mark as Issue";
    case "issue":
      return "Click to reset";
    default:
      return "Click to change status";
  }
}

export function cycleStatus(currentStatus: StatusType): StatusType {
  // Cycle through: unchecked → checked_ok → issue → unchecked
  if (currentStatus === "unchecked") {
    return "checked_ok";
  } else if (currentStatus === "checked_ok") {
    return "issue";
  } else {
    return "unchecked";
  }
}

export function groupComponentsByType(components: ChecklistItemData[]) {
  const equipmentComponent = components.find(
    (c) => c.component_type === "equipment",
  );
  const hoistComponents = components.filter(
    (c) => c.component_type === "hoist",
  );
  const trolleyComponents = components.filter(
    (c) => c.component_type === "trolley",
  );

  return {
    equipmentComponent,
    hoistComponents,
    trolleyComponents,
  };
}
