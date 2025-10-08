import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkListSchema } from "./schema";
import {
  ChecklistItem,
} from "../components/CheckListItem";
import type { ChecklistItemData } from "../components/check-list-item/types";
// import { StorageImage } from "@/components/ui/storage-image";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  checklistCategories,
  getChecklistIdxByKey,
} from "@modules/shared/types";
import { useCreateArrayForm } from "@modules/shared/components";
import {
  useDraftEquipment,
  useDraftHoists,
  useDraftTrolleys,
  useDraftChecklistItems,
  useDraftCustomItems,
  useDraftStepManagement,
} from "../store";

export function VerificationScreen() {
  const { inspectionId } = useParams<{ inspectionId: string }>();
  const [selectedComponent, setSelectedComponent] =
    useState<ChecklistItemData | null>(null);
  const [customItemName, setCustomItemName] = useState("");
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);

  const { equipment } = useDraftEquipment();
  const { hoists } = useDraftHoists();
  const { trolleys } = useDraftTrolleys();
  const { checklistItems, setChecklistItems, updateChecklistItem } = useDraftChecklistItems();
  const { customItems, setCustomItems } = useDraftCustomItems();
  const { markStepCompleted } = useDraftStepManagement();

  // No need to initialize customItems here - the store handles it

  const generateChecklistItems = useCallback(() => {
    const allCategories = [...checklistCategories, ...(customItems || [])];
    const categories: ChecklistItemData[][] = [];

    allCategories.forEach((category) => {
      const categoryItems: ChecklistItemData[] = [];
      if (equipment) {
        categoryItems.push({
          id: `${category.key}_equipment`,
          item_key: category.key,
          component_type: "equipment",
          component_name: equipment.equipment_type || "Équipement",
          status: "unchecked",
        });
      }

      // Add hoist items
      if (hoists && hoists.length > 0) {
        hoists.forEach((hoist, index) => {
          categoryItems.push({
            id: `${category.key}_hoist_${hoist.id || index}`,
            item_key: category.key,
            component_type: "hoist",
            component_name: `Palan ${index + 1}`,
            component_id: hoist.id,
            status: "unchecked",
          });
        });
      }

      // Add trolley items
      if (trolleys && trolleys.length > 0) {
        trolleys.forEach((trolley, index) => {
          categoryItems.push({
            id: `${category.key}_trolley_${trolley.id || index}`,
            item_key: category.key,
            component_type: "trolley",
            component_name: `Chariot ${index + 1}`,
            component_id: trolley.id,
            status: "unchecked",
          });
        });
      }

      categories.push(categoryItems);
    });

    return categories;
  }, [equipment, hoists, trolleys, customItems]);

  useEffect(() => {
    // Generate checklist items when we have equipment data from store
    if (equipment && (!checklistItems || checklistItems.length === 0)) {
      const generatedItems = generateChecklistItems();
      setChecklistItems(generatedItems);
    }
  }, [equipment, hoists, trolleys, customItems, generateChecklistItems, setChecklistItems]);

  // No need for data loading since we're using store data

  // Add custom item
  function addCustomItem() {
    if (customItemName.trim()) {
      const customKey = customItemName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
      const newCustomItem = { key: customKey, title: customItemName.trim() };
      const currentStates = new Map();
      (checklistItems || []).flat().forEach((item) => {
        currentStates.set(item.id, {
          status: item.status,
          problem_type: item.problem_type,
          comment: item.comment,
          validation_image_path: item.validation_image_path,
          validation_comment: item.validation_comment,
        });
      });

      // Add to custom items
      setCustomItems([...(customItems || []), newCustomItem]);

      // Generate new items for the custom category only
      const newCategoryItems: ChecklistItemData[] = [];

      // Add equipment item for new category
      if (equipment) {
        newCategoryItems.push({
          id: `${customKey}_equipment`,
          item_key: customKey,
          component_type: "equipment",
          component_name: equipment.equipment_type,
          status: "unchecked",
        });
      }

       // Add hoist items for new category
       if (hoists && hoists.length > 0) {
         hoists.forEach((hoist, index) => {
           newCategoryItems.push({
             id: `${customKey}_hoist_${hoist.id || index}`,
             item_key: customKey,
             component_type: "hoist",
             component_name: `Palan ${index + 1}`,
             component_id: hoist.id,
             status: "unchecked",
           });
         });
       }

       // Add trolley items for new category
       if (trolleys && trolleys.length > 0) {
         trolleys.forEach((trolley, index) => {
           newCategoryItems.push({
             id: `${customKey}_trolley_${trolley.id || index}`,
             item_key: customKey,
             component_type: "trolley",
             component_name: `Chariot ${index + 1}`,
             component_id: trolley.id,
             status: "unchecked",
           });
         });
       }

      // Update checklist items by adding the new category
      const updatedChecklistItems = [...(checklistItems || []), newCategoryItems];

      // Restore all previous states
      const restoredItems = updatedChecklistItems.map((category) =>
        category.map((item) => {
          const savedState = currentStates.get(item.id);
          return savedState ? { ...item, ...savedState } : item;
        }),
      );

      setChecklistItems(restoredItems);

      // Update form with all current values including the new custom items
      setTimeout(() => {
        const flattenedItems = restoredItems.flat();
        const updatedCustomItems = [...(customItems || []), newCustomItem];

        const formItems = flattenedItems.map((item) => ({
          item_key: item.item_key,
          component: (item.component_type === "equipment"
            ? "equipment"
            : item.component_type === "hoist"
              ? "palan"
              : "chariot") as "equipment" | "palan" | "chariot",
          component_position: getChecklistIdxByKey(
            item.item_key,
            updatedCustomItems,
          ),
          component_name: item.component_name,
          component_type: item.component_type,
          component_id: item.component_id,
          status: item.status as "unchecked" | "checked_ok" | "issue",
          problem_type: item.problem_type || "",
          comment: item.comment || "",
          is_valid: true,
          validation_image_path: item.validation_image_path,
          validation_comment: item.validation_comment || "",
        }));

        // Update form with the new items array
        form.setValue("items", formItems);
      }, 50);

      setCustomItemName("");
      setShowCustomItemForm(false);
    }
  }

  // Remove custom item
  const removeCustomItem = (keyToRemove: string) => {
    setCustomItems((customItems || []).filter((item: { key: string; title: string }) => item.key !== keyToRemove));
  };

  // Form setup
  const { form, Form } = useCreateArrayForm(checkListSchema, {
    defaultValues: {
      items: [],
    },
  });

  // Handle status changes
  const handleStatusChange = (
    componentId: string,
    status: "unchecked" | "checked_ok" | "issue",
  ) => {
    updateChecklistItem(componentId, { status });
  };

  // Handle component selection for problem form
  const handleComponentSelect = (component: ChecklistItemData) => {
    setSelectedComponent(component);

    // Find the index in the flattened form items
    // const flattenedItems = checklistItems.flat();
    // const index = flattenedItems.findIndex((item) => item.id === component.id);
    // setSelectedItemIndex(index);
  };

  // Handle component updates (comment, image)
  const handleComponentUpdate = (
    componentId: string,
    updates: Partial<ChecklistItemData>,
  ) => {
    updateChecklistItem(componentId, updates);
  };

  // Form submission
  const onSubmit = async () => {
    try {
      // Mark verification step as completed
      markStepCompleted(5); // Mark verification step as completed
      
      toast.success("Liste de vérification sauvegardée avec succès!");
      
      // Navigate to preview step
      // navigate(Routes.INSPECTIONS_NEW.PREVIEW.replace(':inspectionId', inspectionId || ''));
    } catch (error) {
      console.error("Error saving checklist:", error);
      toast.error(
        "Erreur lors de la sauvegarde de la liste de vérification. Veuillez vérifier les champs requis et réessayer.",
      );
    }
  };

  // Show loading state only if we don't have equipment data yet
  if (!equipment) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Chargement des données d'équipement...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-none">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Liste de Vérification</CardTitle>
        </CardHeader>

        <CardContent className="w-full">
          <Form submitHandler={onSubmit} className="space-y-8">
            {/* Full Width Checklist Items */}
            <div className="w-full space-y-8">
              {[...checklistCategories, ...(customItems || [])].map(
                (category, categoryIndex) => (
                  <div key={category.key} className="relative w-full">
                    <ChecklistItem
                      itemNumber={categoryIndex + 1}
                      itemKey={category.key}
                      title={category.title}
                      components={checklistItems?.[categoryIndex] || []}
                      onStatusChange={handleStatusChange}
                      onComponentSelect={handleComponentSelect}
                      onComponentUpdate={handleComponentUpdate}
                      selectedComponentId={selectedComponent?.id}
                      inspectionId={inspectionId}
                    />
                    {/* Remove button for custom items */}
                    {(customItems || []).some((item) => item.key === category.key) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomItem(category.key)}
                        className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        title="Delete custom item"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ),
              )}

              {/* Add Custom Item Section */}
              <Card className="border-dashed border-2 w-full">
                <CardContent className="p-6">
                  {!showCustomItemForm ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCustomItemForm(true)}
                      className="w-full justify-center"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un élément personnalisé
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Label htmlFor="customItemName">
                        Nom de l’élément personnalisé
                      </Label>
                      <Input
                        id="customItemName"
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        placeholder="Enter custom item name..."
                        className="w-full"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomItem();
                          } else if (e.key === "Escape") {
                            setShowCustomItemForm(false);
                            setCustomItemName("");
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={addCustomItem}
                          disabled={!customItemName.trim()}
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowCustomItemForm(false);
                            setCustomItemName("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Defective Items Summary */}
            {(() => {
              const defectiveItems = (checklistItems || [])
                .flat()
                .filter((item) => item.status === "issue");
              if (defectiveItems.length > 0) {
                return (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-800">
                        Résumé des éléments défectueux
                      </CardTitle>
                      <CardDescription className="text-red-700">
                        {defectiveItems.length} élément
                        {defectiveItems.length > 1 ? "s" : ""} nécessitant une
                        attention
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-red-200">
                              <th className="text-left p-3 font-medium text-red-800">
                                Élément défectueux
                              </th>
                              <th className="text-left p-3 font-medium text-red-800">
                                Commentaire
                              </th>
                              <th className="text-left p-3 font-medium text-red-800">
                                Photo
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {defectiveItems.map((item) => {
                              // Find the original checklist item number
                               const allCategories = [
                                 ...checklistCategories,
                                 ...(customItems || []),
                               ];
                              const categoryIndex = allCategories.findIndex(
                                (cat) => cat.key === item.item_key,
                              );
                              const itemNumber = categoryIndex + 1;

                              return (
                                <tr
                                  key={item.id}
                                  className="border-b border-red-100"
                                >
                                  <td className="p-3 font-medium text-sm">
                                    {itemNumber} -{" "}
                                    {(
                                      checklistCategories.find(
                                        (cat) => cat.key === item.item_key,
                                      )?.title ||
                                       (customItems || []).find(
                                         (cat) => cat.key === item.item_key,
                                       )?.title ||
                                      item.item_key
                                    ).toUpperCase()}{" "}
                                    ({item.component_name})
                                  </td>
                                  <td className="p-3 text-sm">
                                    {item.comment || "Aucun commentaire"}
                                  </td>
                                  <td className="p-3">
                                    {/*<StorageImage*/}
                                    {/*  storagePath={*/}
                                    {/*    item.validation_image_path || ""*/}
                                    {/*  }*/}
                                    {/*  alt="Photo de validation"*/}
                                    {/*  className="w-16 h-16 object-cover rounded border"*/}
                                    {/*  fallback={*/}
                                    {/*    <span className="text-gray-400 text-sm">*/}
                                    {/*      Aucune photo*/}
                                    {/*    </span>*/}
                                    {/*  }*/}
                                    {/*/>*/}
                                    <span className="text-gray-400 text-sm">
                                      Aucune photo
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })()}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                size="lg"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer et continuer"
                )}
              </Button>
            </div>
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.entries(form.formState.errors).map(([key, error]) => (
                    <li key={key}>
                      • {error?.message?.toString() || `Error in ${key}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
