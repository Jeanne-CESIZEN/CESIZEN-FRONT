import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  UpdateUserSchema,
  type UpdateUserForm,
  type User,
} from "../../schemas/user";
import { updateUser } from "../../api/users";
import UserFormFields from "./UserFormFields";
import { Button } from "@/components/ui/button";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({
  user,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">
            Modifier l'utilisateur
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
