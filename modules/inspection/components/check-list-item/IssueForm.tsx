import { Camera, MessageSquare, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ChecklistItemData } from "./types";

interface IssueFormProps {
  component: ChecklistItemData;
  disabled: boolean;
  inspectionId?: string;
  onUpdate: (componentId: string, updates: Partial<ChecklistItemData>) => void;
}

export function IssueForm({
  component,
  disabled,
  inspectionId,
  onUpdate,
}: IssueFormProps) {
  return (
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
                onUpdate(component.id, {
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
                  onUpdate(component.id, {
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
  );
}
