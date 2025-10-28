import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, TrendingUp, Award, Clock } from "lucide-react";

interface UserStats {
  id: string;
  name: string;
  testsCompleted: number;
  avgScore: number;
  timeSpent: number;
  topSkill: string;
}

const HRDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserStats[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockUsers: UserStats[] = [
      {
        id: "1",
        name: "Анна Петрова",
        testsCompleted: 15,
        avgScore: 87,
        timeSpent: 240,
        topSkill: "Коммуникация"
      },
      {
        id: "2",
        name: "Дмитрий Иванов",
        testsCompleted: 12,
        avgScore: 92,
        timeSpent: 180,
        topSkill: "Аналитика"
      },
      {
        id: "3",
        name: "Елена Сидорова",
        testsCompleted: 18,
        avgScore: 78,
        timeSpent: 300,
        topSkill: "Решение проблем"
      },
      {
        id: "4",
        name: "Михаил Козлов",
        testsCompleted: 10,
        avgScore: 85,
        timeSpent: 150,
        topSkill: "Работа в команде"
      },
    ];

    setUsers(mockUsers.sort((a, b) => b.avgScore - a.avgScore));
  }, []);

  const totalUsers = users.length;
  const avgCompletionRate = users.reduce((acc, u) => acc + u.testsCompleted, 0) / totalUsers;
  const avgScore = users.reduce((acc, u) => acc + u.avgScore, 0) / totalUsers;

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">HR Панель</h1>
          <p className="text-muted-foreground">
            Аналитика прогресса и результатов участников
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Всего участников</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Средний балл</p>
                <p className="text-2xl font-bold">{Math.round(avgScore)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Тестов в среднем</p>
                <p className="text-2xl font-bold">{Math.round(avgCompletionRate)}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Рейтинг участников</h2>
          <div className="space-y-4">
            {users.map((user, index) => (
              <Card key={user.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {user.testsCompleted} тестов
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {user.timeSpent} мин
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Успеваемость</span>
                          <span className="text-sm font-semibold">{user.avgScore}%</span>
                        </div>
                        <Progress value={user.avgScore} className="h-2" />
                      </div>
                      <div className="text-sm">
                        Лучший навык: <span className="font-semibold">{user.topSkill}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">AI-рекомендации по подбору</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">Высокий потенциал</p>
                <p className="text-sm text-muted-foreground">
                  Дмитрий Иванов показывает отличные результаты в аналитике — рекомендуем для роли Data Analyst
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Users className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-400">Сильные коммуникативные навыки</p>
                <p className="text-sm text-muted-foreground">
                  Анна Петрова отлично справляется с ситуационными кейсами — подходит для Customer Success
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <Award className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-700 dark:text-orange-400">Требуется развитие</p>
                <p className="text-sm text-muted-foreground">
                  Елена Сидорова активно проходит обучение — рекомендуем дополнительные модули по принятию решений
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;
