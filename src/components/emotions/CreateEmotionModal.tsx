import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { EmotionFormSchema, type EmotionForm } from "../../schemas/emotion";
import { createBaseEmotion } from "../../api/emotions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateEmotionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEmotionModal({
  onClose,
  onSuccess,
}: CreateEmotionModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmotionForm>({
    resolver: zodResolver(EmotionFormSchema),
    defaultValues: {
      name: "",
      emoji: "",
      color: "#7c1fe6",
      score: 3,
    },
  });

  const watchedColor = useWatch({ control, name: "color" });

  async function onSubmit(data: EmotionForm) {
    try {
      await createBaseEmotion(data);
      toast.success("Émotion créée.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erreur lors de la création.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">
            Nouvelle émotion
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Emoji + Name */}
          <div className="flex gap-3">
            <div className="space-y-1.5 w-24">
              <Label htmlFor="emoji">Emoji</Label>
              <Input
                id="emoji"
                placeholder="😊"
                aria-invalid={!!errors.emoji}
                {...register("emoji")}
              />
              {errors.emoji && (
                <p className="text-xs text-destructive">
                  {errors.emoji.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                placeholder="Joie"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label htmlFor="color">Couleur</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                aria-invalid={!!errors.color}
                className="h-9 w-14 cursor-pointer rounded-md border border-input p-1"
                {...register("color")}
              />
              <span className="text-sm text-gray-500 font-mono">
                {watchedColor}
              </span>
            </div>
            {errors.color && (
              <p className="text-xs text-destructive">{errors.color.message}</p>
            )}
          </div>

          {/* Score */}
          <div className="space-y-1.5">
            <Label htmlFor="score">Score (1–5)</Label>
            <Input
              id="score"
              type="number"
              min={1}
              max={5}
              aria-invalid={!!errors.score}
              {...register("score", { valueAsNumber: true })}
            />
            {errors.score && (
              <p className="text-xs text-destructive">
                {errors.score.message}
              </p>
            )}
          </div>

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
