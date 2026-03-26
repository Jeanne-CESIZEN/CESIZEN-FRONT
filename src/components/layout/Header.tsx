import { Menu } from 'lucide-react'

interface HeaderProps {
  title: string
  username: string
  role: string
  onMenuClick: () => void
}

export default function Header({ title, username, role, onMenuClick }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:inline">{username}</span>
        <span className="text-xs font-medium px-3 py-1 rounded-full border border-primary text-primary">
          {role}
        </span>
      </div>
    </header>
  )
}
