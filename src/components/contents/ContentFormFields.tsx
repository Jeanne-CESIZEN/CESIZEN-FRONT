import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { ContentForm, Category } from "../../schemas/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface ContentFormFieldsProps {
  register: UseFormRegister<ContentForm>;
  errors: FieldErrors<ContentForm>;
  control: Control<ContentForm>;
  categories: Category[];
}

export default function ContentFormFields({ register, errors, control, categories }: ContentFormFieldsProps) {
  return (
    <>
      <Field label="Titre" required error={errors.title?.message}>
        <Input {...register("title")} placeholder="Titre de l'article" />
      </Field>

      <Field label="Description courte" error={errors.description?.message}>
        <Input {...register("description")} placeholder="Résumé en une phrase (optionnel)" />
      </Field>

      <Field label="Contenu" required error={errors.content?.message}>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Contenu complet de l'article..."
            />
          )}
        />
      </Field>

      <Field label="Catégorie" required error={errors.categoryId?.message}>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Choisir une catégorie...">
                  {categories.find((c) => c.id === field.value)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>
    </>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
