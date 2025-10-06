import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

interface Step {
  id: number;
  key: string;
  completed: boolean;
}

interface InspectionStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
  isEdit?: boolean;
}

export function InspectionStepper({
  currentStep,
  onStepClick,
  completedSteps,
  isEdit = false,
}: InspectionStepperProps) {
  const steps: Step[] = [
    {
      id: 1,
      key: "Renseignements du Client",
      completed: completedSteps.includes(1),
    },
    { id: 2, key: "Équipement", completed: completedSteps.includes(2) },
    { id: 3, key: "Palans", completed: completedSteps.includes(3) },
    { id: 4, key: "Chariots", completed: completedSteps.includes(4) },
    {
      id: 5,
      key: "Liste de vérification",
      completed: completedSteps.includes(5),
    },
    { id: 6, key: "Aperçu et Export", completed: completedSteps.includes(6) },
  ];

  return (
    <div className="bg-card border-b sticky top-0 z-10">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {isEdit ? "Modifier l'inspection" : "Nouvelle inspection"}
          </h1>

          {/* Desktop Stepper */}
          <div className="hidden md:flex items-center space-x-4">
            {steps.map((step, index) => (
              <Fragment key={step.id}>
                <button
                  onClick={() => onStepClick(step.id)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : step.completed
                        ? "bg-muted text-muted-foreground hover:bg-muted/80"
                        : "text-muted-foreground hover:bg-muted/50",
                  )}
                  disabled={false}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                      currentStep === step.id
                        ? "bg-primary-foreground text-primary"
                        : step.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-muted-foreground/20",
                    )}
                  >
                    {step.completed ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">
                    {step.key}
                  </span>
                </button>

                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-border" />
                )}
              </Fragment>
            ))}
          </div>

          {/* Mobile Step Indicator */}
          <div className="md:hidden flex items-center space-x-2">
            <Circle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {currentStep} / {steps.length}
            </span>
          </div>
        </div>

        {/* Mobile Step Name */}
        <div className="md:hidden mt-2">
          <p className="text-sm font-medium">
            {steps.find((s) => s.id === currentStep)?.key || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
