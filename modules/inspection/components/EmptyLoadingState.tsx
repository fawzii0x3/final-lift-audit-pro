export function InspectionLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historique des inspections</h1>
      </div>
      <div className="animate-pulse">
        <div className="bg-muted rounded-lg h-96"></div>
      </div>
    </div>
  );
}
