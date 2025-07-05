import { useState, useEffect } from 'react'
import { 
  Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, 
  Eye, Gauge, Sunrise, Sunset, MapPin, Calendar 
} from 'lucide-react'

const EnhancedWeatherCard = ({ weather, city }) => {
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)

  const getWeatherIcon = (condition, size = 'h-8 w-8') => {
    const iconClass = `${size} drop-shadow-lg`
    
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <Sun className={`${iconClass} text-yellow-400`} />
      case 'clouds':
        return <Cloud className={`${iconClass} text-gray-300`} />
      case 'rain':
        return <CloudRain className={`${iconClass} text-blue-400`} />
      case 'snow':
        return <Cloud className={`${iconClass} text-blue-200`} />
      case 'thunderstorm':
        return <CloudRain className={`${iconClass} text-purple-400`} />
      default:
        return <Sun className={`${iconClass} text-yellow-400`} />
    }
  }

  const getWeatherGradient = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return 'from-yellow-400 to-orange-500'
      case 'clouds':
        return 'from-gray-400 to-gray-600'
      case 'rain':
        return 'from-blue-400 to-blue-600'
      case 'snow':
        return 'from-blue-200 to-blue-400'
      default:
        return 'from-yellow-400 to-orange-500'
    }
  }

  if (!weather) {
    return (
      <div className="weather-card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full mx-auto"></div>
          <div className="h-6 bg-white bg-opacity-20 rounded mx-auto w-20"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded mx-auto w-32"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-white bg-opacity-20 rounded"></div>
            <div className="h-4 bg-white bg-opacity-20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="weather-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          <span className="text-white font-medium">{city || weather.city}</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-300">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="text-center space-y-4">
        <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${getWeatherGradient(weather.main)} bg-opacity-20`}>
          {getWeatherIcon(weather.main, 'h-12 w-12')}
        </div>
        
        <div>
          <div className="text-4xl font-bold text-white mb-1">
            {Math.round(weather.temp || weather.temperature)}°C
          </div>
          <div className="text-lg text-gray-200 capitalize mb-2">
            {weather.description}
          </div>
          <div className="text-sm text-gray-300">
            Feels like {Math.round(weather.feelsLike || weather.temp)}°C
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <Wind className="h-5 w-5 text-blue-300 mx-auto mb-1" />
          <div className="text-sm text-gray-300">Wind</div>
          <div className="text-white font-semibold">{weather.windSpeed} m/s</div>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <Droplets className="h-5 w-5 text-blue-300 mx-auto mb-1" />
          <div className="text-sm text-gray-300">Humidity</div>
          <div className="text-white font-semibold">{weather.humidity}%</div>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <Eye className="h-5 w-5 text-blue-300 mx-auto mb-1" />
          <div className="text-sm text-gray-300">Visibility</div>
          <div className="text-white font-semibold">{weather.visibility || '10'} km</div>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <Gauge className="h-5 w-5 text-blue-300 mx-auto mb-1" />
          <div className="text-sm text-gray-300">Pressure</div>
          <div className="text-white font-semibold">{weather.pressure || '1013'} hPa</div>
        </div>
      </div>

      {/* Sun Times */}
      <div className="flex justify-between items-center bg-white bg-opacity-10 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Sunrise className="h-5 w-5 text-yellow-400" />
          <div>
            <div className="text-xs text-gray-300">Sunrise</div>
            <div className="text-white font-medium">{weather.sunrise || '06:30'}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Sunset className="h-5 w-5 text-orange-400" />
          <div>
            <div className="text-xs text-gray-300">Sunset</div>
            <div className="text-white font-medium">{weather.sunset || '18:45'}</div>
          </div>
        </div>
      </div>

      {/* Weather Tips */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 bg-opacity-20 rounded-lg p-3">
        <div className="text-sm text-white">
          <strong>Travel Tip:</strong> {getWeatherTip(weather.main, weather.temp)}
        </div>
      </div>
    </div>
  )
}

const getWeatherTip = (condition, temp) => {
  if (temp < 0) return "Bundle up! It's freezing outside."
  if (temp < 10) return "Dress warmly and consider layers."
  if (condition?.toLowerCase() === 'rain') return "Don't forget your umbrella!"
  if (condition?.toLowerCase() === 'clear' && temp > 25) return "Perfect weather for outdoor activities!"
  if (temp > 30) return "Stay hydrated and seek shade during peak hours."
  return "Great weather for exploring!"
}

export default EnhancedWeatherCard