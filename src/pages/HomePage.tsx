import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileText, Heart, FolderOpen, ArrowRight } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../hooks/useAuth";
import { getUsers, type User } from "../api/users";
import {
  getContents,
  getCategories,
  type Content,
  type Category,
} from "../api/contents";
import { getEmotions, type Emotion } from "../api/emotions";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface DashboardData {
  users: User[];
  contents: Content[];
  categories: Category[];
  emotions: Emotion[];
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstname = user?.firstname ?? "";

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [users, contents, categories, emotions] = await Promise.all([
          getUsers(),
          getContents(),
          getCategories(),
          getEmotions(),
        ]);
        setData({ users, contents, categories, emotions });
      } catch {
        // silently fail — stats simply won't show
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const recentUsers = data?.users
    .toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentContents = data?.contents
    .toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const categoryMap = new Map(data?.categories.map((c) => [c.id, c]));

  return (
    <MainLayout pageTitle="Tableau de bord">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {getGreeting()}, {firstname}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Voici un aperçu de votre plateforme CESIZen.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Utilisateurs",
                value: data?.users.length ?? 0,
                icon: Users,
                to: "/users",
                color: "text-blue-500 bg-blue-50",
              },
              {
                label: "Articles",
                value: data?.contents.length ?? 0,
                icon: FileText,
                to: "/contenus",
                color: "text-violet-500 bg-violet-50",
              },
              {
                label: "Catégories",
                value: data?.categories.length ?? 0,
                icon: FolderOpen,
                to: "/contenus?tab=categories",
                color: "text-amber-500 bg-amber-50",
              },
              {
                label: "Émotions",
                value: data?.emotions.length ?? 0,
                icon: Heart,
                to: "/emotions",
                color: "text-rose-500 bg-rose-50",
              },
            ].map(({ label, value, icon: Icon, to, color }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                className="bg-white rounded-2xl px-6 py-5 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{label}</p>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
              </button>
            ))}
          </div>

          {/* Bottom section: Recent users + Recent articles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent users */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">
                  Derniers utilisateurs
                </h2>
                <button
                  onClick={() => navigate("/users")}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Voir tout <ArrowRight size={12} />
                </button>
              </div>
              {recentUsers && recentUsers.length > 0 ? (
                <ul className="space-y-3">
                  {recentUsers.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {u.firstname[0]}
                          {u.lastname[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {u.firstname} {u.lastname}
                          </p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                            u.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {u.isActive ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Aucun utilisateur</p>
              )}
            </div>

            {/* Recent articles */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">
                  Articles récents
                </h2>
                <button
                  onClick={() => navigate("/contenus")}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Voir tout <ArrowRight size={12} />
                </button>
              </div>
              {recentContents && recentContents.length > 0 ? (
                <ul className="space-y-3">
                  {recentContents.map((c) => {
                    const cat = categoryMap.get(c.categoryId);
                    return (
                      <li
                        key={c.id}
                        className="flex items-center justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {c.title}
                          </p>
                          {c.description && (
                            <p className="text-xs text-gray-400 truncate">
                              {c.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4 shrink-0">
                          {cat && (
                            <span
                              className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: cat.color + "15",
                                color: cat.color,
                              }}
                            >
                              {cat.name}
                            </span>
                          )}
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {formatDate(c.createdAt)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Aucun article</p>
              )}
            </div>
          </div>

          {/* Emotions overview */}
          {data?.emotions && data.emotions.length > 0 && (
            <div className="bg-white rounded-2xl p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">
                  Émotions configurées
                </h2>
                <button
                  onClick={() => navigate("/emotions")}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Gérer <ArrowRight size={12} />
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {data.emotions
                  .toSorted((a, b) => b.score - a.score)
                  .map((emotion) => (
                    <div
                      key={emotion.id}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border"
                      style={{
                        borderColor: (emotion.color ?? "#e5e7eb") + "40",
                        backgroundColor: (emotion.color ?? "#f3f4f6") + "10",
                      }}
                    >
                      <span className="text-lg">{emotion.emoji}</span>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: emotion.color ?? "#374151" }}
                        >
                          {emotion.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {emotion.detailedEmotions.length} sous-émotion
                          {emotion.detailedEmotions.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}
