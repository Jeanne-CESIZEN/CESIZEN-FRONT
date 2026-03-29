import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { CategoryForm } from "../../schemas/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "@/components/ui/IconPicker";

interface CategoryFormFieldsProps {
  register: UseFormRegister<CategoryForm>;
  control: Control<CategoryForm>;
  errors: FieldErrors<CategoryForm>;
  colorValue: string;
}

export default function CategoryFormFields({
  register,
  control,
  errors,
  colorValue,
}: CategoryFormFieldsProps) {
  return (
    <>
      <Field label="Nom" error={errors.name?.message}>
        <Input {...register("name")} placeholder="Ex : Gestion du stress" />
      </Field>

      <Field label="Description" error={errors.description?.message}>
        <Input
          {...register("description")}
          placeholder="Description courte (optionnel)"
        />
      </Field>

      <Field label="Couleur" error={errors.color?.message}>
        <div className="flex items-center gap-3">
          <Input
            {...register("color")}
            type="color"
            className="h-9 w-14 cursor-pointer rounded-md border border-input p-1"
          />
          <span className="text-sm text-gray-500 font-mono">{colorValue}</span>
        </div>
      </Field>

      <Field label="Icône" error={errors.iconName?.message}>
        <Controller
          control={control}
          name="iconName"
          render={({ field }) => (
            <IconPicker value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
    </>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-600">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
