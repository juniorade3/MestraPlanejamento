import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { PlanCard } from "@/components/plan-card";
import { 
  FilePlus, 
  Search, 
  FilterX, 
  Grid, 
  List, 
  Loader2, 
  AlertCircle,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LessonPlan } from "@shared/schema";

export default function MyPlansPage() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);
  
  const {
    data: lessonPlans,
    isLoading,
    error,
    refetch,
  } = useQuery<LessonPlan[]>({
    queryKey: ["/api/lesson-plans"],
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/lesson-plans/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Plano excluído",
        description: "O plano de aula foi excluído com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-plans"] });
      setDeletingPlanId(null);
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir plano",
        description: error.message || "Ocorreu um erro ao excluir o plano de aula",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Change document title
    document.title = "aulaMestra - Meus Planos";
    
    // Add Remix Icon CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const filteredPlans = lessonPlans
    ? lessonPlans.filter((plan) => {
        const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              plan.objectives.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = filterSubject ? plan.subject === filterSubject : true;
        const matchesStatus = filterStatus ? plan.status === filterStatus : true;
        
        return matchesSearch && matchesSubject && matchesStatus;
      })
    : [];

  const handleDeleteConfirm = (id: number) => {
    setDeletingPlanId(id);
  };

  const handleDeletePlan = () => {
    if (deletingPlanId !== null) {
      deletePlanMutation.mutate(deletingPlanId);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterSubject("");
    setFilterStatus("");
  };

  return (
    <div className="dashboard-layout">
      <DashboardHeader />
      <Sidebar activePage="my-plans" />
      
      <main className="lg:col-start-2 bg-gray-50 overflow-y-auto h-screen pb-12">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Meus Planos de Aula</h1>
            <Link href="/create-plan">
              <Button>
                <FilePlus className="mr-2 h-4 w-4" />
                Novo Plano
              </Button>
            </Link>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar planos..."
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
              
              <div className="w-full md:w-40">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="completed">Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                {(searchQuery || filterSubject || filterStatus) && (
                  <Button variant="outline" onClick={handleClearFilters} className="px-3 md:w-auto w-full">
                    <FilterX className="mr-2 h-4 w-4" />
                    Limpar
                  </Button>
                )}
                
                <div className="hidden md:flex border rounded-md">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="rounded-l-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-4" />
                <p className="text-red-500 font-medium">Erro ao carregar planos de aula</p>
                <Button variant="outline" onClick={() => refetch()} className="mt-4">
                  Tentar novamente
                </Button>
              </CardContent>
            </Card>
          ) : filteredPlans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum plano encontrado</h3>
                {(searchQuery || filterSubject || filterStatus) ? (
                  <p className="text-gray-500 mb-4">Tente ajustar os filtros de busca</p>
                ) : (
                  <p className="text-gray-500 mb-4">Você ainda não criou nenhum plano de aula</p>
                )}
                <Link href="/create-plan">
                  <Button>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Criar Novo Plano
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : viewMode === "list" ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disciplina</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPlans.map((plan) => (
                      <PlanCard 
                        key={plan.id} 
                        plan={plan} 
                        onDelete={handleDeleteConfirm} 
                        listView={true} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  onDelete={handleDeleteConfirm} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deletingPlanId !== null} onOpenChange={(open) => !open && setDeletingPlanId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir plano de aula</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este plano de aula? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPlanId(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePlan}
              disabled={deletePlanMutation.isPending}
            >
              {deletePlanMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
