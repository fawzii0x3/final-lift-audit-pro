import { TableCell } from "@/components/ui/table";
import type { ChecklistItemData } from "./types";
import { StatusIcon } from "./StatusIcon";
import { IssueForm } from "./IssueForm";

interface ComponentTableCellProps {
  component: ChecklistItemData | undefined;
  disabled: boolean;
  showKeyboardHints: boolean;
  inspectionId?: string;
  onStatusClick: (component: ChecklistItemData) => void;
  onKeyPress: (
    event: React.KeyboardEvent<HTMLDivElement>,
    component: ChecklistItemData,
  ) => void;
  onComponentUpdate: (
    componentId: string,
    updates: Partial<ChecklistItemData>,
  ) => void;
}

export function ComponentTableCell({
  component,
  disabled,
  showKeyboardHints,
  inspectionId,
  onStatusClick,
  onKeyPress,
  onComponentUpdate,
}: ComponentTableCellProps) {
  if (!component) {
    return <TableCell className="text-center p-4">-</TableCell>;
  }

  return (
    <TableCell className="text-center p-4 align-top">
      <div className="flex flex-col items-center space-y-4">
        <StatusIcon
          component={component}
          disabled={disabled}
          showKeyboardHints={showKeyboardHints}
          onStatusClick={onStatusClick}
          onKeyPress={onKeyPress}
        />

        {/* Issue form directly under the status icon */}
        {component.status === "issue" && (
          <IssueForm
            component={component}
            disabled={disabled}
            inspectionId={inspectionId}
            onUpdate={onComponentUpdate}
          />
        )}
      </div>
    </TableCell>
  );
}
