import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Home,
  FilePlus,
  FileText,
  LayoutTemplate,
  Calendar,
  Users,
  UserCircle,
  Link as LinkIcon,
  DollarSign,
} from "lucide-react";

interface SidebarProps {
  activePage:
    | "dashboard"
    | "create-plan"
    | "my-plans"
    | "templates"
    | "calendar"
    | "shared"
    | "profile"
    | "integrations"
    | "subscription";
}

export function Sidebar({ activePage }: SidebarProps) {
  const { user } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5 mr-3" />,
      active: activePage === "dashboard",
    },
    {
      name: "Novo Plano",
      href: "/create-plan",
      icon: <FilePlus className="h-5 w-5 mr-3" />,
      active: activePage === "create-plan",
    },
    {
      name: "Meus Planos",
      href: "/my-plans",
      icon: <FileText className="h-5 w-5 mr-3" />,
      active: activePage === "my-plans",
    },
    {
      name: "Modelos",
      href: "/templates",
      icon: <LayoutTemplate className="h-5 w-5 mr-3" />,
      active: activePage === "templates",
    },
    {
      name: "Calendário",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5 mr-3" />,
      active: activePage === "calendar",
    },
    {
      name: "Compartilhados",
      href: "/shared",
      icon: <Users className="h-5 w-5 mr-3" />,
      active: activePage === "shared",
    },
  ];

  const settingsItems = [
    {
      name: "Perfil",
      href: "/profile",
      icon: <UserCircle className="h-5 w-5 mr-3" />,
      active: activePage === "profile",
    },
    {
      name: "Integrações",
      href: "/integrations",
      icon: <LinkIcon className="h-5 w-5 mr-3" />,
      active: activePage === "integrations",
    },
    {
      name: "Assinatura",
      href: "/subscription",
      icon: <DollarSign className="h-5 w-5 mr-3" />,
      active: activePage === "subscription",
    },
  ];

  return (
    <aside className="lg:block hidden bg-white border-r border-gray-200 overflow-y-auto h-screen">
      <nav className="mt-4 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  item.active
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Configurações
          </h3>
          <div className="mt-2 space-y-1">
            {settingsItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    item.active
                      ? "text-primary bg-primary/5"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-8 px-4">
        <div className="bg-primary/5 rounded-lg p-4">
          <h4 className="font-medium text-primary-800">Plano Iniciante</h4>
          <p className="text-sm text-primary-600 mt-1">
            Faça upgrade para recursos avançados.
          </p>
          <Button className="mt-3 w-full text-sm" size="sm">
            Upgrade Agora
          </Button>
        </div>
      </div>
    </aside>
  );
}
