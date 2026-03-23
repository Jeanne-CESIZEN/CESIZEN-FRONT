import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { UpdateUserForm } from "../../schemas/user";

interface UserFormFieldsProps {
  register: UseFormRegister<UpdateUserForm>;
  errors: FieldErrors<UpdateUserForm>;
}

export default function UserFormFields({ register, errors }: UserFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Prénom" error={errors.firstname?.message}>
          <input {...register("firstname")} placeholder="Jeanne" />
        </Field>
        <Field label="Nom" error={errors.lastname?.message}>
          <input {...register("lastname")} placeholder="Grenet" />
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} type="email" placeholder="jeanne@exemple.fr" />
      </Field>

      <Field label="Rôle" error={errors.role?.message}>
        <select {...register("role")}>
          <option value="USER">Utilisateur</option>
          <option value="ADMIN">Administrateur</option>
        </select>
      </Field>
    </>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactElement;
}

export function Field({ label, error, children }: FieldProps) {
  const inputClass =
    "w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white " +
    (error ? "border-red-300" : "border-gray-200");

  const child = { ...children, props: { ...children.props, className: inputClass } };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {child}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
