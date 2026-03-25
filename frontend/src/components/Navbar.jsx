import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/feed" className="text-xl font-bold text-blue-600">
        OpenCollab
      </Link>
      {user ? (
        <div className="flex items-center gap-6">
          <Link to="/feed" className="text-gray-600 hover:text-blue-600 text-sm">
            Browse
          </Link>
          <Link to="/projects/create" className="text-gray-600 hover:text-blue-600 text-sm">
            Post Project
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm">
            Dashboard
          </Link>
          <span className="text-sm text-gray-500">Hi, {user.username}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">Login</Link>
          <Link to="/register" className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  )
}