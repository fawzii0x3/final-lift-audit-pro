import { useCallback, type KeyboardEvent, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  Circle,
  Camera,
  MessageSquare,
  Keyboard,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type {
  ChecklistItemData,
  StatusType,
  ChecklistItemProps,
} from "./check-list-item/types";
import { getEquipmentTypeLabel } from "@modules/shared/types";
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
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case "checked_ok":
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case "issue":
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <Circle className="w-8 h-8 text-gray-400" />;
    }
  };

  const handleStatusClick = useCallback(
    (component: ChecklistItemData) => {
      if (disabled) return;

      let newStatus: StatusType;

      // Cycle through: unchecked → checked_ok → issue → unchecked
      if (component.status === "unchecked") {
        newStatus = "checked_ok";
      } else if (component.status === "checked_ok") {
        newStatus = "issue";
      } else {
        newStatus = "unchecked";
      }

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

  // Group components by type for table structure
  const equipmentComponent = components.find(
    (c) => c.component_type === "equipment",
  );
  const hoistComponents = components.filter(
    (c) => c.component_type === "hoist",
  );
  const trolleyComponents = components.filter(
    (c) => c.component_type === "trolley",
  );

  const getTableCellContent = (component: ChecklistItemData | undefined) => {
    if (!component) {
      return <TableCell className="text-center p-4">-</TableCell>;
    }

    const getTooltipText = (status: StatusType) => {
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
    };

    return (
      <TableCell className="text-center p-4 align-top">
        <div className="flex flex-col items-center space-y-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:scale-110"
                  }`}
                  onClick={() => handleStatusClick(component)}
                  onKeyDown={(e) => handleKeyPress(e, component)}
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

          {/* Issue form directly under the status icon */}
          {component.status === "issue" && (
            <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Élément défectueux</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-2">
                  <div>
                    <Label
                      htmlFor={`comment-${component.id}`}
                      className="text-xs font-medium"
                    >
                      Commentaire
                    </Label>
                    <Textarea
                      id={`comment-${component.id}`}
                      value={component.comment || ""}
                      onChange={(e) => {
                        onComponentUpdate(component.id, {
                          comment: e.target.value,
                        });
                      }}
                      placeholder="Describe the issue..."
                      className="mt-1 w-full text-xs"
                      rows={2}
                      disabled={disabled}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium flex items-center gap-2">
                      <Camera className="h-3 w-3" />
                      Photo
                    </Label>
                    <div className="mt-1 w-full">
                      <ImageUpload
                        value={component.validation_image_path}
                        onChange={(imagePath) =>
                          onComponentUpdate(component.id, {
                            validation_image_path: imagePath,
                          })
                        }
                        bucket="attachments"
                        inspectionId={inspectionId}
                        context="check_item"
                        checkItemId={component.id}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      </TableCell>
    );
  };

  return (
    <div className="w-full max-w-none">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-lg font-bold">
                {itemNumber}
              </Badge>
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            {showKeyboardHints && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Keyboard className="w-3 h-3" />
                <span>Use Space/Enter or 1-3 keys</span>
              </div>
            )}
          </div>
          {/* Status legend */}
          {showKeyboardHints && (
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Circle className="w-3 h-3 text-gray-400" />
                <span>1: Unchecked</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>2: OK</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-600" />
                <span>3: Issue</span>
              </div>
            </div>
          )}
        </CardHeader>

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
                      {hoistComponents.length > 1
                        ? `Palan ${index + 1}`
                        : "Palan"}
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
                      {getTableCellContent(hoist)}
                    </Fragment>
                  ))}
                  {trolleyComponents.map((trolley, index) => (
                    <Fragment key={`trolley-cell-${index}`}>
                      {getTableCellContent(trolley)}
                    </Fragment>
                  ))}
                  {equipmentComponent &&
                    getTableCellContent(equipmentComponent)}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
