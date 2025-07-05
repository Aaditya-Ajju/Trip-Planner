import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  MapPin, Plane, Calendar, Plus, TrendingUp, 
  DollarSign, Globe, Clock, Star 
} from 'lucide-react'
import EnhancedWeatherCard from '../components/EnhancedWeatherCard'
import CurrencyConverter from '../components/CurrencyConverter'
import axios from 'axios'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth()
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    visitedCities: 0
  })
  const [recentTrips, setRecentTrips] = useState([])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [currentUser])

  const fetchDashboardData = async () => {
    try {
      const token = await currentUser.getIdToken()

      const tripsResponse = await axios.get('/api/trips', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const trips = tripsResponse.data
      const currentDate = new Date()
      const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > currentDate)
      const visitedCities = new Set(trips.map(trip => trip.city)).size

      setStats({
        totalTrips: trips.length,
        upcomingTrips: upcomingTrips.length,
        visitedCities
      })
      setRecentTrips(trips.slice(0, 3))

      // Find the city for the next upcoming trip, or fallback to Delhi
      let city = 'Delhi'
      if (upcomingTrips.length > 0 && upcomingTrips[0].city) {
        city = upcomingTrips[0].city
      }

      // Fetch weather for the selected city
      const weatherResponse = await axios.get(`/api/weather/city?city=${encodeURIComponent(city)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWeather(weatherResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Plan New Trip',
      description: 'Create a new travel plan',
      icon: Plus,
      path: '/trip-planner',
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'View Trips',
      description: 'Browse your saved trips',
      icon: MapPin,
      path: '/saved-trips',
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Edit Profile',
      description: 'Update your information',
      icon: Calendar,
      path: '/profile',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500'
    }
  ]

  const statCards = [
    {
      title: 'Total Trips',
      value: stats.totalTrips,
      icon: Plane,
      color: 'text-blue-400',
      bgColor: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Upcoming Trips',
      value: stats.upcomingTrips,
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Cities Visited',
      value: stats.visitedCities,
      icon: MapPin,
      color: 'text-purple-400',
      bgColor: 'from-purple-500 to-purple-600',
      change: '+15%'
    },
    {
      title: 'Travel Score',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500 to-orange-600',
      change: '+0.2'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner-gradient"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="slide-in-up">
        <div className="glass-card-premium rounded-2xl p-8 text-center">
          <div className="float-1 mb-4">
            <Globe className="h-16 w-16 text-white mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back, {userProfile?.displayName || currentUser?.displayName || 'Traveler'}!
          </h1>
          <p className="text-xl text-gray-200 mb-6">
            Ready to plan your next adventure? Your journey awaits!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/trip-planner" className="btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Plan New Trip
            </Link>
            <Link to="/saved-trips" className="btn-secondary">
              <MapPin className="h-5 w-5 mr-2" />
              View Trips
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-in-left">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="stats-card hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.bgColor} bg-opacity-20`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-400 font-medium">{stat.change}</div>
                </div>
              </div>
              <div>
                <p className="text-gray-300 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="slide-in-right">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={index}
                    to={action.path}
                    className="feature-card hover-lift group"
                  >
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${action.color} bg-opacity-20 mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {action.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Trips */}
          <div className="fade-in-delay">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                Recent Trips
              </h2>
              <Link
                to="/saved-trips"
                className="text-blue-200 hover:text-white text-sm font-medium transition-colors"
              >
                View All →
              </Link>
            </div>
            {recentTrips.length > 0 ? (
              <div className="space-y-4">
                {recentTrips.map((trip, index) => (
                  <div key={index} className="trip-card hover-lift">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 bg-opacity-20">
                          <MapPin className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{trip.city}</h3>
                          <p className="text-gray-300 text-sm">
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 rounded-full bg-green-500 bg-opacity-20 text-green-400 text-xs font-medium">
                          Upcoming
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-12 text-center">
                <div className="float-2 mb-6">
                  <Plane className="h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No trips planned yet</h3>
                <p className="text-gray-300 mb-6">Start your journey by planning your first adventure!</p>
                <Link to="/trip-planner" className="btn-primary">
                  <Plus className="h-5 w-5 mr-2" />
                  Plan Your First Trip
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <div className="slide-in-right">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Current Weather
            </h2>
            <EnhancedWeatherCard weather={weather} />
          </div>

          {/* Currency Converter */}
          <div className="fade-in-delay">
            <CurrencyConverter />
          </div>

          {/* Travel Tips */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              Travel Tips
            </h3>
            <div className="space-y-3">
              {[
                "Book flights on Tuesday for better deals",
                "Pack light and bring versatile clothing",
                "Download offline maps before traveling",
                "Keep digital copies of important documents"
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all duration-300">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-400 text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-200 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard