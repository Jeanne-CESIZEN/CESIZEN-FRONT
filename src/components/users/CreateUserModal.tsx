import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { CreateUserSchema, type CreateUserForm } from "../../schemas/user";
import { createUser } from "../../api/users";
import UserFormFields, { Field } from "./UserFormFields";

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateUserForm>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: { firstname: "", lastname: "", email: "", role: "USER", password: "" },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">Ajouter un utilisateur</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <UserFormFields register={register} errors={errors} />

          <Field label="Mot de passe" error={errors.password?.message}>
            <input {...register("password")} type="password" placeholder="••••••••" />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-secondary transition-colors disabled:opacity-50">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
