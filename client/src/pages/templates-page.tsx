import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  FilterX, 
  Loader2, 
  PlusCircle, 
  LayoutTemplate,
  Info,
  Clock,
} from "lucide-react";
import { Template } from "@shared/schema";

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterGradeLevel, setFilterGradeLevel] = useState("");
  
  const {
    data: templates,
    isLoading,
    error,
  } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  useEffect(() => {
    // Change document title
    document.title = "aulaMestra - Biblioteca de Modelos";
    
    // Add Remix Icon CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const filteredTemplates = templates
    ? templates.filter((template) => {
        const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             template.objectives.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = filterSubject ? template.subject === filterSubject : true;
        const matchesGradeLevel = filterGradeLevel ? template.grade.includes(filterGradeLevel) : true;
        
        return matchesSearch && matchesSubject && matchesGradeLevel;
      })
    : [];

  // Format grade for display
  const formatGrade = (grade: string) => {
    if (grade.includes("infantil")) {
      const year = grade.split("_")[1];
      return `${year} anos - Ed. Infantil`;
    } else if (grade.includes("fundamental")) {
      const year = grade.split("_")[1];
      return `${year}º ano - Fundamental`;
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

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterSubject("");
    setFilterGradeLevel("");
  };

  // Get a gradient color based on subject
  const getGradientColor = (subject: string) => {
    const colors: Record<string, string> = {
      matematica: "from-blue-500 to-cyan-400",
      portugues: "from-red-500 to-pink-400",
      ciencias: "from-green-500 to-emerald-400",
      historia: "from-amber-500 to-yellow-400",
      geografia: "from-indigo-500 to-purple-400",
      artes: "from-pink-500 to-rose-400",
      educacao_fisica: "from-orange-500 to-amber-400",
      ingles: "from-purple-500 to-violet-400",
    };
    return colors[subject] || "from-gray-500 to-slate-400";
  };

  // Get a badge color based on grade level
  const getBadgeVariant = (grade: string) => {
    if (grade.includes("infantil")) {
      return "outline";
    } else if (grade.includes("fundamental")) {
      return "secondary";
    } else if (grade.includes("medio")) {
      return "default";
    }
    return "outline";
  };

  return (
    <div className="dashboard-layout">
      <DashboardHeader />
      <Sidebar activePage="templates" />
      
      <main className="lg:col-start-2 bg-gray-50 overflow-y-auto h-screen pb-12">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Modelos</h1>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar modelos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="w-full md:w-48">
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
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
              
              <div className="w-full md:w-48">
                <Select value={filterGradeLevel} onValueChange={setFilterGradeLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Etapa de ensino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="infantil">Educação Infantil</SelectItem>
                    <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                    <SelectItem value="medio">Ensino Médio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(searchQuery || filterSubject || filterGradeLevel) && (
                <Button variant="outline" onClick={handleClearFilters} className="md:w-auto w-full">
                  <FilterX className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>
          
          {/* Templates Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-red-500">Erro ao carregar modelos</p>
              </CardContent>
            </Card>
          ) : filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <LayoutTemplate className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum modelo encontrado</h3>
                <p className="text-gray-500 mb-4">Tente ajustar os filtros para encontrar o que procura</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden h-full flex flex-col">
                  <div className={`h-28 bg-gradient-to-r ${getGradientColor(template.subject)} relative`}>
                    <div className="absolute top-3 right-3">
                      <Badge variant={getBadgeVariant(template.grade)}>
                        {template.grade.includes("infantil") ? "Educação Infantil" : 
                         template.grade.includes("fundamental") ? "Ensino Fundamental" : 
                         "Ensino Médio"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <h3 className="font-medium text-gray-900 text-lg mb-2">{template.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{template.objectives}</p>
                    <div className="flex flex-col gap-3 mt-auto">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <Info className="h-4 w-4 mr-1" />
                          {formatSubject(template.subject)} | {formatGrade(template.grade)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {template.duration} min
                        </div>
                      </div>
                      <Link href={`/create-plan?templateId=${template.id}`}>
                        <Button className="w-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Usar Modelo
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
