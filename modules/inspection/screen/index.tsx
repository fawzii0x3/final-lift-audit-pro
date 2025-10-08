import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InspectionTable } from "../components/table";
import { useNavigate } from "react-router";
import {
  useDeleteInspection,
  useInspectionsList,
  useUserRole,
} from "@modules/shared/api";
import { InspectionFilters, useInspectionFilters } from "../components/filters";
import { InspectionEmptyState } from "../components/EmptyState";
import { InspectionLoadingState } from "../components/EmptyLoadingState";

export function Inspections() {
  const navigate = useNavigate();

  const { inspections, isLoading } = useInspectionsList();
  const role = useUserRole();
  const deleteInspectionMutation = useDeleteInspection();
  const isAdmin = role === "admin";
  const {
    filters,
    showFilters,
    hasActiveFilters,
    updateFilter,
    clearFilters,
    toggleFilters,
  } = useInspectionFilters();
  // const { exporting, exportPDF } = useInspectionActions();

  const handleEditInspection = (inspectionId: string) => {
    navigate(`/inspections/${inspectionId}`);
  };

  const handleCreateInspection = () => {
    navigate("/inspections/new");
  };

  if (isLoading) {
    return <InspectionLoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historique des inspections</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={toggleFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button onClick={handleCreateInspection}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle inspection
          </Button>
        </div>
      </div>

      <InspectionFilters
        filters={filters}
        showFilters={showFilters}
        hasActiveFilters={hasActiveFilters}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
      />

      {inspections.length === 0 ? (
        <InspectionEmptyState onCreateInspection={handleCreateInspection} />
      ) : (
        <InspectionTable
          inspections={inspections}
          loading={isLoading}
          isAdmin={isAdmin}
          exporting={false}
          onExportPDF={() => {}}
          onEditInspection={handleEditInspection}
          onDeleteInspection={deleteInspectionMutation.mutateAsync}
        />
      )}
    </div>
  );
}
