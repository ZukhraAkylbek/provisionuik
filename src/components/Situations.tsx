import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Situation {
  title: string;
  scenario: string;
  questions: string[];
  module: string;
}

interface SituationsProps {
  situations: Situation[];
}

export function Situations({ situations }: SituationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSituation = situations[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % situations.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + situations.length) % situations.length);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Практические ситуации</h2>
        <p className="text-muted-foreground">
          Ситуация {currentIndex + 1} из {situations.length}
        </p>
      </div>

      <Card className="p-8 shadow-elevated mb-6">
        <h3 className="text-2xl font-semibold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          {currentSituation.title}
        </h3>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Сценарий:</h4>
          <p className="text-lg leading-relaxed">{currentSituation.scenario}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            Вопросы для размышления:
          </h4>
          <ul className="space-y-3">
            {currentSituation.questions.map((question, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-base pt-0.5">{question}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={situations.length <= 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Предыдущая
        </Button>

        <Button
          onClick={handleNext}
          disabled={situations.length <= 1}
          className="bg-gradient-primary"
        >
          Следующая
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}