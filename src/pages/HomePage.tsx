import MainLayout from '../components/layout/MainLayout'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export default function HomePage() {
  const username = 'admin'

  return (
    <MainLayout pageTitle="Accueil" username={username} role="Admin">
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          {getGreeting()}, {username}
        </h1>
        <p className="text-primary text-sm mt-1">
          Comment vous sentez-vous aujourd'hui ?
        </p>
      </div>
    </MainLayout>
  )
}
