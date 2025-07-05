import { useState, useEffect } from 'react'
import { 
  TrendingUp, MapPin, Calendar, Users, 
  Star, Clock, DollarSign, Camera 
} from 'lucide-react'
import { api } from '../config/api.js'

const TravelInsights = ({ destination }) => {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (destination) {
      fetchTravelInsights()
    }
  }, [destination])

  const fetchTravelInsights = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getCityInsights(destination)
      setInsights(data)
    } catch (error) {
      setError('No travel insights found for this city.')
      setInsights(null)
    } finally {
      setLoading(false)
    }
  }

  if (!destination) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300">Select a destination to see travel insights</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white bg-opacity-20 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white bg-opacity-20 rounded"></div>
            <div className="h-4 bg-white bg-opacity-20 rounded w-5/6"></div>
            <div className="h-4 bg-white bg-opacity-20 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Travel Insights</h3>
        </div>
        <p className="text-gray-300">Essential information for {destination}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stats-card text-center">
          <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{insights?.safetyRating}</div>
          <div className="text-sm text-gray-300">Safety Rating</div>
        </div>
        
        <div className="stats-card text-center">
          <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{insights?.touristRating}</div>
          <div className="text-sm text-gray-300">Tourist Rating</div>
        </div>
        
        <div className="stats-card text-center">
          <DollarSign className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-white">{insights?.budgetLevel}</div>
          <div className="text-sm text-gray-300">Budget Level</div>
        </div>
        
        <div className="stats-card text-center">
          <Clock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-white">{insights?.timeZone}</div>
          <div className="text-sm text-gray-300">Time Zone</div>
        </div>
      </div>

      {/* Best Time to Visit */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-green-400" />
          <h4 className="text-lg font-semibold text-white">Best Time to Visit</h4>
        </div>
        <div className="bg-green-500 bg-opacity-20 rounded-lg p-4">
          <p className="text-white font-medium">{insights?.bestTimeToVisit}</p>
          <p className="text-green-200 text-sm mt-1">
            Optimal weather conditions and fewer crowds
          </p>
        </div>
      </div>

      {/* Budget Information */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="h-5 w-5 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">Average Daily Cost</h4>
        </div>
        <div className="bg-blue-500 bg-opacity-20 rounded-lg p-4">
          <p className="text-white font-medium text-xl">{insights?.averageCost}</p>
          <p className="text-blue-200 text-sm mt-1">
            Including accommodation, meals, and activities
          </p>
        </div>
      </div>

      {/* Popular Attractions */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Camera className="h-5 w-5 text-purple-400" />
          <h4 className="text-lg font-semibold text-white">Must-See Attractions</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights?.mainAttractions && insights.mainAttractions.length > 0 ? (
            insights.mainAttractions.map((attraction, index) => (
              <div 
                key={index}
                className="bg-white bg-opacity-10 rounded-lg p-3 hover:bg-opacity-20 transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-bold">{attraction.name}</span>
                </div>
                {attraction.address && <div className="text-gray-300 text-xs ml-6">{attraction.address}</div>}
                {attraction.photo && <img src={attraction.photo} alt={attraction.name} className="rounded mt-2 w-24 h-16 object-cover" />}
                {attraction.description && <div className="text-gray-200 text-xs mt-1">{attraction.description}</div>}
                {attraction.rating && <div className="text-yellow-400 text-xs mt-1">Rating: {attraction.rating}</div>}
              </div>
            ))
          ) : (
            <div className="text-gray-400">No attractions found.</div>
          )}
        </div>
      </div>

      {/* Local Tips */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-5 w-5 text-yellow-400" />
          <h4 className="text-lg font-semibold text-white">Local Tips</h4>
        </div>
        <div className="space-y-3">
          {insights?.tips && insights.tips.length > 0 ? (
            insights.tips.map((tip, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 bg-white bg-opacity-10 rounded-lg p-3"
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-400 text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-200 text-sm">{tip}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No tips found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TravelInsights