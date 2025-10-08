import type { InspectionsType } from "@modules/shared/api";

export function getEquipmentNumber(inspection: InspectionsType): string {
  const equipment = Array.isArray(inspection.equipment)
    ? inspection.equipment[0]?.equipment_number
    : undefined;
  return equipment || "#" + inspection.id.slice(0, 8);
}
