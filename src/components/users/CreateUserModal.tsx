import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { CreateUserSchema, type CreateUserForm } from "../../schemas/user";
import { createUser } from "../../api/users";
import UserFormFields, { Field } from "./UserFormFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "USER",
      password: "",
    },
  });

  async function onSubmit(data: CreateUserForm) {
    try {
      await createUser(data);
      toast.success("Utilisateur créé.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erreur lors de la création.");
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
            Ajouter un utilisateur
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <UserFormFields
            register={register}
            errors={errors}
            control={control}
          />

          <Field label="Mot de passe" required error={errors.password?.message}>
            <Input
              {...register("password")}
              type="password"
              placeholder="••••••••"
            />
          </Field>

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
