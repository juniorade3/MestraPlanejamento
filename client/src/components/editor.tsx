import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  Save,
  FilePlus,
  Download,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorProps {
  content: any;
  onChange?: (content: any) => void;
  onSave?: () => void;
  readOnly?: boolean;
}

export function Editor({ content, onChange, onSave, readOnly = false }: EditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  // To prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: typeof content === "string" ? content : JSON.stringify(content),
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      if (onChange) {
        onChange(json);
      }
    },
  });

  // Handle simple exports
  const exportPDF = () => {
    alert("Função de exportação para PDF será implementada.");
  };

  // Handle simple sharing
  const sharePlan = () => {
    alert("Função de compartilhamento será implementada.");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="border rounded-md">
      {!readOnly && (
        <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive("bold") && "bg-gray-200"
            )}
            title="Negrito (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive("italic") && "bg-gray-200"
            )}
            title="Itálico (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive("underline") && "bg-gray-200"
            )}
            title="Sublinhado (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <span className="w-px h-6 bg-gray-300 mx-1"></span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor?.chain().focus().setHeading({ level: 1 }).run()
            }
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive("heading", { level: 1 }) && "bg-gray-200"
            )}
            title="Título 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor?.chain().focus().setHeading({ level: 2 }).run()
            }
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive("heading", { level: 2 }) && "bg-gray-200"
            )}
            title="Título 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor?.chain().focus().setHeading({ level: 3 }).run()
            }
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive("heading", { level: 3 }) && "bg-gray-200"
            )}
            title="Título 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <span className="w-px h-6 bg-gray-300 mx-1"></span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive({ textAlign: "left" }) && "bg-gray-200"
            )}
            title="Alinhar à esquerda"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive({ textAlign: "center" }) && "bg-gray-200"
            )}
            title="Centralizar"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive({ textAlign: "right" }) && "bg-gray-200"
            )}
            title="Alinhar à direita"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive({ textAlign: "justify" }) && "bg-gray-200"
            )}
            title="Justificar"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
          <span className="w-px h-6 bg-gray-300 mx-1"></span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive("bulletList") && "bg-gray-200"
            )}
            title="Lista com marcadores"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor?.isActive("orderedList") && "bg-gray-200"
            )}
            title="Lista numerada"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className="h-8 w-8 p-0"
            title="Inserir tabela"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="prose max-w-none p-4">
        <EditorContent editor={editor} />
      </div>

      {!readOnly && (
        <div className="bg-gray-50 border-t p-3 flex justify-between">
          <div>
            <Button size="sm" variant="outline" onClick={exportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button size="sm" variant="outline" className="ml-2" onClick={sharePlan}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
          <div>
            <Button size="sm" variant="outline" className="mr-2">
              <FilePlus className="h-4 w-4 mr-2" />
              Duplicar
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
