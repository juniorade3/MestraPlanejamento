import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChevronLeft,
  Save,
  Loader2,
  Info,
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  List,
  Target,
  Share2,
  Download,
  FileType,
  DownloadCloud,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LessonPlan } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PlanEditorPage() {
  const params = useParams<{ id: string }>();
  const planId = parseInt(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [content, setContent] = useState<any>({});
  
  const {
    data: plan,
    isLoading,
    error,
  } = useQuery<LessonPlan>({
    queryKey: ["/api/lesson-plans", planId],
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (updatedPlan: Partial<LessonPlan>) => {
      const res = await apiRequest("PUT", `/api/lesson-plans/${planId}`, updatedPlan);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Plano atualizado",
        description: "As alterações foram salvas com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-plans", planId] });
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-plans"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar as alterações",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (plan) {
      setContent(plan.content);
    }
  }, [plan]);

  useEffect(() => {
    // Change document title
    document.title = plan ? `aulaMestra - ${plan.title}` : "aulaMestra - Editor de Plano";
    
    // Add Remix Icon CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [plan]);

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
  };

  const handleSave = () => {
    if (plan) {
      updatePlanMutation.mutate({
        ...plan,
        content,
        status: "completed", // Update status to completed when saving
      });
    }
  };

  // Handle simple exports
  const exportPDF = () => {
    toast({
      title: "Exportação de PDF",
      description: "Funcionalidade de exportação será implementada em breve",
    });
  };

  // Format grade for display
  const formatGrade = (grade: string) => {
    if (grade.includes("infantil")) {
      const year = grade.split("_")[1];
      return `${year} anos - Educação Infantil`;
    } else if (grade.includes("fundamental")) {
      const year = grade.split("_")[1];
      return `${year}º ano - Ensino Fundamental`;
    } else if (grade.includes("medio")) {
      const year = grade.split("_")[1];
      return `${year}º ano - Ensino Médio`;
    }
    return grade;
  };

  // Format subject for display
  const formatSubject = (subject: string) => {
    const subjects: Record<string, string> = {
      matematica: "Matemática",
      portugues: "Português",
      ciencias: "Ciências",
      historia: "História",
      geografia: "Geografia",
      artes: "Artes",
      educacao_fisica: "Educação Física",
      ingles: "Inglês",
    };
    return subjects[subject] || subject;
  };

  // Format class type for display
  const formatClassType = (classType: string | undefined) => {
    if (!classType) return "";
    
    const types: Record<string, string> = {
      expositiva: "Expositiva",
      pratica: "Prática",
      debate: "Debate",
      projeto: "Projeto",
      avaliacao: "Avaliação",
      laboratorio: "Laboratório",
      campo: "Aula de Campo",
    };
    return types[classType] || classType;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 mb-4">Erro ao carregar o plano de aula</div>
        <Button onClick={() => setLocation("/my-plans")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Meus Planos
        </Button>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <DashboardHeader />
      <Sidebar activePage="my-plans" />
      
      <main className="lg:col-start-2 bg-gray-50 overflow-y-auto h-screen pb-12">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setLocation("/my-plans")}
                className="mr-4"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
                <div className="flex items-center mt-1">
                  <Badge variant={plan.status === "completed" ? "success" : "outline"}>
                    {plan.status === "completed" ? "Completo" : "Rascunho"}
                  </Badge>
                  <span className="text-sm text-gray-500 ml-2">
                    Criado em {new Date(plan.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-2">
                    <h4 className="font-medium">Compartilhar plano</h4>
                    <p className="text-sm text-gray-500">Gere um link para compartilhar este plano com outros professores.</p>
                    <Button className="w-full">Gerar link compartilhável</Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-4">
                    <h4 className="font-medium">Exportar plano</h4>
                    <div className="grid gap-2">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={exportPDF}
                      >
                        <FileType className="h-4 w-4 mr-2" />
                        Exportar como PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={exportPDF}
                      >
                        <DownloadCloud className="h-4 w-4 mr-2" />
                        Exportar como DOCX
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button
                onClick={handleSave}
                disabled={updatePlanMutation.isPending}
              >
                {updatePlanMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-0 pt-2 pl-4 pr-4 border-b rounded-b-none bg-gray-50">
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="mt-0 pt-0">
                <Editor 
                  content={content} 
                  onChange={handleContentChange}
                  onSave={handleSave}
                />
              </TabsContent>
              
              <TabsContent value="details" className="mt-0">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Info className="h-5 w-5 mr-2 text-primary" />
                        Informações Básicas
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span className="text-sm">Disciplina</span>
                          </div>
                          <p className="font-medium">{formatSubject(plan.subject)}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            <span className="text-sm">Série/Ano</span>
                          </div>
                          <p className="font-medium">{formatGrade(plan.grade)}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">Duração</span>
                          </div>
                          <p className="font-medium">{plan.duration} minutos</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="text-sm">Data de Criação</span>
                          </div>
                          <p className="font-medium">{new Date(plan.createdAt).toLocaleDateString("pt-BR")}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-primary" />
                        Objetivos e Detalhes
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <Target className="h-4 w-4 mr-2" />
                            <span className="text-sm">Objetivo da Aula</span>
                          </div>
                          <p>{plan.objectives}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <List className="h-4 w-4 mr-2" />
                            <span className="text-sm">Tópicos</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {plan.topics.map((topic, index) => (
                              <Badge key={index} variant="secondary" className="mr-1 mb-1">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {plan.classType && (
                          <div>
                            <div className="flex items-center text-gray-500 mb-1">
                              <i className="ri-presentation-line mr-2"></i>
                              <span className="text-sm">Tipo de Aula</span>
                            </div>
                            <p className="font-medium">{formatClassType(plan.classType)}</p>
                          </div>
                        )}
                        
                        {plan.resources && plan.resources.length > 0 && (
                          <div>
                            <div className="flex items-center text-gray-500 mb-1">
                              <i className="ri-tools-line mr-2"></i>
                              <span className="text-sm">Recursos Necessários</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {plan.resources.map((resource, index) => (
                                <Badge key={index} variant="outline" className="mr-1 mb-1">
                                  {resource === "lousa" ? "Lousa" : 
                                   resource === "projetor" ? "Projetor" : 
                                   resource === "computador" ? "Computador" : 
                                   resource === "livro" ? "Livro Didático" : 
                                   resource === "internet" ? "Internet" : 
                                   resource === "material_impresso" ? "Material Impresso" : 
                                   "Laboratório"}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {plan.specialNeeds && (
                          <div>
                            <div className="flex items-center text-gray-500 mb-1">
                              <i className="ri-heart-line mr-2"></i>
                              <span className="text-sm">Adaptações para Necessidades Especiais</span>
                            </div>
                            <p>{plan.specialNeeds}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
