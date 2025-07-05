import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, User, LogOut, Menu, X, Plane } from 'lucide-react'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: MapPin },
    { name: 'Trip Planner', path: '/trip-planner', icon: Plane },
    { name: 'Saved Trips', path: '/saved-trips', icon: MapPin },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">WanderWise</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                        location.pathname === item.path
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:bg-white hover:bg-opacity-10 p-2 rounded-lg transition-all duration-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-card m-4 rounded-lg">
          <div className="px-4 py-2 space-y-1">
            {currentUser ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                        location.pathname === item.path
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-all duration-300 w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar