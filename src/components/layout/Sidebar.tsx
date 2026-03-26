import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Users, FileText, Heart, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { label: 'Accueil', icon: Home, to: '/' },
  { label: 'Comptes utilisateurs', icon: Users, to: '/users' },
  { label: 'Contenus', icon: FileText, to: '/contenus' },
  { label: "Tracker d'émotions", icon: Heart, to: '/emotions' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Backdrop mobile/tablette */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#15171f] flex flex-col shrink-0 transition-transform duration-300
          lg:relative lg:z-auto lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6">
          <img src="/logo-hor.png" alt="Cesi Zen" className="h-8 w-auto" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-2 mb-3">
            Administration
          </p>
          <ul className="space-y-1">
            {navItems.map(({ label, icon: Icon, to }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-primary text-white font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Déconnexion */}
        <div className="px-4 py-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
