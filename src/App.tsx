import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import HomePage from './pages/HomePage'
import UsersPage from './pages/UsersPage'
import ContentsPage from './pages/ContentsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/contenus" element={<ContentsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
