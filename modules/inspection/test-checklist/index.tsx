import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useCreateArrayForm } from "@modules/shared/components/form/use-form";
import type { ChecklistItemData } from "../components/check-list-item/types";
import { z } from "zod";

// Mock data for testing
const mockComponents: ChecklistItemData[] = [
  {
    id: "hoist-1",
    item_key: "hoist_1",
    component_type: "hoist",
    component_name: "Palan Principal",
    component_id: "hoist-1",
    status: "unchecked",
  },
  {
    id: "hoist-2",
    item_key: "hoist_2",
    component_type: "hoist",
    component_name: "Palan Secondaire",
    component_id: "hoist-2",
    status: "checked_ok",
  },
  {
    id: "trolley-1",
    item_key: "trolley_1",
    component_type: "trolley",
    component_name: "Chariot Principal",
    component_id: "trolley-1",
    status: "issue",
    comment: "Test issue comment",
  },
  {
    id: "equipment-1",
    item_key: "equipment_1",
    component_type: "equipment",
    component_name: "Pont Roulant",
    component_id: "equipment-1",
    status: "unchecked",
  },
];

// Schema for the form
const testChecklistSchema = z.object({
  checklistItems: z.array(
    z.object({
      itemNumber: z.number(),
      itemKey: z.string(),
      title: z.string(),
      components: z.array(
        z.object({
          id: z.string(),
          item_key: z.string(),
          component_type: z.enum(["hoist", "trolley", "equipment"]),
          component_name: z.string(),
          component_id: z.string().optional(),
          status: z.enum(["unchecked", "checked_ok", "issue"]),
          comment: z.string().optional(),
          image_path: z.string().optional(),
          problem_type: z.string().optional(),
          validation_image_path: z.string().optional(),
          validation_comment: z.string().optional(),
        }),
      ),
    }),
  ),
});

const mockChecklistItems = [
  {
    itemNumber: 1,
    itemKey: "test_item_1",
    title: "Test Item - Vérification des composants",
    components: mockComponents,
  },
  {
    itemNumber: 2,
    itemKey: "test_item_2",
    title: "Test Item - Vérification des freins",
    components: [
      {
        id: "brake-1",
        item_key: "brake_1",
        component_type: "equipment" as const,
        component_name: "Frein Principal",
        component_id: "brake-1",
        status: "unchecked" as const,
      },
    ],
  },
];

export function TestChecklistPage() {
  const { createArrayField, useArrayField, Form } = useCreateArrayForm(
    testChecklistSchema,
    {
      defaultValues: {
        checklistItems: mockChecklistItems,
      },
    },
  );

  const { fields, append, remove } = useArrayField("checklistItems");

  // Create the array field component
  const ChecklistItemField = createArrayField("checklistItems");

  const handleSubmit = (data: z.infer<typeof testChecklistSchema>) => {
    console.log("Form submitted:", data);
  };

  const resetData = () => {
    // Reset form to initial values
  };

  const addChecklistItem = () => {
    const newItem = {
      itemNumber: fields.length + 1,
      itemKey: `test_item_${fields.length + 1}`,
      title: `Test Item ${fields.length + 1} - New Item`,
      components: [
        {
          id: `new-component-${fields.length + 1}`,
          item_key: `new_component_${fields.length + 1}`,
          component_type: "equipment" as const,
          component_name: "New Component",
          component_id: `new-component-${fields.length + 1}`,
          status: "unchecked" as const,
        },
      ],
    };
    append(newItem);
  };

  const removeChecklistItem = (index: number) => {
    remove(index);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>CheckListItem Component Test</CardTitle>
            <Button onClick={resetData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Test the refactored CheckListItem component integrated with the
            dynamic array form system. This demonstrates how the modular
            component works within the form framework with array management
            capabilities.
          </p>
          <Form submitHandler={handleSubmit} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Checklist Item {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeChecklistItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
                <ChecklistItemField
                  index={index}
                  fieldName="itemNumber"
                  type="checklist"
                  props={{
                    inspectionId: "test-inspection",
                    disabled: false,
                    showKeyboardHints: true,
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2 flex-wrap">
              <Button type="submit">Submit Form</Button>
              <Button type="button" variant="outline" onClick={resetData}>
                Reset
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={addChecklistItem}
              >
                Add Checklist Item
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
