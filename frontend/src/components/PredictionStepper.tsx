const steps = ["Araç", "Teknik", "Kondisyon", "Analiz"];

interface PredictionStepperProps {
  currentStep: number;
  onStepSelect: (step: number) => void;
}

export function PredictionStepper({ currentStep, onStepSelect }: PredictionStepperProps) {
  return (
    <ol className="stepper" aria-label="Değerleme adımları">
      {steps.map((label, index) => {
        const number = index + 1;
        const completed = number < currentStep;
        return (
          <li key={label} className={`${number === currentStep ? "active" : ""} ${completed ? "completed" : ""}`}>
            <button
              type="button"
              onClick={() => onStepSelect(number)}
              disabled={number > currentStep}
              aria-current={number === currentStep ? "step" : undefined}
              aria-label={`${number}. adım: ${label}${completed ? ", tamamlandı" : ""}`}
            >
              <span>{completed ? "✓" : number}</span>
              <strong>{label}</strong>
            </button>
            {number < steps.length && <i aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
