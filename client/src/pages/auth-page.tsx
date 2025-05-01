import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Change document title
    document.title = "aulaMestra - Entrar ou Registrar";
    
    // Add Remix Icon CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      name: "",
      role: "teacher",
      school: "",
    },
  });

  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterData) => {
    // Remove confirmPassword as it's not in the schema
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/">
              <span className="cursor-pointer font-bold text-3xl text-primary">aula<span className="text-secondary">Mestra</span></span>
            </Link>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">Bem-vindo!</h1>
            <p className="mt-2 text-gray-600">Comece a criar planos de aula incríveis</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Acessar sua conta</CardTitle>
                  <CardDescription>
                    Entre com seus dados para acessar a plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome de usuário</FormLabel>
                            <FormControl>
                              <Input placeholder="seu.usuario" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                          </>
                        ) : (
                          "Entrar"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="link" className="text-sm text-gray-600" asChild>
                    <Link href="#">Esqueceu sua senha?</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Criar uma conta</CardTitle>
                  <CardDescription>
                    Preencha os dados abaixo para se cadastrar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu Nome Completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome de usuário</FormLabel>
                            <FormControl>
                              <Input placeholder="seu.usuario" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="school"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Escola (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome da sua escola" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cadastrando...
                          </>
                        ) : (
                          "Cadastrar"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Ao se registrar, você concorda com nossos{" "}
              <Link href="#" className="text-primary hover:underline">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link href="#" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Hero image */}
      <div className="hidden md:flex flex-1 items-center landing-gradient p-10">
        <div className="text-white max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Transforme o planejamento de suas aulas com inteligência artificial
          </h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <i className="ri-check-line text-white bg-white/20 p-1 rounded-full mr-3 mt-1"></i>
              <span>Crie planos de aula baseados na BNCC ou nas diretrizes da sua escola</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-white bg-white/20 p-1 rounded-full mr-3 mt-1"></i>
              <span>Economize horas de planejamento com nossa IA especializada</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-white bg-white/20 p-1 rounded-full mr-3 mt-1"></i>
              <span>Personalize, edite e compartilhe seus planos facilmente</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-white bg-white/20 p-1 rounded-full mr-3 mt-1"></i>
              <span>Acesse uma biblioteca completa de modelos por série e disciplina</span>
            </li>
          </ul>
          <div className="p-4 bg-white/10 rounded-lg">
            <p className="italic text-blue-50">
              "O aulaMestra revolucionou minha preparação de aulas. O que me tomava horas agora leva minutos, e os planos são mais criativos e alinhados à BNCC."
            </p>
            <div className="mt-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/30"></div>
              <div className="ml-3">
                <p className="font-medium">Ana Silva</p>
                <p className="text-sm text-blue-100">Professora de História, São Paulo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
