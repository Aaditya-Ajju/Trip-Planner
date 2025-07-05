import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Search, MapPin, Calendar, FileText, Plus, 
  Globe, Clock, DollarSign, Users 
} from 'lucide-react'
import EnhancedWeatherCard from '../components/EnhancedWeatherCard'
import TravelInsights from '../components/TravelInsights'
import LoadingSpinner from '../components/LoadingSpinner'
import axios from 'axios'
import toast from 'react-hot-toast'

const TripPlanner = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [weather, setWeather] = useState(null)
  const [tripData, setTripData] = useState({
    startDate: '',
    endDate: '',
    notes: '',
    budget: '',
    travelers: 1,
    tripType: 'leisure'
  })
  const [loading, setLoading] = useState({
    search: false,
    weather: false,
    save: false
  })
  const [activeTab, setActiveTab] = useState('planning')
  const [searchError, setSearchError] = useState('')
  const debounceTimeout = useRef(null)
  
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const searchCities = async (query) => {
    if (!query.trim() || query.trim().length < 2) {
      setCities([])
      setSearchError('Type at least 2 letters to search cities')
      return
    }
    setSearchError('')
    setLoading({ ...loading, search: true })
    try {
      const response = await axios.get(`/api/cities/search?q=${query}`)
      let cityResults = response.data
      // If searching for 'London', put London, GB at the top if it exists
      if (query.trim().toLowerCase() === 'london') {
        const ukIndex = cityResults.findIndex(city => city.name.toLowerCase() === 'london' && city.countryCode === 'GB')
        if (ukIndex > 0) {
          const [ukLondon] = cityResults.splice(ukIndex, 1)
          cityResults.unshift(ukLondon)
        }
      }
      setCities(cityResults)
    } catch (error) {
      if (error.response?.status === 429) {
        setSearchError('You are searching too fast. Please wait a moment.')
      } else {
        setSearchError('Failed to search cities')
      }
      setCities([])
    } finally {
      setLoading({ ...loading, search: false })
    }
  }

  const handleSearchInput = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(() => {
      searchCities(value)
    }, 500)
  }

  const handleCitySelect = async (city) => {
    setSelectedCity(city)
    setCities([])
    setSearchTerm(city.name)
    
    // Fetch weather for selected city (use city name + countryCode)
    setLoading({ ...loading, weather: true })
    try {
      const cityQuery = city.countryCode ? `${city.name},${city.countryCode}` : city.name
      const response = await axios.get(`/api/weather/city?city=${encodeURIComponent(cityQuery)}`)
      setWeather(response.data)
    } catch (error) {
      toast.error('Failed to fetch weather data')
    } finally {
      setLoading({ ...loading, weather: false })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTripData({
      ...tripData,
      [name]: value
    })
  }

  const handleSaveTrip = async () => {
    if (!selectedCity || !tripData.startDate || !tripData.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading({ ...loading, save: true })
    try {
      const token = await currentUser.getIdToken()
      await axios.post('/api/trips', {
        title: `${selectedCity.name} Trip`,
        destination: {
          city: selectedCity.name,
          country: selectedCity.country,
          coordinates: {
            lat: selectedCity.latitude,
            lng: selectedCity.longitude
          }
        },
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        notes: tripData.notes,
        budget: tripData.budget,
        description: tripData.notes || '',
        // You can add more fields as needed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success('Trip saved successfully!')
      navigate('/saved-trips')
    } catch (error) {
      toast.error('Failed to save trip')
    } finally {
      setLoading({ ...loading, save: false })
    }
  }

  const tripTypes = [
    { value: 'leisure', label: 'Leisure', icon: '🏖️' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' },
    { value: 'romantic', label: 'Romantic', icon: '💕' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' }
  ]

  const tabs = [
    { id: 'planning', label: 'Trip Planning', icon: Calendar },
    { id: 'insights', label: 'Travel Insights', icon: Globe },
    { id: 'weather', label: 'Weather', icon: Clock }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8 slide-in-up">
        <div className="float-1 mb-4">
          <Globe className="h-16 w-16 text-white mx-auto" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Plan Your Perfect Trip</h1>
        <p className="text-xl text-gray-200">Search for destinations and create your dream itinerary</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8 slide-in-left">
        <div className="glass-card rounded-xl p-2 inline-flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Planning Form */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'planning' && (
            <div className="glass-card-premium rounded-2xl p-8 slide-in-right">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                Trip Details
              </h2>
              
              {/* City Search */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-white mb-3">
                  Destination *
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchInput}
                    className="form-input pl-12 text-lg"
                    placeholder="Search for a city..."
                  />
                  {searchError && (
                    <div className="text-red-400 text-sm mt-2">{searchError}</div>
                  )}
                  {loading.search && (
                    <div className="absolute right-4 top-4">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                </div>
                
                {/* City Search Results */}
                {cities.length > 0 && (
                  <div className="mt-3 glass-card rounded-xl max-h-60 overflow-y-auto">
                    {cities.map((city, index) => (
                      <button
                        key={index}
                        onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-6 py-4 hover:bg-white hover:bg-opacity-10 text-white transition-all duration-300 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-blue-400" />
                          <div>
                            <div className="font-medium">{city.name}</div>
                            <div className="text-sm text-gray-300">{city.country}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Trip Type */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-white mb-3">
                  Trip Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tripTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setTripData({ ...tripData, tripType: type.value })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        tripData.tripType === type.value
                          ? 'border-blue-400 bg-blue-500 bg-opacity-20'
                          : 'border-white border-opacity-20 hover:border-opacity-40'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-white font-medium text-sm">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range & Travelers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={tripData.startDate}
                      onChange={handleInputChange}
                      className="form-input pl-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    End Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={tripData.endDate}
                      onChange={handleInputChange}
                      className="form-input pl-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="travelers"
                      value={tripData.travelers}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      className="form-input pl-12"
                    />
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-white mb-3">
                  Budget (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="budget"
                    value={tripData.budget}
                    onChange={handleInputChange}
                    className="form-input pl-12"
                    placeholder="Enter your budget"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-white mb-3">
                  Notes & Preferences
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <textarea
                    name="notes"
                    value={tripData.notes}
                    onChange={handleInputChange}
                    rows="4"
                    className="form-textarea pl-12"
                    placeholder="Add any notes about your trip preferences, activities you'd like to do, or special requirements..."
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveTrip}
                disabled={loading.save || !selectedCity}
                className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-3"
              >
                {loading.save ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Plus className="h-6 w-6" />
                    <span>Save Trip</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="slide-in-left">
              <TravelInsights destination={selectedCity?.name} />
            </div>
          )}

          {activeTab === 'weather' && selectedCity && (
            <div className="slide-in-right">
              <EnhancedWeatherCard weather={weather} city={selectedCity.name} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected City Info */}
          {selectedCity && (
            <div className="glass-card rounded-xl p-6 slide-in-up">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Destination
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 bg-opacity-20 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">{selectedCity.name}</div>
                    <div className="text-gray-300">{selectedCity.country}</div>
                  </div>
                </div>
                {selectedCity.population && (
                  <div className="text-sm text-gray-300">
                    Population: {selectedCity.population.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Weather */}
          {weather && (
            <div className="fade-in-delay">
              <h3 className="text-lg font-bold text-white mb-4">Quick Weather</h3>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.round(weather.temp || weather.temperature)}°C
                </div>
                <div className="text-gray-200 capitalize">
                  {weather.description}
                </div>
              </div>
            </div>
          )}

          {/* Trip Planning Tips */}
          <div className="glass-card rounded-xl p-6 fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Planning Tips</h3>
            <div className="space-y-3">
              {[
                "Book flights 6-8 weeks in advance for best prices",
                "Check visa requirements early",
                "Research local customs and etiquette",
                "Consider travel insurance",
                "Pack according to weather and activities"
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-400 text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-200">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripPlanner