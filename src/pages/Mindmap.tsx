import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  topics: string[];
}

interface MindmapData {
  title: string;
  modules: Module[];
}

const Mindmap = () => {
  const [mindmap, setMindmap] = useState<MindmapData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const courseDataStr = sessionStorage.getItem('courseData');
    if (!courseDataStr) {
      navigate('/');
      return;
    }

    const courseData = JSON.parse(courseDataStr);
    setMindmap(courseData.mindmap);
  }, [navigate]);

  if (!mindmap) return null;

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
          <Button
            onClick={() => navigate('/learn')}
            className="gap-2 bg-gradient-primary"
          >
            Начать обучение
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            {mindmap.title}
          </h1>
          <p className="text-muted-foreground">
            Структура вашего персонального курса
          </p>
        </div>

        <div className="grid gap-6">
          {mindmap.modules.map((module, index) => (
            <Card
              key={module.id}
              className="p-6 shadow-card hover:shadow-elevated transition-all animate-in fade-in slide-in-from-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={() => navigate('/learn')}
            className="gap-2 bg-gradient-primary shadow-elevated"
          >
            Начать обучение
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mindmap;