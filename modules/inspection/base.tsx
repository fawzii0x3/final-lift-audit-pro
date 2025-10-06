import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InspectionStepper } from "./components/stepper";
import { ClientInfo } from "./client";
import { useNavigate } from "react-router";

export function InspectionNew() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <InspectionStepper
        currentStep={0}
        onStepClick={(step) => {}}
        completedSteps={[0]}
      />
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/inspections")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux inspections
          </Button>

          <div className="flex items-center space-x-2">
            {/*<Button variant="outline" onClick={clearDraft} disabled={loading}>*/}
            {/*  Effacer le brouillon*/}
            {/*</Button>*/}

            {/*{draft.currentStep > 1 && (*/}
            {/*  <Button*/}
            {/*    variant="outline"*/}
            {/*    onClick={handlePrevious}*/}
            {/*    disabled={loading}*/}
            {/*  >*/}
            {/*    <ArrowLeft className="mr-2 h-4 w-4" />*/}
            {/*    Précédent*/}
            {/*  </Button>*/}
            {/*)}*/}
          </div>
        </div>

        <div className="w-full">
          <Card>
            <CardContent className="p-6 w-full">
              <ClientInfo />
              {/*<div className="flex items-center justify-between mt-8 pt-6 border-t">*/}
              {/*  <Button*/}
              {/*    variant="outline"*/}
              {/*    onClick={handlePrevious}*/}
              {/*    disabled={draft.currentStep === 1 || loading}*/}
              {/*    className="flex items-center space-x-2"*/}
              {/*  >*/}
              {/*    <ArrowLeft className="w-4 h-4" />*/}
              {/*    <span>Précédent</span>*/}
              {/*  </Button>*/}

              {/*  <div className="text-sm text-muted-foreground">*/}
              {/*    Étape {draft.currentStep} de 6*/}
              {/*  </div>*/}

              {/*  <Button*/}
              {/*    variant="outline"*/}
              {/*    onClick={handleNext}*/}
              {/*    disabled={draft.currentStep === 6 || loading}*/}
              {/*    className="flex items-center space-x-2"*/}
              {/*  >*/}
              {/*    <span>*/}
              {/*      {draft.currentStep === 6 ? "Terminer" : "Suivant"}*/}
              {/*    </span>*/}
              {/*    <ArrowRight className="w-4 h-4" />*/}
              {/*  </Button>*/}
              {/*</div>*/}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
