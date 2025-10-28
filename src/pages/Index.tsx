import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, BookOpen, Brain, GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Введите тему курса");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-course', {
        body: { topic }
      });

      if (error) throw error;

      // Store the generated course data in sessionStorage
      sessionStorage.setItem('courseData', JSON.stringify(data));
      sessionStorage.setItem('courseTopic', topic);
      
      navigate('/mindmap');
      toast.success("Курс успешно сгенерирован!");
    } catch (error) {
      console.error('Error generating course:', error);
      toast.error("Ошибка при генерации курса");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-2xl shadow-elevated">
              <GraduationCap className="w-16 h-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            AI Учебная Платформа
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Создайте персонализированный курс обучения с помощью искусственного интеллекта
          </p>
        </div>

        <Card className="p-8 shadow-elevated backdrop-blur-sm bg-card/95 border-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Введите тему курса
              </label>
              <Input
                type="text"
                placeholder="Например: Тестирование ПО, Разработка мобильных приложений..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                className="h-14 text-lg"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-all shadow-card"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Генерация курса...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Сгенерировать курс
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="flex justify-center mt-6">
          <Button
            onClick={() => navigate('/hr-dashboard')}
            variant="outline"
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            HR Панель
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
          <Card className="p-6 text-center hover:shadow-elevated transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Флэшкарты</h3>
            <p className="text-sm text-muted-foreground">
              Запоминайте ключевые концепции
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-elevated transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-secondary rounded-xl mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Ситуации</h3>
            <p className="text-sm text-muted-foreground">
              Практические сценарии применения
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-elevated transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Тесты</h3>
            <p className="text-sm text-muted-foreground">
              Проверьте свои знания
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;