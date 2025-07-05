import { Link } from 'react-router-dom'
import { MapPin, Plane, Calendar, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { currentUser } = useAuth()

  const features = [
    {
      icon: MapPin,
      title: 'City Search',
      description: 'Find destinations worldwide with our comprehensive city database'
    },
    {
      icon: Plane,
      title: 'Trip Planning',
      description: 'Plan your perfect trip with dates, notes, and weather information'
    },
    {
      icon: Calendar,
      title: 'Save Trips',
      description: 'Keep track of all your planned adventures in one place'
    },
    {
      icon: User,
      title: 'Personal Profile',
      description: 'Manage your travel preferences and account settings'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="animate-float mb-8">
            <MapPin className="h-20 w-20 text-white mx-auto mb-4" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Smart Travel
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              Companion
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Plan, organize, and discover amazing destinations with WanderWise. 
            Your perfect trip is just a few clicks away.
          </p>
          
          {currentUser ? (
            <Link
              to="/dashboard"
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Go to Dashboard</span>
              <Plane className="h-5 w-5" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Get Started</span>
                <Plane className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Sign In</span>
                <User className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className={`glass-card rounded-xl p-6 text-center hover-lift animate-float-delay-${index % 3}`}
              >
                <Icon className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-200 text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home