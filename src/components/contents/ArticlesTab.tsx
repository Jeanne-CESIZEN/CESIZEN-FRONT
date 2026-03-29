import { useState } from "react";
import { toast } from "sonner";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteContent, type Content, type Category } from "../../api/contents";
import CreateContentModal from "./CreateContentModal";
import EditContentModal from "./EditContentModal";
import ArticlePreviewModal from "./ArticlePreviewModal";
import CategoryChip from "./CategoryChip";

interface ArticlesTabProps {
  contents: Content[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR");
}

export default function ArticlesTab({
  contents,
  categories,
  loading,
  error,
  onRefresh,
}: ArticlesTabProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [previewContent, setPreviewContent] = useState<Content | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Voulez-vous vraiment supprimer cet article ?")) return;
    try {
      await deleteContent(id);
      onRefresh();
      toast.success("Article supprimé.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  }

  function getCategory(categoryId: string): Category | undefined {
    return categories.find((c) => c.id === categoryId);
  }

  const filtered = contents.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.title.toLowerCase().includes(q) ||
      (c.description ?? "").toLowerCase().includes(q);
    const matchCategory =
      categoryFilter === "all" || c.categoryId === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <>
      {createOpen && (
        <CreateContentModal
          categories={categories}
          onClose={() => setCreateOpen(false)}
          onSuccess={onRefresh}
        />
      )}
      {editContent && (
        <EditContentModal
          content={editContent}
          categories={categories}
          onClose={() => setEditContent(null)}
          onSuccess={onRefresh}
        />
      )}
      {previewContent && (
        <ArticlePreviewModal
          article={previewContent}
          category={getCategory(previewContent.categoryId)}
          onClose={() => setPreviewContent(null)}
        />
      )}

      {/* Filters + button row */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full bg-white"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v ?? "all")}
        >
          <SelectTrigger className="rounded-full bg-white min-w-48">
            <SelectValue>
              {categoryFilter === "all"
                ? "Toutes les catégories"
                : categories.find((c) => c.id === categoryFilter)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => setCreateOpen(true)} className="ml-auto">
          <Plus />
          Nouvel article
        </Button>
      </div>

      {/* Article list */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500 py-8 text-center">Chargement...</p>
        ) : error ? (
          <p className="text-sm text-red-500 py-8 text-center">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">
            Aucun article trouvé.
          </p>
        ) : (
          filtered.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl px-6 py-4 flex items-start gap-4"
            >
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => setPreviewContent(article)}
              >
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800">
                    {article.title}
                  </span>
                  <CategoryChip category={getCategory(article.categoryId)} />
                </div>
                {article.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                  <span>Créé le {formatDate(article.createdAt)}</span>
                  <span>Modifié le {formatDate(article.updatedAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-700 gap-1.5"
                  onClick={() => setEditContent(article)}
                >
                  <Pencil size={14} />
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-red-400 hover:text-red-600"
                  onClick={() => handleDelete(article.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
