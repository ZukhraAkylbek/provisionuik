import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Test {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  module: string;
}

interface TestsProps {
  tests: Test[];
}

export function Tests({ tests }: TestsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentTest = tests[currentIndex];
  const isCorrect = selectedAnswer === currentTest.correctAnswer;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tests.length);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tests.length) % tests.length);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      
      // Save result to localStorage
      const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
      testResults.push({
        correct: selectedAnswer === currentTest.correctAnswer,
        type: 'analytical',
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('testResults', JSON.stringify(testResults));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Тесты</h2>
        <p className="text-muted-foreground">
          Вопрос {currentIndex + 1} из {tests.length}
        </p>
      </div>

      <Card className="p-8 shadow-elevated mb-6">
        <h3 className="text-xl font-semibold mb-6">{currentTest.question}</h3>

        <div className="space-y-3 mb-6">
          {currentTest.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
              className={cn(
                "w-full p-4 text-left rounded-lg border-2 transition-all",
                selectedAnswer === index && !showResult && "border-primary bg-primary/10",
                selectedAnswer !== index && !showResult && "border-border hover:border-primary/50",
                showResult && index === currentTest.correctAnswer && "border-green-500 bg-green-500/10",
                showResult && selectedAnswer === index && index !== currentTest.correctAnswer && "border-red-500 bg-red-500/10",
                showResult && selectedAnswer !== index && index !== currentTest.correctAnswer && "opacity-50"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && index === currentTest.correctAnswer && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {showResult && selectedAnswer === index && index !== currentTest.correctAnswer && (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {!showResult ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full bg-gradient-primary"
          >
            Проверить ответ
          </Button>
        ) : (
          <Card className={cn(
            "p-4",
            isCorrect ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"
          )}>
            <div className="flex items-start gap-3 mb-2">
              {isCorrect ? (
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div>
                <p className="font-semibold mb-1">
                  {isCorrect ? "Правильно!" : "Неправильно"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentTest.explanation}
                </p>
              </div>
            </div>
          </Card>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={tests.length <= 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Предыдущий
        </Button>

        <Button
          onClick={handleNext}
          disabled={tests.length <= 1}
          className="bg-gradient-primary"
        >
          Следующий
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}