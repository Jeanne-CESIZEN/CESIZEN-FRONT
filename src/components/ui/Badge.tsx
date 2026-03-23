import type { ReactNode } from 'react'

type BadgeVariant = 'role-user' | 'role-admin' | 'active' | 'inactive'

const variantClasses: Record<BadgeVariant, string> = {
  'role-user': 'bg-blue-100 text-blue-700',
  'role-admin': 'bg-purple-100 text-purple-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-red-100 text-red-600',
}

type BadgeProps = {
  variant: BadgeVariant
  children: ReactNode
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${variantClasses[variant]}`}
    >
      {children}
    </span>
  )
}
