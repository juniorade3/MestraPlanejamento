import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

// Imagens
import teacher1 from "../assets/images/teacher1.svg";
import teacher2 from "../assets/images/teacher2.svg";
import teacher3 from "../assets/images/teacher3.svg";
import appScreenshot from "../assets/images/app-screenshot.svg";
import wizardImage from "../assets/images/wizard.svg";

const faqs = [
  {
    question: "Como a IA do aulaMestra entende a BNCC?",
    answer: "Nossa IA foi treinada com todo o conteúdo da Base Nacional Comum Curricular, além de milhares de planos de aula de qualidade. Isso permite que ela entenda os objetivos, habilidades e competências de cada série e disciplina, criando planos alinhados às exigências nacionais."
  },
  {
    question: "O upload de PDF funciona com qualquer formato?",
    answer: "Nossa plataforma consegue processar PDFs de texto bem formatados. Recomendamos que o documento tenha texto selecionável (não apenas imagens ou PDFs escaneados). Se tiver dúvidas, você pode fazer um teste com o plano gratuito antes de assinar."
  },
  {
    question: "Posso editar os planos gerados pela IA?",
    answer: "Sim! Todos os planos gerados são totalmente editáveis em nosso editor personalizado. Você pode modificar qualquer parte, adicionar ou remover conteúdo, e salvar diferentes versões do mesmo plano. Consideramos a IA como um ponto de partida para acelerar seu trabalho."
  },
  {
    question: "Como funciona o plano para escolas?",
    answer: "O plano Escola permite que até 10 professores tenham acesso à plataforma, além de criar um perfil de coordenação que pode visualizar e acompanhar o trabalho de todos. Ideal para manter a padronização nos planos de aula e facilitar a colaboração entre a equipe pedagógica."
  },
  {
    question: "Preciso ter conhecimento técnico para usar?",
    answer: "Não! O aulaMestra foi projetado para ser extremamente intuitivo. Nossa interface simplificada permite que qualquer professor, independente da familiaridade com tecnologia, possa gerar e personalizar planos de aula com facilidade."
  }
];

