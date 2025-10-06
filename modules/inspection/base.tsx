import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InspectionStepper } from "./components/stepper";
import { Outlet, useNavigate } from "react-router";
import { useDraftCompletedSteps } from "./store.ts";
import { useCurrentStep } from "./helper.ts";

export function InspectionNew() {
  const navigate = useNavigate();
  const step = useCurrentStep();
  const { completedSteps } = useDraftCompletedSteps();
  return (
    <div className="min-h-screen bg-background">
      <InspectionStepper
        currentStep={step}
        onStepClick={(_) => {}}
        completedSteps={completedSteps}
      />
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux inspections
          </Button>
          {/*<div className="flex items-center space-x-2">*/}
          {/*  <Button variant="outline" onClick={clearDraft} disabled={loading}>*/}
          {/*    Effacer le brouillon*/}
          {/*  </Button>*/}

          {/*  {step > 1 && (*/}
          {/*    <Button*/}
          {/*      variant="outline"*/}
          {/*      onClick={handlePrevious}*/}
          {/*      disabled={loading}*/}
          {/*    >*/}
          {/*      <ArrowLeft className="mr-2 h-4 w-4" />*/}
          {/*      Précédent*/}
          {/*    </Button>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>

        <div className="w-full">
          <Card>
            <CardContent className="p-6 w-full">
              <Outlet />
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
