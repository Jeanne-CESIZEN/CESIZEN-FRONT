import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Undo,
  Redo,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: placeholder ?? "Contenu de l'article..." }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border border-input overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-gray-50 px-2 py-1.5">
        <Button type="button" variant="ghost" size="icon-sm" title="Gras"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200 text-gray-900" : ""}
        ><Bold size={15} /></Button>

        <Button type="button" variant="ghost" size="icon-sm" title="Italique"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200 text-gray-900" : ""}
        ><Italic size={15} /></Button>

        <Button type="button" variant="ghost" size="icon-sm" title="Souligné"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-gray-200 text-gray-900" : ""}
        ><UnderlineIcon size={15} /></Button>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        <Button type="button" variant="ghost" size="icon-sm" title="Titre 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-gray-900" : ""}
        ><Heading2 size={15} /></Button>

        <Button type="button" variant="ghost" size="icon-sm" title="Titre 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "bg-gray-200 text-gray-900" : ""}
        ><Heading3 size={15} /></Button>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        <Button type="button" variant="ghost" size="icon-sm" title="Liste à puces"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200 text-gray-900" : ""}
        ><List size={15} /></Button>

        <Button type="button" variant="ghost" size="icon-sm" title="Liste numérotée"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200 text-gray-900" : ""}
        ><ListOrdered size={15} /></Button>

        <Button type="button" variant="ghost" size="icon-sm" title="Citation"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-gray-200 text-gray-900" : ""}
        ><Quote size={15} /></Button>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        <Button type="button" variant="ghost" size="icon-sm" title="Annuler"
          onClick={() => editor.chain().focus().undo().run()}
        ><Undo size={15} /></Button>

        <Button type="button" variant="ghost" size="icon-sm" title="Rétablir"
          onClick={() => editor.chain().focus().redo().run()}
        ><Redo size={15} /></Button>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-3 py-2 min-h-40"
      />
    </div>
  );
}
