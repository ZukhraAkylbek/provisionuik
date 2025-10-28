import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, MessageSquare, Target, TrendingUp, Award, ArrowLeft } from "lucide-react";

interface CompetencyScore {
  name: string;
  score: number;
  icon: any;
  color: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [competencies, setCompetencies] = useState<CompetencyScore[]>([]);
  const [totalTests, setTotalTests] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    const situationResults = JSON.parse(localStorage.getItem('situationResults') || '[]');
    
    setTotalTests(testResults.length);
    setCorrectAnswers(testResults.filter((r: any) => r.correct).length);

    const scores: CompetencyScore[] = [
      {
        name: "Аналитическое мышление",
        score: calculateScore(testResults, 'analytical'),
        icon: Brain,
        color: "from-blue-500 to-cyan-500"
      },
      {
        name: "Коммуникация",
        score: calculateScore(situationResults, 'communication'),
        icon: MessageSquare,
        color: "from-purple-500 to-pink-500"
      },
      {
        name: "Принятие решений",
        score: calculateScore(situationResults, 'decision'),
        icon: Target,
        color: "from-green-500 to-emerald-500"
      },
      {
        name: "Стрессоустойчивость",
        score: calculateScore(testResults, 'stress'),
        icon: TrendingUp,
        color: "from-orange-500 to-red-500"
      }
    ];

    setCompetencies(scores);
  }, []);

  const calculateScore = (results: any[], type: string) => {
    if (results.length === 0) return 0;
    const relevant = results.filter((r: any) => r.type === type || !r.type);
    const correct = relevant.filter((r: any) => r.correct).length;
    return Math.round((correct / Math.max(relevant.length, 1)) * 100);
  };

  const overallScore = competencies.reduce((acc, c) => acc + c.score, 0) / Math.max(competencies.length, 1);

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/learn')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к обучению
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Профиль компетенций</h1>
          <p className="text-muted-foreground">
            Ваш цифровой портрет специалиста
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Общий рейтинг</h2>
                <p className="text-muted-foreground">
                  {totalTests} тестов пройдено, {correctAnswers} правильных ответов
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-16 h-16 text-primary" />
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {Math.round(overallScore)}
                  </div>
                  <div className="text-sm text-muted-foreground">из 100</div>
                </div>
              </div>
            </div>
            <Progress value={overallScore} className="h-3" />
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {competencies.map((comp) => (
              <Card key={comp.name} className="p-6 hover:shadow-elevated transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${comp.color}`}>
                    <comp.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{comp.name}</h3>
                    <p className="text-2xl font-bold">{comp.score}%</p>
                  </div>
                </div>
                <Progress value={comp.score} className="h-2" />
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Рекомендации по развитию</h3>
            <ul className="space-y-3">
              {competencies
                .filter(c => c.score < 70)
                .map((comp) => (
                  <li key={comp.name} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <span>
                      Улучшить навык "{comp.name}" — пройдите дополнительные симуляции и тесты
                    </span>
                  </li>
                ))}
              {competencies.filter(c => c.score < 70).length === 0 && (
                <li className="text-muted-foreground">
                  Отличная работа! Продолжайте поддерживать высокий уровень компетенций.
                </li>
              )}
            </ul>
          </Card>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/interview')} size="lg" className="bg-gradient-primary">
            Пройти AI-интервью
          </Button>
          <Button onClick={() => navigate('/job-match')} variant="outline" size="lg">
            Найти вакансии
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
