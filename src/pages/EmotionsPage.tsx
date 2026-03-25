import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import EditEmotionModal from '../components/emotions/EditEmotionModal'
import { Button } from '@/components/ui/button'
import { getEmotions, type Emotion } from '../api/emotions'

export default function EmotionsPage() {
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editEmotion, setEditEmotion] = useState<Emotion | null>(null)

  async function fetchEmotions() {
    try {
      setLoading(true)
      setError(null)
      const data = await getEmotions()
      setEmotions(data.sort((a, b) => a.order - b.order))
    } catch {
      setError('Impossible de charger les émotions.')
    } finally {
      setLoading(false)
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

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Gestion des émotions</h1>
        <p className="text-primary text-sm mt-1">Configurez les émotions et sous-émotions disponibles</p>
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
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => setEditEmotion(emotion)} title="Modifier">
                  <Pencil size={15} className="text-primary" />
                </Button>
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
