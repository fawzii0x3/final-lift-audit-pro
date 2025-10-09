import { CheckCircle, XCircle, Circle, Keyboard } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChecklistHeaderProps {
  itemNumber: number;
  title: string;
  showKeyboardHints: boolean;
}

export function ChecklistHeader({
  itemNumber,
  title,
  showKeyboardHints,
}: ChecklistHeaderProps) {
  return (
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
  );
}
