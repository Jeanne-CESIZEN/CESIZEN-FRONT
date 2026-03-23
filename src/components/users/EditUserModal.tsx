import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { UpdateUserSchema, type UpdateUserForm, type User } from "../../schemas/user";
import { updateUser } from "../../api/users";
import UserFormFields from "./UserFormFields";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateUserForm>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: { firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role },
  });

  async function onSubmit(data: UpdateUserForm) {
    try {
      await updateUser(user.id, data);
      toast.success("Utilisateur modifié.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erreur lors de la modification.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">Modifier l'utilisateur</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <UserFormFields register={register} errors={errors} />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-secondary transition-colors disabled:opacity-50">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