const features = [
  {
    icon: "ri-ai-generate",
    title: "IA Especializada em Educação",
    description: "Nossa inteligência artificial foi treinada para entender a BNCC e criar planos alinhados às diretrizes educacionais brasileiras."
  },
  {
    icon: "ri-time-line",
    title: "Economize Tempo",
    description: "Gere planos de aula completos em minutos, não em horas, e personalize conforme suas necessidades."
  },
  {
    icon: "ri-edit-2-line",
    title: "Editor Personalizado",
    description: "Edite, formate e adapte seus planos com nosso editor intuitivo que registra todas as versões."
  },
  {
    icon: "ri-file-upload-line",
    title: "Upload de Diretrizes",
    description: "Carregue o PDF das diretrizes da sua escola e a IA gerará planos totalmente alinhados à realidade local."
  },
  {
    icon: "ri-download-cloud-line",
    title: "Exportação Fácil",
    description: "Exporte seus planos em PDF, DOCX ou Google Docs e compartilhe com colegas ou coordenação."
  },
  {
    icon: "ri-team-line",
    title: "Colaboração em Equipe",
    description: "Trabalhe com outros professores em planos de aula e compartilhe conhecimento em sua escola."
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Add Remix Icon CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    document.head.appendChild(link);

    // Change document title
    document.title = "aulaMestra - Planos de Aula com IA para Professores";

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="font-bold text-2xl text-primary">aula<span className="text-secondary">Mestra</span></span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary font-medium transition duration-150">Recursos</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary font-medium transition duration-150">Como Funciona</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary font-medium transition duration-150">Planos</a>
              <a href="#faq" className="text-gray-600 hover:text-primary font-medium transition duration-150">FAQ</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="link" className="text-primary hover:text-primary/90">Entrar</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-primary hover:bg-primary/90">Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="landing-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">Planos de aula personalizados com Inteligência Artificial</h1>
              <p className="mt-6 text-lg md:text-xl text-blue-50">Economize tempo e crie planos de aula completos com base na BNCC ou nas diretrizes da sua escola.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/auth">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Começar Agora
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver Demonstração
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <img src={teacher1} alt="Professor" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src={teacher2} alt="Professor" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src={teacher3} alt="Professor" className="w-8 h-8 rounded-full border-2 border-white" />
                </div>
                <p className="text-sm text-blue-100">Mais de 10.000 professores já estão usando</p>
              </div>
            </div>
            <div className="hidden md:block">
              <img src={appScreenshot} alt="Dashboard do aulaMestra" className="rounded-lg shadow-xl w-full h-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Por que escolher o aulaMestra?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Nossa plataforma foi projetada por educadores para educadores.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card bg-gray-50 p-6 rounded-xl border border-gray-100 transition duration-300">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <i className={`${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Como funciona</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Simples, rápido e eficiente. Veja como criar seu plano de aula.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                  <h3 className="ml-4 text-xl font-semibold">Selecione a base</h3>
                </div>
                <p className="text-gray-600">Escolha entre usar a BNCC ou fazer upload do PDF com as diretrizes da sua escola para criar seu plano de aula.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                  <h3 className="ml-4 text-xl font-semibold">Defina os parâmetros</h3>
                </div>
                <p className="text-gray-600">Especifique série, disciplina, duração da aula, tópicos e outros detalhes para personalizar seu plano.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                  <h3 className="ml-4 text-xl font-semibold">Revise e edite</h3>
                </div>
                <p className="text-gray-600">Analise o plano gerado pela IA e faça ajustes utilizando nosso editor personalizado.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
                  <h3 className="ml-4 text-xl font-semibold">Salve e compartilhe</h3>
                </div>
                <p className="text-gray-600">Exporte seu plano no formato desejado e compartilhe com colegas ou sua coordenação pedagógica.</p>
              </div>
            </div>
            
            <div className="hidden md:block">
              <img src={wizardImage} alt="Assistente de criação de planos" className="rounded-lg shadow-xl w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div id="pricing" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Planos feitos para professores</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Escolha o plano ideal para suas necessidades e economize tempo em seu planejamento.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm transition duration-300 hover:shadow-md">
              <h3 className="text-2xl font-bold text-gray-900">Iniciante</h3>
              <p className="mt-2 text-gray-600">Perfeito para professores iniciando.</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">R$0</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">5 planos de aula por mês</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Baseados na BNCC</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Exportação em PDF</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Modelos básicos</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/auth">
                  <Button variant="secondary" className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                    Começar Grátis
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl border-2 border-primary shadow-lg transform md:-translate-y-4 transition duration-300 hover:shadow-xl relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">Popular</div>
              <h3 className="text-2xl font-bold text-gray-900">Professor</h3>
              <p className="mt-2 text-gray-600">Para professores que valorizam seu tempo.</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">R$29</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Planos ilimitados</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">BNCC + Upload PDF</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Exportação PDF e DOCX</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Biblioteca completa de modelos</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Compartilhamento com link</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Calendário integrado</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/auth">
                  <Button className="w-full">Assinar Agora</Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm transition duration-300 hover:shadow-md">
              <h3 className="text-2xl font-bold text-gray-900">Escola</h3>
              <p className="mt-2 text-gray-600">Para instituições de ensino completas.</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">R$99</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Tudo do plano Professor</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Até 10 professores</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Perfil de coordenação</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Colaboração em tempo real</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Estatísticas e relatórios</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-checkbox-circle-fill text-secondary mt-1"></i>
                  <span className="ml-3 text-gray-600">Integrações avançadas</span>
                </li>
              </ul>
              <div className="mt-8">
                <Button className="w-full bg-gray-800 text-white hover:bg-gray-900">Fale Conosco</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div id="faq" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Perguntas Frequentes</h2>
            <p className="mt-4 text-xl text-gray-600">Tire suas dúvidas sobre o aulaMestra.</p>
          </div>
          
          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg mb-2">
                  <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-900">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="landing-gradient text-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">Pronto para revolucionar seu planejamento?</h2>
          <p className="mt-6 text-xl text-blue-50 max-w-3xl mx-auto">Junte-se a milhares de professores que estão economizando tempo e criando planos de aula melhores com o aulaMestra.</p>
          <div className="mt-10">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8">
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <span className="font-bold text-2xl text-white">aula<span className="text-secondary">Mestra</span></span>
              <p className="mt-4">Transformando o planejamento de aulas com o poder da inteligência artificial.</p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                  <i className="ri-facebook-fill text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                  <i className="ri-instagram-fill text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                  <i className="ri-twitter-fill text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                  <i className="ri-youtube-fill text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition duration-150">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-white transition duration-150">Planos</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Integrações</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Atualizações</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition duration-150">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Contato</a></li>
                <li><a href="#faq" className="hover:text-white transition duration-150">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition duration-150">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Blog</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Termos</a></li>
                <li><a href="#" className="hover:text-white transition duration-150">Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} aulaMestra. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
