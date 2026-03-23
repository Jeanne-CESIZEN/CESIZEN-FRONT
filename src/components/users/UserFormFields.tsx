import { Controller } from "react-hook-form";
import type { Control, FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import type { UpdateUserForm } from "../../schemas/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormFieldsProps<T extends UpdateUserForm & FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
}

export default function UserFormFields<T extends UpdateUserForm & FieldValues>({
  register,
  errors,
  control,
}: UserFormFieldsProps<T>) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Prénom" error={errors.firstname?.message as string | undefined}>
          <Input {...register("firstname" as Parameters<typeof register>[0])} placeholder="Jeanne" />
        </Field>
        <Field label="Nom" error={errors.lastname?.message as string | undefined}>
          <Input {...register("lastname" as Parameters<typeof register>[0])} placeholder="Grenet" />
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message as string | undefined}>
        <Input {...register("email" as Parameters<typeof register>[0])} type="email" placeholder="jeanne@exemple.fr" />
      </Field>

      <Field label="Rôle" error={errors.role?.message as string | undefined}>
        <Controller
          name={"role" as Parameters<typeof control.register>[0]}
          control={control}
          render={({ field }) => (
            <Select value={field.value as string} onValueChange={field.onChange}>
              <SelectTrigger className="w-full h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Utilisateur</SelectItem>
                <SelectItem value="ADMIN">Administrateur</SelectItem>
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
