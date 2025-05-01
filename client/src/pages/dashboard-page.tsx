import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const {
    data: lessonPlans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/lesson-plans"],
    enabled: !!user,
  });

  const {
    data: templates,
    isLoading: templatesLoading,
  } = useQuery({
    queryKey: ["/api/templates"],
    enabled: !!user,
  });

  useEffect(() => {
    // Change document title
    document.title = "aulaMestra - Dashboard";
    
    // Add Remix Icon CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="dashboard-layout">
      <DashboardHeader />
      <Sidebar activePage="dashboard" />
      
      <main className="lg:col-start-2 bg-gray-50 overflow-y-auto h-screen pb-12">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          
          {/* Greeting Card */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Olá, {user?.name || user?.username}!</h2>
                <p className="mt-1 text-gray-600">O que você vai planejar hoje?</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link href="/create-plan">
                  <Button className="inline-flex items-center">
                    <i className="ri-add-line mr-2"></i>
                    <span>Novo Plano</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-primary/10 text-primary">
                  <i className="ri-file-list-3-line text-xl"></i>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Planos Criados</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{isLoading ? "-" : lessonPlans?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-secondary/10 text-secondary">
                  <i className="ri-time-line text-xl"></i>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Tempo Economizado</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{isLoading ? "-" : (lessonPlans?.length || 0) * 2}h</p>
                    <p className="ml-2 text-sm text-gray-600">estimado</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-accent/10 text-accent">
                  <i className="ri-share-line text-xl"></i>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Compartilhados</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                    <p className="ml-2 text-sm text-gray-600">planos</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100 text-yellow-600">
                  <i className="ri-star-line text-xl"></i>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Favoritos</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                    <p className="ml-2 text-sm text-gray-600">modelos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Plans */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Planos Recentes</h2>
              <Link href="/my-plans" className="text-sm font-medium text-primary hover:text-primary/90">
                Ver todos
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-red-500">Erro ao carregar planos de aula</p>
                </CardContent>
              </Card>
            ) : lessonPlans && lessonPlans.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                    {lessonPlans.slice(0, 3).map((plan) => (
                      <tr key={plan.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <i className="ri-file-text-line text-xl"></i>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                              <div className="text-sm text-gray-500">{plan.grade}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{plan.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            plan.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {plan.status === 'completed' ? 'Completo' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link href={`/plan/${plan.id}`}>
                              <button type="button" className="text-gray-400 hover:text-gray-500">
                                <i className="ri-eye-line"></i>
                              </button>
                            </Link>
                            <Link href={`/plan/${plan.id}`}>
                              <button type="button" className="text-gray-400 hover:text-gray-500">
                                <i className="ri-edit-line"></i>
                              </button>
                            </Link>
                            <button type="button" className="text-gray-400 hover:text-gray-500">
                              <i className="ri-more-2-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">Nenhum plano de aula criado ainda</p>
                  <Link href="/create-plan">
                    <Button className="mt-4">Criar primeiro plano</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Template Suggestions */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Modelos Recomendados</h2>
              <Link href="/templates" className="text-sm font-medium text-primary hover:text-primary/90">
                Ver biblioteca
              </Link>
            </div>
            
            {templatesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : templates && templates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.slice(0, 3).map((template) => (
                  <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300">
                    <div className="h-36 bg-gray-100 relative">
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
                          {template.grade.includes('infantil') ? 'Educação Infantil' : 
                           template.grade.includes('fundamental') ? 'Ensino Fundamental' : 
                           'Ensino Médio'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{template.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{template.objectives.substring(0, 60)}...</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {template.subject} | {template.grade.replace('_', '-')}
                        </span>
                        <Link href={`/create-plan?templateId=${template.id}`}>
                          <button type="button" className="text-primary hover:text-primary/90">
                            <i className="ri-add-line text-lg"></i>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">Nenhum modelo disponível no momento</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
