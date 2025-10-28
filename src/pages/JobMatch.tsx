import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, DollarSign, TrendingUp } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  requiredSkills: string[];
  description: string;
}

const JobMatch = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);

  useEffect(() => {
    // Load user competencies from profile
    const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    const situationResults = JSON.parse(localStorage.getItem('situationResults') || '[]');
    
    const skills: string[] = [];
    if (testResults.length > 5) skills.push("Аналитическое мышление");
    if (situationResults.length > 3) skills.push("Коммуникация", "Работа в команде");
    skills.push("Решение проблем", "Адаптивность");
    
    setUserSkills(skills);

    // Mock job data - in real app this would come from API
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Junior Frontend Developer",
        company: "TechCorp",
        location: "Москва",
        salary: "80,000 - 120,000 ₽",
        matchScore: 85,
        requiredSkills: ["React", "TypeScript", "Коммуникация", "Работа в команде"],
        description: "Разработка современных веб-приложений в команде опытных разработчиков"
      },
      {
        id: "2",
        title: "Business Analyst",
        company: "DataSolutions",
        location: "Удаленно",
        salary: "100,000 - 150,000 ₽",
        matchScore: 78,
        requiredSkills: ["Аналитическое мышление", "Excel", "SQL", "Коммуникация"],
        description: "Анализ бизнес-процессов и подготовка аналитических отчетов"
      },
      {
        id: "3",
        title: "Project Coordinator",
        company: "StartupHub",
        location: "Санкт-Петербург",
        salary: "70,000 - 100,000 ₽",
        matchScore: 72,
        requiredSkills: ["Работа в команде", "Решение проблем", "Коммуникация"],
        description: "Координация проектов и взаимодействие с командой разработки"
      },
      {
        id: "4",
        title: "Customer Success Manager",
        company: "SaaSCompany",
        location: "Москва / Удаленно",
        salary: "90,000 - 130,000 ₽",
        matchScore: 68,
        requiredSkills: ["Коммуникация", "Решение проблем", "Адаптивность"],
        description: "Работа с клиентами и обеспечение их успешного использования продукта"
      }
    ];

    // Calculate match scores based on user skills
    const jobsWithScores = mockJobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job.requiredSkills, skills)
    }));

    setJobs(jobsWithScores.sort((a, b) => b.matchScore - a.matchScore));
  }, []);

  const calculateMatchScore = (required: string[], userSkills: string[]) => {
    const matchCount = required.filter(skill => 
      userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || 
                            skill.toLowerCase().includes(us.toLowerCase()))
    ).length;
    return Math.round((matchCount / required.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к профилю
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Подходящие вакансии</h1>
          <p className="text-muted-foreground">
            AI подобрал {jobs.length} вакансий на основе ваших навыков
          </p>
        </div>

        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-3">Ваши ключевые навыки:</h3>
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-primary/10">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-lg font-semibold text-green-500">
                        {job.matchScore}% совпадение
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                  </div>

                  <p className="text-sm mb-4">{job.description}</p>

                  <div>
                    <p className="text-sm font-medium mb-2">Требуемые навыки:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill) => {
                        const hasSkill = userSkills.some(us => 
                          us.toLowerCase().includes(skill.toLowerCase()) || 
                          skill.toLowerCase().includes(us.toLowerCase())
                        );
                        return (
                          <Badge
                            key={skill}
                            variant={hasSkill ? "default" : "outline"}
                          >
                            {skill}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="bg-gradient-primary">
                  Откликнуться
                </Button>
                <Button variant="outline">
                  Подробнее
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobMatch;
