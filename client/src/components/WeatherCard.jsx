import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react'

const WeatherCard = ({ weather }) => {
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-400" />
      case 'clouds':
        return <Cloud className="h-8 w-8 text-gray-300" />
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-400" />
      default:
        return <Sun className="h-8 w-8 text-yellow-400" />
    }
  }

  if (!weather) {
    return (
      <div className="weather-card">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full mx-auto mb-2"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded mb-2"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="weather-card">
      <div className="flex flex-col items-center space-y-2">
        {getWeatherIcon(weather.main)}
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {Math.round(weather.temp)}°C
          </div>
          <div className="text-sm text-gray-200 capitalize">
            {weather.description}
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-200">
          <div className="flex items-center space-x-1">
            <Wind className="h-4 w-4" />
            <span>{weather.windSpeed} m/s</span>
          </div>
          <div className="flex items-center space-x-1">
            <Droplets className="h-4 w-4" />
            <span>{weather.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard