import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Content, Category } from "../../api/contents";
import CategoryChip from "./CategoryChip";

interface ArticlePreviewModalProps {
  article: Content;
  category: Category | undefined;
  onClose: () => void;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR");
}

export default function ArticlePreviewModal({
  article,
  category,
  onClose,
}: ArticlePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-base font-semibold text-gray-800">
                {article.title}
              </h2>
              <CategoryChip category={category} />
            </div>
            {article.description && (
              <p className="text-sm text-gray-500">{article.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
              <span>Créé le {formatDate(article.createdAt)}</span>
              <span>Modifié le {formatDate(article.updatedAt)}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>

        <div className="overflow-y-auto p-6">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </div>
  );
}
