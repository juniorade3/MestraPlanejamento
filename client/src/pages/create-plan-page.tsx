import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertLessonPlan } from "@shared/schema";

export default function CreatePlanPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedSource, setSelectedSource] = useState<string>("bncc");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<InsertLessonPlan>>({
    title: "",
    subject: "",
    grade: "",
    duration: 50,
    topics: [],
    objectives: "",
    source: "bncc",
    status: "draft",
    classType: "expositiva",
    resources: [],
    specialNeeds: "",
    includeAssessment: false,
    includeHomework: false,
    includeReferences: false,
    content: {},
  });

  // Get template data if templateId is provided in URL
  const params = new URLSearchParams(window.location.search);
  const templateId = params.get("templateId");

  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ["/api/templates", templateId],
    enabled: !!templateId,
  });

  useEffect(() => {
    if (template) {
      setFormData({
        ...formData,
        title: `Cópia de ${template.title}`,
        subject: template.subject,
        grade: template.grade,
        duration: template.duration,
        topics: template.topics,
        objectives: template.objectives,
        classType: template.classType,
        content: template.content,
      });
    }
  }, [template]);

  useEffect(() => {
    // Change document title
    document.title = "aulaMestra - Criar Novo Plano";
    
    // Add Remix Icon CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Generate lesson plan with AI
  const generatePlanMutation = useMutation({
    mutationFn: async (data: any) => {
      let endpoint = "/api/generate-lesson-plan";
      let body = data;
      
      if (selectedSource === "custom" && pdfFile) {
        endpoint = "/api/generate-from-pdf";
        
        const formDataObj = new FormData();
        formDataObj.append("pdf", pdfFile);
        
        // Append all other data
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "object" && !Array.isArray(value)) {
            formDataObj.append(key, JSON.stringify(value));
          } else {
            formDataObj.append(key, String(value));
          }
        });
        
        const res = await fetch(endpoint, {
          method: "POST",
          body: formDataObj,
          credentials: "include",
        });
        
        if (!res.ok) {
          throw new Error("Erro ao gerar plano de aula");
        }
        
        return await res.json();
      } else {
        const res = await apiRequest("POST", endpoint, body);
        return await res.json();
      }
    },
    onSuccess: (data) => {
      setFormData({
        ...formData,
        content: data.content,
      });
      
      toast({
        title: "Plano gerado com sucesso",
        description: "O plano foi gerado pela IA e está pronto para edição",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao gerar plano",
        description: error.message || "Ocorreu um erro ao gerar o plano de aula",
        variant: "destructive",
      });
    },
  });

  // Create lesson plan
  const createPlanMutation = useMutation({
    mutationFn: async (data: InsertLessonPlan) => {
      const res = await apiRequest("POST", "/api/lesson-plans", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Plano criado com sucesso",
        description: "Seu plano de aula foi salvo",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-plans"] });
      setLocation(`/plan/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar plano",
        description: error.message || "Ocorreu um erro ao salvar o plano de aula",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleTopicsChange = (value: string) => {
    const topicsArray = value.split(",").map(topic => topic.trim()).filter(Boolean);
    setFormData({ ...formData, topics: topicsArray });
  };

  const handleResourcesChange = (value: string[]) => {
    setFormData({ ...formData, resources: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSourceChange = (value: string) => {
    setSelectedSource(value);
    setFormData({ ...formData, source: value });
  };

  const handleGeneratePlan = () => {
    if (!formData.title || !formData.subject || !formData.grade || !formData.objectives) {
      toast({
        title: "Informações incompletas",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedSource === "custom" && !pdfFile) {
      toast({
        title: "PDF necessário",
        description: "Faça upload do arquivo PDF com as diretrizes",
        variant: "destructive",
      });
      return;
    }
    
    generatePlanMutation.mutate({
      title: formData.title,
      subject: formData.subject,
      grade: formData.grade,
      duration: formData.duration,
      topics: formData.topics,
      objectives: formData.objectives,
      classType: formData.classType,
      resources: formData.resources,
      specialNeeds: formData.specialNeeds,
      includeAssessment: formData.includeAssessment,
      includeHomework: formData.includeHomework,
      includeReferences: formData.includeReferences,
    });
  };

  const handleSavePlan = () => {
    if (!formData.title || !formData.subject || !formData.grade || !formData.objectives || !formData.content) {
      toast({
        title: "Informações incompletas",
        description: "Preencha todos os campos obrigatórios e gere o conteúdo do plano",
        variant: "destructive",
      });
      return;
    }
    
    createPlanMutation.mutate(formData as InsertLessonPlan);
  };

  if (templateLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <DashboardHeader />
      <Sidebar activePage="create-plan" />
      
      <main className="lg:col-start-2 bg-gray-50 overflow-y-auto h-screen pb-12">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Novo Plano de Aula</h1>
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/dashboard")}
              size="icon"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Escolha como deseja criar seu plano</h2>
                  <RadioGroup 
                    value={selectedSource} 
                    onValueChange={handleSourceChange}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    <div className={`border-2 rounded-lg p-6 ${selectedSource === "bncc" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary hover:bg-primary/5"} relative cursor-pointer transition duration-150`}>
                      <RadioGroupItem 
                        value="bncc" 
                        id="bncc" 
                        className="absolute top-4 right-4 hidden"
                      />
                      {selectedSource === "bncc" && (
                        <div className="absolute top-4 right-4">
                          <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                            <i className="ri-check-line text-white"></i>
                          </div>
                        </div>
                      )}
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                        <i className="ri-book-open-line text-2xl"></i>
                      </div>
                      <Label htmlFor="bncc" className="text-lg font-medium text-gray-900 mb-2 block cursor-pointer">
                        Base Nacional Comum Curricular
                      </Label>
                      <p className="text-gray-600">Crie seu plano com base nos objetivos, habilidades e competências da BNCC.</p>
                    </div>
                    
                    <div className={`border-2 rounded-lg p-6 ${selectedSource === "custom" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary hover:bg-primary/5"} relative cursor-pointer transition duration-150`}>
                      <RadioGroupItem 
                        value="custom" 
                        id="custom" 
                        className="absolute top-4 right-4 hidden"
                      />
                      {selectedSource === "custom" && (
                        <div className="absolute top-4 right-4">
                          <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                            <i className="ri-check-line text-white"></i>
                          </div>
                        </div>
                      )}
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 mb-4">
                        <i className="ri-file-upload-line text-2xl"></i>
                      </div>
                      <Label htmlFor="custom" className="text-lg font-medium text-gray-900 mb-2 block cursor-pointer">
                        Diretrizes da Escola
                      </Label>
                      <p className="text-gray-600">Faça upload de um PDF com as diretrizes específicas da sua instituição de ensino.</p>
                      
                      {selectedSource === "custom" && (
                        <div className="mt-4">
                          <Input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileChange}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">Máximo 5MB</p>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Título do Plano*
                      </Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleInputChange}
                        placeholder="Ex: Introdução a Frações"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Disciplina*
                      </Label>
                      <Select 
                        value={formData.subject} 
                        onValueChange={(value) => handleSelectChange("subject", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="matematica">Matemática</SelectItem>
                          <SelectItem value="portugues">Português</SelectItem>
                          <SelectItem value="ciencias">Ciências</SelectItem>
                          <SelectItem value="historia">História</SelectItem>
                          <SelectItem value="geografia">Geografia</SelectItem>
                          <SelectItem value="artes">Artes</SelectItem>
                          <SelectItem value="educacao_fisica">Educação Física</SelectItem>
                          <SelectItem value="ingles">Inglês</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                        Série/Ano*
                      </Label>
                      <Select 
                        value={formData.grade} 
                        onValueChange={(value) => handleSelectChange("grade", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a série" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infantil_3">3 anos - Educação Infantil</SelectItem>
                          <SelectItem value="infantil_4">4 anos - Educação Infantil</SelectItem>
                          <SelectItem value="infantil_5">5 anos - Educação Infantil</SelectItem>
                          <SelectItem value="fundamental_1">1º ano - Ensino Fundamental</SelectItem>
                          <SelectItem value="fundamental_2">2º ano - Ensino Fundamental</SelectItem>
                          <SelectItem value="fundamental_3">3º ano - Ensino Fundamental</SelectItem>
                          <SelectItem value="fundamental_4">4º ano - Ensino Fundamental</SelectItem>
                          <SelectItem value="fundamental_5">5º ano - Ensino Fundamental</SelectItem>
                          <SelectItem value="fundamental_6">6º ano - Ensino Fundamental</SelectItem>
                          <SelectItem value="fundamental_7">7º ano - Ensino Fundamental</SelectItem>
                          <SelectItem value="fundamental_8">8º ano - Ensino Fundamental</SelectItem>
                          <SelectItem value="fundamental_9">9º ano - Ensino Fundamental</SelectItem>
                          <SelectItem value="medio_1">1º ano - Ensino Médio</SelectItem>
                          <SelectItem value="medio_2">2º ano - Ensino Médio</SelectItem>
                          <SelectItem value="medio_3">3º ano - Ensino Médio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Duração da Aula
                      </Label>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          id="duration" 
                          name="duration" 
                          min="1" 
                          className="w-24" 
                          value={formData.duration} 
                          onChange={handleInputChange}
                        />
                        <span className="ml-2 text-gray-700">minutos</span>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-1">
                        Tópicos Principais
                      </Label>
                      <Input 
                        id="topics" 
                        name="topics" 
                        value={formData.topics?.join(", ")} 
                        onChange={(e) => handleTopicsChange(e.target.value)}
                        placeholder="Ex: Frações, Números decimais, Operações básicas"
                      />
                      <p className="mt-1 text-sm text-gray-500">Separe os tópicos por vírgula</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">
                        Objetivo da Aula*
                      </Label>
                      <Textarea 
                        id="objectives" 
                        name="objectives" 
                        rows={3} 
                        value={formData.objectives} 
                        onChange={handleInputChange}
                        placeholder="Descreva o que você deseja que os alunos aprendam com esta aula"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Opções Avançadas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="classType" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Aula
                      </Label>
                      <Select 
                        value={formData.classType} 
                        onValueChange={(value) => handleSelectChange("classType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de aula" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expositiva">Expositiva</SelectItem>
                          <SelectItem value="pratica">Prática</SelectItem>
                          <SelectItem value="debate">Debate</SelectItem>
                          <SelectItem value="projeto">Projeto</SelectItem>
                          <SelectItem value="avaliacao">Avaliação</SelectItem>
                          <SelectItem value="laboratorio">Laboratório</SelectItem>
                          <SelectItem value="campo">Aula de Campo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Recursos Necessários
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["lousa", "projetor", "computador", "livro", "internet", "material_impresso", "laboratorio"].map((resource) => (
                          <div key={resource} className="flex items-center">
                            <Checkbox 
                              id={`resource-${resource}`} 
                              checked={formData.resources?.includes(resource) || false}
                              onCheckedChange={(checked) => {
                                const resources = formData.resources || [];
                                if (checked) {
                                  handleResourcesChange([...resources, resource]);
                                } else {
                                  handleResourcesChange(resources.filter(r => r !== resource));
                                }
                              }}
                            />
                            <Label htmlFor={`resource-${resource}`} className="ml-2 text-sm">
                              {resource === "lousa" ? "Lousa" : 
                               resource === "projetor" ? "Projetor" : 
                               resource === "computador" ? "Computador" : 
                               resource === "livro" ? "Livro Didático" : 
                               resource === "internet" ? "Internet" : 
                               resource === "material_impresso" ? "Material Impresso" : 
                               "Laboratório"}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="specialNeeds" className="block text-sm font-medium text-gray-700 mb-1">
                        Adaptações para Necessidades Especiais
                      </Label>
                      <Textarea 
                        id="specialNeeds" 
                        name="specialNeeds" 
                        rows={2} 
                        value={formData.specialNeeds} 
                        onChange={handleInputChange}
                        placeholder="Descreva quaisquer adaptações necessárias para alunos com necessidades especiais"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <Checkbox 
                          id="includeAssessment" 
                          checked={formData.includeAssessment} 
                          onCheckedChange={(checked) => handleCheckboxChange("includeAssessment", !!checked)}
                        />
                        <Label htmlFor="includeAssessment" className="ml-2 text-sm text-gray-700">
                          Incluir métodos de avaliação no plano
                        </Label>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <Checkbox 
                          id="includeHomework" 
                          checked={formData.includeHomework} 
                          onCheckedChange={(checked) => handleCheckboxChange("includeHomework", !!checked)}
                        />
                        <Label htmlFor="includeHomework" className="ml-2 text-sm text-gray-700">
                          Incluir sugestões de tarefa de casa
                        </Label>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <Checkbox 
                          id="includeReferences" 
                          checked={formData.includeReferences} 
                          onCheckedChange={(checked) => handleCheckboxChange("includeReferences", !!checked)}
                        />
                        <Label htmlFor="includeReferences" className="ml-2 text-sm text-gray-700">
                          Incluir referências bibliográficas
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                    className="mr-3"
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    onClick={handleGeneratePlan}
                    disabled={generatePlanMutation.isPending}
                    className="mr-3"
                  >
                    {generatePlanMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...
                      </>
                    ) : (
                      <>
                        <i className="ri-magic-line mr-2"></i>
                        Gerar com IA
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSavePlan}
                    disabled={createPlanMutation.isPending || !formData.content || Object.keys(formData.content).length === 0}
                  >
                    {createPlanMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                      </>
                    ) : (
                      "Salvar Plano"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
