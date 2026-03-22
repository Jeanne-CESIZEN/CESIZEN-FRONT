interface HeaderProps {
  title: string
  username: string
  role: string
}

export default function Header({ title, username, role }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0">
      <span className="text-sm text-gray-600">{title}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{username}</span>
        <span className="text-xs font-medium px-3 py-1 rounded-full border border-primary text-primary">
          {role}
        </span>
      </div>
    </header>
  )
}
