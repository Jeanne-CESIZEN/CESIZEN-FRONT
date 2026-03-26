import { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  EmotionFormSchema,
  type EmotionForm,
  type Emotion,
  type DetailedEmotion,
} from "../../schemas/emotion";
import {
  updateBaseEmotion,
  addDetailedEmotion,
  removeDetailedEmotion,
} from "../../api/emotions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditEmotionModalProps {
  emotion: Emotion;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEmotionModal({
  emotion,
  onClose,
  onSuccess,
}: EditEmotionModalProps) {
  const [detailedEmotions, setDetailedEmotions] = useState<DetailedEmotion[]>(
    emotion.detailedEmotions
  );
  const [newSubName, setNewSubName] = useState("");
  const [addingSubEmotion, setAddingSubEmotion] = useState(false);
  const newSubInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmotionForm>({
    resolver: zodResolver(EmotionFormSchema),
    defaultValues: {
      name: emotion.name,
      emoji: emotion.emoji ?? "",
      color: emotion.color ?? "",
      score: emotion.score,
      order: emotion.order,
    },
  });

  const watchedColor = useWatch({ control, name: "color", defaultValue: emotion.color ?? "" });

  async function onSubmit(data: EmotionForm) {
    try {
      await updateBaseEmotion(emotion.id, data);
      toast.success("Émotion modifiée.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erreur lors de la modification.");
    }
  }

  async function handleAddSubEmotion() {
    const name = newSubName.trim();
    if (!name) return;
    setAddingSubEmotion(true);
    try {
      const created = await addDetailedEmotion(emotion.id, name);
      setDetailedEmotions((prev) => [...prev, created]);
      setNewSubName("");
      newSubInputRef.current?.focus();
    } catch {
      toast.error("Erreur lors de l'ajout.");
    } finally {
      setAddingSubEmotion(false);
    }
  }

  async function handleRemoveSubEmotion(subId: string) {
    try {
      await removeDetailedEmotion(subId);
      setDetailedEmotions((prev) => prev.filter((s) => s.id !== subId));
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 500) {
        toast.error(
          "Impossible de supprimer : cette sous-émotion est utilisée dans des entrées du tracker."
        );
      } else {
        toast.error("Erreur lors de la suppression.");
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">
            Modifier l'émotion
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

          {/* Score + Order */}
          <div className="flex gap-3">
            <div className="space-y-1.5 flex-1">
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
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="order">Ordre</Label>
              <Input
                id="order"
                type="number"
                min={0}
                aria-invalid={!!errors.order}
                {...register("order", { valueAsNumber: true })}
              />
              {errors.order && (
                <p className="text-xs text-destructive">
                  {errors.order.message}
                </p>
              )}
            </div>
          </div>

          {/* Sub-emotions */}
          <div className="space-y-2">
            <Label>Sous-émotions</Label>
            <div className="flex flex-wrap gap-2 min-h-10 p-3 rounded-lg border border-gray-200 bg-gray-50">
              {detailedEmotions.length === 0 && (
                <span className="text-xs text-gray-400 self-center">
                  Aucune sous-émotion
                </span>
              )}
              {detailedEmotions.map((sub) => (
                <span
                  key={sub.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700"
                >
                  {sub.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubEmotion(sub.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                ref={newSubInputRef}
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="Nouvelle sous-émotion…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubEmotion();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!newSubName.trim() || addingSubEmotion}
                onClick={handleAddSubEmotion}
              >
                <Plus />
              </Button>
            </div>
          </div>

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
