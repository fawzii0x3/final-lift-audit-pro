import { Fragment } from "react";
import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEquipmentTypeLabel } from "@modules/shared/types";
import type { ChecklistItemData } from "./types";
import { ComponentTableCell } from "./ComponentTableCell";

interface ChecklistTableProps {
  hoistComponents: ChecklistItemData[];
  trolleyComponents: ChecklistItemData[];
  equipmentComponent: ChecklistItemData | undefined;
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

export function ChecklistTable({
  hoistComponents,
  trolleyComponents,
  equipmentComponent,
  disabled,
  showKeyboardHints,
  inspectionId,
  onStatusClick,
  onKeyPress,
  onComponentUpdate,
}: ChecklistTableProps) {
  return (
    <CardContent className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {hoistComponents.map((_, index) => (
                <TableHead
                  key={`hoist-${index}`}
                  className="text-center p-4 min-w-[120px]"
                >
                  {hoistComponents.length > 1 ? `Palan ${index + 1}` : "Palan"}
                </TableHead>
              ))}
              {trolleyComponents.map((_, index) => (
                <TableHead
                  key={`trolley-${index}`}
                  className="text-center p-4 min-w-[120px]"
                >
                  {trolleyComponents.length > 1
                    ? `Chariot ${index + 1}`
                    : "Chariot"}
                </TableHead>
              ))}
              {equipmentComponent && (
                <TableHead className="text-center p-4 min-w-[120px]">
                  {getEquipmentTypeLabel(equipmentComponent.component_name)}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {hoistComponents.map((hoist, index) => (
                <Fragment key={`hoist-cell-${index}`}>
                  <ComponentTableCell
                    component={hoist}
                    disabled={disabled}
                    showKeyboardHints={showKeyboardHints}
                    inspectionId={inspectionId}
                    onStatusClick={onStatusClick}
                    onKeyPress={onKeyPress}
                    onComponentUpdate={onComponentUpdate}
                  />
                </Fragment>
              ))}
              {trolleyComponents.map((trolley, index) => (
                <Fragment key={`trolley-cell-${index}`}>
                  <ComponentTableCell
                    component={trolley}
                    disabled={disabled}
                    showKeyboardHints={showKeyboardHints}
                    inspectionId={inspectionId}
                    onStatusClick={onStatusClick}
                    onKeyPress={onKeyPress}
                    onComponentUpdate={onComponentUpdate}
                  />
                </Fragment>
              ))}
              {equipmentComponent && (
                <ComponentTableCell
                  component={equipmentComponent}
                  disabled={disabled}
                  showKeyboardHints={showKeyboardHints}
                  inspectionId={inspectionId}
                  onStatusClick={onStatusClick}
                  onKeyPress={onKeyPress}
                  onComponentUpdate={onComponentUpdate}
                />
              )}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </CardContent>
  );
}
