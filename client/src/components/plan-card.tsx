import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Edit2, MoreHorizontal, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LessonPlan } from "@shared/schema";

interface PlanCardProps {
  plan: LessonPlan;
  onDelete?: (id: number) => void;
  listView?: boolean;
}

export function PlanCard({ plan, onDelete, listView = false }: PlanCardProps) {
  const formattedDate = new Date(plan.createdAt).toLocaleDateString("pt-BR");
  
  // Convert grade to readable format
  const getGradeText = (grade: string) => {
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

  // Convert subject to readable format
  const getSubjectText = (subject: string) => {
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

  // Convert status to readable format
  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      draft: "Rascunho",
      completed: "Completo",
    };
    return statuses[status] || status;
  };

  if (listView) {
    return (
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{plan.title}</div>
              <div className="text-sm text-gray-500">{getGradeText(plan.grade)}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{getSubjectText(plan.subject)}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{formattedDate}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Badge variant={plan.status === "completed" ? "success" : "outline"}>
            {getStatusText(plan.status)}
          </Badge>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-3">
            <Link href={`/plan/${plan.id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/plan/${plan.id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit2 className="h-4 w-4" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                <DropdownMenuItem>Exportar PDF</DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => onDelete && onDelete(plan.id)}
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="h-12 bg-primary/10 flex items-center px-4">
          <Badge variant={plan.status === "completed" ? "success" : "outline"} className="ml-auto">
            {getStatusText(plan.status)}
          </Badge>
        </div>
        <div className="p-4">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mr-3">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-1">{plan.title}</h3>
              <p className="text-sm text-gray-500">{getSubjectText(plan.subject)} | {getGradeText(plan.grade)}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 line-clamp-3 mb-4">
            {plan.objectives}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formattedDate}
            </div>
            <div className="text-sm text-gray-500">{plan.duration} min</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Link href={`/plan/${plan.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
        </Link>
        <Link href={`/plan/${plan.id}`}>
          <Button size="sm">
            <Edit2 className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
