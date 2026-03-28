import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  ContentFormSchema,
  type ContentForm,
  type Category,
} from "../../schemas/content";
import { createContent } from "../../api/contents";
import ContentFormFields from "./ContentFormFields";
import { Button } from "@/components/ui/button";

interface CreateContentModalProps {
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateContentModal({
  categories,
  onClose,
  onSuccess,
}: CreateContentModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContentForm>({
    resolver: zodResolver(ContentFormSchema),
    defaultValues: { title: "", description: "", content: "", categoryId: "" },
  });

  async function onSubmit(data: ContentForm) {
    try {
      await createContent(data);
      toast.success("Article créé.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erreur lors de la création.");
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
            Nouvel article
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
              Créer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
