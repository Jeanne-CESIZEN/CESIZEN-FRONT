import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  CategoryFormSchema,
  type Category,
  type CategoryForm,
} from "../../schemas/content";
import { updateCategory } from "../../api/contents";
import CategoryFormFields from "./CategoryFormFields";
import { Button } from "@/components/ui/button";

interface EditCategoryModalProps {
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCategoryModal({
  category,
  onClose,
  onSuccess,
}: EditCategoryModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: category.name,
      description: category.description ?? "",
      color: category.color,
      iconName: category.iconName,
    },
  });
  const colorValue = useWatch({ control, name: "color" });

  async function onSubmit(data: CategoryForm) {
    try {
      await updateCategory(category.id, data);
      toast.success("Catégorie modifiée.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erreur lors de la modification.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">
            Modifier la catégorie
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CategoryFormFields
            register={register}
            errors={errors}
            colorValue={colorValue}
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
