import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Flashcard {
  front: string;
  back: string;
  module: string;
}

interface FlashcardsProps {
  flashcards: Flashcard[];
}

export function Flashcards({ flashcards }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Флэшкарты</h2>
        <p className="text-muted-foreground">
          Карточка {currentIndex + 1} из {flashcards.length}
        </p>
      </div>

      <div className="perspective-1000 mb-8">
        <Card
          className="relative h-80 cursor-pointer shadow-elevated transition-transform duration-500 preserve-3d"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className="absolute inset-0 p-8 flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Вопрос</p>
              <p className="text-xl font-medium">{currentCard.front}</p>
            </div>
          </div>

          <div
            className="absolute inset-0 p-8 flex items-center justify-center bg-gradient-primary backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-center text-primary-foreground">
              <p className="text-sm opacity-90 mb-4">Ответ</p>
              <p className="text-xl font-medium">{currentCard.back}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={flashcards.length <= 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Предыдущая
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {isFlipped ? 'Скрыть ответ' : 'Показать ответ'}
        </Button>

        <Button
          onClick={handleNext}
          disabled={flashcards.length <= 1}
          className="bg-gradient-primary"
        >
          Следующая
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}