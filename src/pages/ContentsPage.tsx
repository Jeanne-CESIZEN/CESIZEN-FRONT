import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StatCard from "@/components/contents/StatCard";
import ArticlesTab from "@/components/contents/ArticlesTab";
import CategoriesTab from "@/components/contents/CategoriesTab";
import { getContents, getCategories, type Content, type Category } from "../api/contents";

export default function ContentsPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const [articlesData, categoriesData] = await Promise.all([
        getContents(),
        getCategories(),
      ]);
      setContents(articlesData);
      setCategories(categoriesData);
    } catch {
      setError("Impossible de charger les articles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainLayout pageTitle="Contenus">
      {/* Admin notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
        <ShieldAlert size={20} className="text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-700">
            Publication réservée aux administrateurs
          </p>
          <p className="text-xs text-blue-500 mt-0.5">
            Seuls les comptes administrateurs peuvent créer, modifier et
            supprimer des articles sur la plateforme.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Total articles" value={contents.length} color="text-gray-800" />
        <StatCard label="Catégories" value={categories.length} color="text-primary" />
      </div>

      <Tabs defaultValue="articles" className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <ArticlesTab
            contents={contents}
            categories={categories}
            loading={loading}
            error={error}
            onRefresh={fetchData}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab
            categories={categories}
            contents={contents}
            onRefresh={fetchData}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
