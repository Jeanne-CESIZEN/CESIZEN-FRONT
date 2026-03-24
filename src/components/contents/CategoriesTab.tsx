import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  deleteCategory,
  type Category,
  type Content,
} from "../../api/contents";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

interface CategoriesTabProps {
  categories: Category[];
  contents: Content[];
  onRefresh: () => void;
}

export default function CategoriesTab({
  categories,
  contents,
  onRefresh,
}: CategoriesTabProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  function getArticleCount(categoryId: string): number {
    return contents.filter((c) => c.categoryId === categoryId).length;
  }

  async function handleDelete(category: Category) {
    const count = getArticleCount(category.id);
    if (count > 0) {
      toast.error(
        `Impossible de supprimer "${category.name}" : ${count} article${
          count > 1 ? "s" : ""
        } y sont rattaché${count > 1 ? "s" : ""}.`
      );
      return;
    }
    if (!window.confirm(`Supprimer la catégorie "${category.name}" ?`)) return;
    try {
      await deleteCategory(category.id);
      onRefresh();
      toast.success("Catégorie supprimée.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  }

  return (
    <>
      {createOpen && (
        <CreateCategoryModal
          onClose={() => setCreateOpen(false)}
          onSuccess={onRefresh}
        />
      )}
      {editCategory && (
        <EditCategoryModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSuccess={onRefresh}
        />
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          Nouvelle catégorie
        </Button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">COULEUR</TableHead>
              <TableHead className="w-48">NOM</TableHead>
              <TableHead>DESCRIPTION</TableHead>
              <TableHead className="w-28">ARTICLES</TableHead>
              <TableHead className="w-28">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-sm text-gray-400 text-center"
                >
                  Aucune catégorie.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => {
                const count = getArticleCount(cat.id);
                return (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <span
                        className="inline-block w-4 h-4 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-800">
                      {cat.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {cat.description ?? (
                        <span className="text-gray-300">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{count}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500 hover:text-blue-700 gap-1.5"
                          onClick={() => setEditCategory(cat)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-red-400 hover:text-red-600"
                          onClick={() => handleDelete(cat)}
                          title={
                            count > 0
                              ? `${count} article(s) rattaché(s)`
                              : "Supprimer"
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
