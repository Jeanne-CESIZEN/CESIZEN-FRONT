import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  ContentFormSchema,
  type Content,
  type ContentForm,
  type Category,
} from "../../schemas/content";
import { updateContent } from "../../api/contents";
import ContentFormFields from "./ContentFormFields";
import { Button } from "@/components/ui/button";

interface EditContentModalProps {
  content: Content;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditContentModal({
  content,
  categories,
  onClose,
  onSuccess,
}: EditContentModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContentForm>({
    resolver: zodResolver(ContentFormSchema),
    defaultValues: {
      title: content.title,
      description: content.description ?? "",
      content: content.content,
      categoryId: content.categoryId,
    },
  });

  async function onSubmit(data: ContentForm) {
    try {
      await updateContent(content.id, data);
      toast.success("Article modifié.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erreur lors de la modification.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">
            Modifier l'article
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ContentFormFields
            register={register}
            errors={errors}
            control={control}
            categories={categories}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
