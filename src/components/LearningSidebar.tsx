import { Brain, BookOpen, FileCheck, ArrowLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LearningMode } from "@/pages/Learn";

interface LearningSidebarProps {
  mode: LearningMode;
  setMode: (mode: LearningMode) => void;
  onBack: () => void;
}

const items = [
  { title: "Флэшкарты", value: "flashcards" as LearningMode, icon: Brain },
  { title: "Ситуации", value: "situations" as LearningMode, icon: BookOpen },
  { title: "Тесты", value: "tests" as LearningMode, icon: FileCheck },
];

export function LearningSidebar({ mode, setMode, onBack }: LearningSidebarProps) {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <SidebarTrigger />
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Режимы обучения</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => setMode(item.value)}
                    isActive={mode === item.value}
                    className="w-full"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <SidebarMenuButton onClick={onBack} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Вернуться к карте</span>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}