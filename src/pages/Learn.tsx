import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LearningSidebar } from "@/components/LearningSidebar";
import { Flashcards } from "@/components/Flashcards";
import { Situations } from "@/components/Situations";
import { Tests } from "@/components/Tests";
import { ChatBot } from "@/components/ChatBot";

export type LearningMode = 'flashcards' | 'situations' | 'tests';

const Learn = () => {
  const [mode, setMode] = useState<LearningMode>('flashcards');
  const [courseData, setCourseData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const courseDataStr = sessionStorage.getItem('courseData');
    if (!courseDataStr) {
      navigate('/');
      return;
    }

    setCourseData(JSON.parse(courseDataStr));
  }, [navigate]);

  if (!courseData) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-hero">
        <LearningSidebar mode={mode} setMode={setMode} onBack={() => navigate('/mindmap')} />
        
        <div className="flex-1 flex flex-col">
          <div className="flex justify-center p-4">
            <Button onClick={() => navigate('/profile')} variant="outline" size="lg">
              Мой профиль компетенций
            </Button>
          </div>
          
          <main className="flex-1 p-6">
            {mode === 'flashcards' && <Flashcards flashcards={courseData.flashcards} />}
            {mode === 'situations' && <Situations situations={courseData.situations} />}
            {mode === 'tests' && <Tests tests={courseData.tests} />}
          </main>
        </div>

        <ChatBot courseContext={courseData.mindmap?.title} />
      </div>
    </SidebarProvider>
  );
};

export default Learn;