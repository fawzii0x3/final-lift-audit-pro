export type StatusType = "unchecked" | "checked_ok" | "issue";

export interface ChecklistItemData {
  id: string;
  item_key: string;
  component_type: "hoist" | "trolley" | "equipment";
  component_name: string;
  component_id?: string;
  status: StatusType;
  comment?: string;
  image_path?: string;
  problem_type?: string;
  validation_image_path?: string;
  validation_comment?: string;
}

export interface ChecklistItemProps {
  itemNumber: number;
  itemKey: string;
  title: string;
  components: ChecklistItemData[];
  onStatusChange: (componentId: string, status: StatusType) => void;
  onComponentSelect: (component: ChecklistItemData) => void;
  onComponentUpdate: (
    componentId: string,
    updates: Partial<ChecklistItemData>,
  ) => void;
  selectedComponentId?: string;
  inspectionId?: string;
  disabled?: boolean;
  showKeyboardHints?: boolean;
}
