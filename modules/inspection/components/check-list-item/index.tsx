import { Card } from "@/components/ui/card";
import type { ChecklistItemProps } from "./types";
import { groupComponentsByType } from "./utils";
import { useStatusHandlers } from "./hooks";
import { ChecklistHeader } from "./ChecklistHeader";
import { ChecklistTable } from "./ChecklistTable";

export function ChecklistItem({
  itemNumber,
  title,
  components,
  onStatusChange,
  onComponentSelect,
  onComponentUpdate,
  inspectionId,
  disabled = false,
  showKeyboardHints = false,
}: ChecklistItemProps) {
  const { handleStatusClick, handleKeyPress } = useStatusHandlers(
    disabled,
    onStatusChange,
    onComponentSelect,
  );

  const { equipmentComponent, hoistComponents, trolleyComponents } =
    groupComponentsByType(components);

  return (
    <div className="w-full max-w-none">
      <Card className="w-full">
        <ChecklistHeader
          itemNumber={itemNumber}
          title={title}
          showKeyboardHints={showKeyboardHints}
        />
        <ChecklistTable
          hoistComponents={hoistComponents}
          trolleyComponents={trolleyComponents}
          equipmentComponent={equipmentComponent}
          disabled={disabled}
          showKeyboardHints={showKeyboardHints}
          inspectionId={inspectionId}
          onStatusClick={handleStatusClick}
          onKeyPress={handleKeyPress}
          onComponentUpdate={onComponentUpdate}
        />
      </Card>
    </div>
  );
}
