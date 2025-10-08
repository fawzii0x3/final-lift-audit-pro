import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InspectionFiltersType } from "./hooks";

interface InspectionFiltersProps {
  filters: InspectionFiltersType;
  showFilters: boolean;
  hasActiveFilters: boolean;
  onUpdateFilter: (
    key: keyof InspectionFiltersType,
    value: string | undefined,
  ) => void;
  onClearFilters: () => void;
}

export function InspectionFilters({
  filters,
  showFilters,
  hasActiveFilters,
  onUpdateFilter,
  onClearFilters,
}: InspectionFiltersProps) {
  if (!showFilters) return null;

  return (
    <div className="bg-card p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filtres</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Effacer
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="year">Année</Label>
          <Select
            value={filters.year || ""}
            onValueChange={(value) =>
              onUpdateFilter("year", value || undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: 5 },
                (_, i) => new Date().getFullYear() - i,
              ).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="month">Mois</Label>
          <Select
            value={filters.month || ""}
            onValueChange={(value) =>
              onUpdateFilter("month", value || undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {new Date(0, month - 1).toLocaleDateString("fr-FR", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="day">Jour</Label>
          <Select
            value={filters.day || ""}
            onValueChange={(value) => onUpdateFilter("day", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Jour" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="equipment">Numéro d'équipement</Label>
          <Input
            id="equipment"
            placeholder="Rechercher..."
            value={filters.equipmentNumber || ""}
            onChange={(e) =>
              onUpdateFilter("equipmentNumber", e.target.value || undefined)
            }
          />
        </div>
      </div>
    </div>
  );
}
