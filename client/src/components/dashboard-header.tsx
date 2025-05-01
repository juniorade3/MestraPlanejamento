import { useAuth } from "@/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, Menu } from "lucide-react";

export function DashboardHeader() {
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuRef]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return user?.username?.[0]?.toUpperCase() || "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="col-span-2 bg-white border-b border-gray-200 z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center lg:w-64">
          <div className="flex-shrink-0 lg:border-r lg:border-gray-200 lg:pr-4">
            <Link href="/dashboard">
              <span className="font-bold text-xl text-primary cursor-pointer">
                aula<span className="text-secondary">Mestra</span>
              </span>
            </Link>
          </div>
          <button
            type="button"
            className="lg:hidden ml-4 text-gray-500 hover:text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name || user?.username}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Meu Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
