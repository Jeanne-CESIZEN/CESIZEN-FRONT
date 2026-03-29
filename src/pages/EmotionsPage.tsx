import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import MainLayout from '../components/layout/MainLayout'
import EditEmotionModal from '../components/emotions/EditEmotionModal'
import CreateEmotionModal from '../components/emotions/CreateEmotionModal'
import { Button } from '@/components/ui/button'
import { getEmotions, deleteBaseEmotion, type Emotion } from '../api/emotions'

export default function EmotionsPage() {
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editEmotion, setEditEmotion] = useState<Emotion | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function fetchEmotions() {
    try {
      setLoading(true)
      setError(null)
      const data = await getEmotions()
      setEmotions(data)
    } catch {
      setError('Impossible de charger les émotions.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(emotion: Emotion) {
    if (!confirm(`Supprimer l'émotion "${emotion.name}" ?`)) return
    setDeletingId(emotion.id)
    try {
      await deleteBaseEmotion(emotion.id)
      setEmotions((prev) => prev.filter((e) => e.id !== emotion.id))
      toast.success('Émotion supprimée.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => { fetchEmotions() }, [])

  return (
    <MainLayout pageTitle="Tracker d'émotions">
      {editEmotion && (
        <EditEmotionModal
          emotion={editEmotion}
          onClose={() => setEditEmotion(null)}
          onSuccess={fetchEmotions}
        />
      )}
      {createOpen && (
        <CreateEmotionModal
          onClose={() => setCreateOpen(false)}
          onSuccess={fetchEmotions}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Gestion des émotions</h1>
          <p className="text-primary text-sm mt-1">Configurez les émotions et sous-émotions disponibles</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          Nouvelle émotion
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {emotions.map((emotion) => (
            <div key={emotion.id} className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{emotion.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{emotion.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: emotion.color ?? '#e5e7eb' }}
                      />
                      <span className="text-xs text-gray-400 font-mono">{emotion.color}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">Score {emotion.score}/5</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => setEditEmotion(emotion)} title="Modifier">
                    <Pencil size={15} className="text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(emotion)}
                    disabled={deletingId === emotion.id}
                    title="Supprimer"
                  >
                    <Trash2 size={15} className="text-red-400" />
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-400 mb-2">
                  Sous-émotions ({emotion.detailedEmotions.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {emotion.detailedEmotions.length === 0 ? (
                    <span className="text-xs text-gray-400">Aucune sous-émotion</span>
                  ) : (
                    emotion.detailedEmotions.map((sub) => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700"
                      >
                        {sub.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  )
}
