import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import ExperienceDetails from './pages/ExperienceDetails'
import Reviews from './pages/Reviews'
import TripList from './pages/TripList'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminExperiences from './pages/admin/Experiences'
import AdminNewExperience from './pages/admin/NewExperience'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/viagens" element={<TripList />} />
      <Route path="/experiencia/:id" element={<ExperienceDetails />} />
      <Route path="/experiencia/:id/avaliacoes" element={<Reviews />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="experiencias" element={<AdminExperiences />} />
        <Route path="experiencias/nova" element={<AdminNewExperience />} />
      </Route>
    </Routes>
  )
}

export default App
