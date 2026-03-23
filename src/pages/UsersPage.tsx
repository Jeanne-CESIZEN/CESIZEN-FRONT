import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Plus, Pencil, Ban, Trash2 } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateUserModal from "../components/users/CreateUserModal";
import EditUserModal from "../components/users/EditUserModal";
import {
  getUsers,
  deleteUser,
  activateUser,
  deactivateUser,
  type User,
} from "../api/users";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR");
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function openCreateModal() {
    setCreateOpen(true);
  }

  function openEditModal(user: User) {
    setEditUser(user);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?"))
      return;
    try {
      await deleteUser(id);
      await fetchUsers();
      toast.success("Utilisateur supprimé.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  }

  async function handleToggleStatus(user: User) {
    try {
      await (user.isActive ? deactivateUser(user.id) : activateUser(user.id));
      await fetchUsers();
      toast.success(user.isActive ? "Utilisateur désactivé." : "Utilisateur activé.");
    } catch {
      toast.error("Erreur lors de la modification du statut.");
    }
  }

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    return fullName.includes(q) || user.email.toLowerCase().includes(q);
  });

  return (
    <MainLayout pageTitle="Comptes utilisateurs" username="Admin" role="Admin">
      {createOpen && (
        <CreateUserModal onClose={() => setCreateOpen(false)} onSuccess={fetchUsers} />
      )}
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSuccess={fetchUsers} />
      )}

      {/* Search + button row */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white w-72"
          />
        </div>

        <Button onClick={openCreateModal}>
          <Plus />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        {loading ? (
          <p className="px-6 py-8 text-sm text-gray-500">Chargement...</p>
        ) : error ? (
          <p className="px-6 py-8 text-sm text-red-500">{error}</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  "NOM",
                  "EMAIL",
                  "RÔLE",
                  "STATUT",
                  "INSCRIPTION",
                  "ACTIONS",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-400 tracking-wide"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-sm text-gray-400 text-center"
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {user.firstname} {user.lastname}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "role-admin" : "role-user"
                        }
                      >
                        {user.role === "ADMIN"
                          ? "Administrateur"
                          : "Utilisateur"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.isActive ? "active" : "inactive"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" title="Modifier" onClick={() => openEditModal(user)}>
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title={user.isActive ? "Désactiver" : "Activer"} onClick={() => handleToggleStatus(user)} className="text-orange-400 hover:text-orange-600">
                          <Ban />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title="Supprimer" onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </MainLayout>
  );
}
