import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Change navbar style on scroll
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }

  const navbarClass = transparent && !isScrolled
    ? "bg-transparent"
    : "bg-white shadow-sm";

  const textClass = transparent && !isScrolled
    ? "text-white"
    : "text-gray-600";

  const brandClass = transparent && !isScrolled
    ? "text-white"
    : "text-primary";

  const brandAccentClass = transparent && !isScrolled
    ? "text-white"
    : "text-secondary";

  return (
    <nav className={`${navbarClass} py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className={`cursor-pointer font-bold text-2xl ${brandClass}`}>
                  aula<span className={brandAccentClass}>Mestra</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className={`${textClass} hover:text-primary font-medium transition duration-150`}
            >
              Recursos
            </a>
            <a 
              href="#how-it-works" 
              className={`${textClass} hover:text-primary font-medium transition duration-150`}
            >
              Como Funciona
            </a>
            <a 
              href="#pricing" 
              className={`${textClass} hover:text-primary font-medium transition duration-150`}
            >
              Planos
            </a>
            <a 
              href="#faq" 
              className={`${textClass} hover:text-primary font-medium transition duration-150`}
            >
              FAQ
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth">
              <Button 
                variant={transparent && !isScrolled ? "outline" : "link"} 
                className={transparent && !isScrolled ? "border-white text-white hover:bg-white/10" : "text-primary hover:text-primary/90"}
              >
                Entrar
              </Button>
            </Link>
            <Link href="/auth">
              <Button 
                variant={transparent && !isScrolled ? "secondary" : "default"}
                className={transparent && !isScrolled ? "bg-white text-primary hover:bg-gray-100" : ""}
              >
                Começar Grátis
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={textClass}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-6 flex flex-col space-y-4">
                  <Link href="/#features">
                    <a className="text-gray-600 font-medium py-2">Recursos</a>
                  </Link>
                  <Link href="/#how-it-works">
                    <a className="text-gray-600 font-medium py-2">Como Funciona</a>
                  </Link>
                  <Link href="/#pricing">
                    <a className="text-gray-600 font-medium py-2">Planos</a>
                  </Link>
                  <Link href="/#faq">
                    <a className="text-gray-600 font-medium py-2">FAQ</a>
                  </Link>
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <Link href="/auth">
                      <Button variant="link" className="mb-2 w-full justify-start px-0">
                        Entrar
                      </Button>
                    </Link>
                    <Link href="/auth">
                      <Button className="w-full">
                        Começar Grátis
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
