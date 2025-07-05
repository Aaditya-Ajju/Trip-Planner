import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import TripCard from '../components/TripCard'
import LoadingSpinner from '../components/LoadingSpinner'
import axios from 'axios'
import toast from 'react-hot-toast'

const SavedTrips = () => {
  const [trips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // all, upcoming, past
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()

  useEffect(() => {
    fetchTrips()
  }, [currentUser])

  useEffect(() => {
    filterTrips()
  }, [trips, searchTerm, filter])

  const fetchTrips = async () => {
    try {
      const token = await currentUser.getIdToken()
      const response = await axios.get('/api/trips', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTrips(response.data)
    } catch (error) {
      toast.error('Failed to fetch trips')
    } finally {
      setLoading(false)
    }
  }

  const filterTrips = () => {
    let filtered = trips

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Date filter
    const currentDate = new Date()
    if (filter === 'upcoming') {
      filtered = filtered.filter(trip => new Date(trip.startDate) > currentDate)
    } else if (filter === 'past') {
      filtered = filtered.filter(trip => new Date(trip.endDate) < currentDate)
    }

    setFilteredTrips(filtered)
  }

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return
    }

    try {
      const token = await currentUser.getIdToken()
      await axios.delete(`/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTrips(trips.filter(trip => trip._id !== tripId))
      toast.success('Trip deleted successfully')
    } catch (error) {
      toast.error('Failed to delete trip')
    }
  }

  const handleEditTrip = (trip) => {
    // For now, just show a toast. In a real app, you'd navigate to an edit page
    toast.success('Edit functionality coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Saved Trips</h1>
          <p className="text-gray-200">Manage your travel plans</p>
        </div>
        <Link
          to="/trip-planner"
          className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>New Trip</span>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
              placeholder="Search trips by city or country..."
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-input pl-10 pr-8 appearance-none bg-white bg-opacity-10"
            >
              <option value="all">All Trips</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Trips</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={handleEditTrip}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || filter !== 'all' ? 'No trips found' : 'No trips yet'}
            </h3>
            <p className="text-gray-300">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start planning your first adventure!'}
            </p>
          </div>
          {(!searchTerm && filter === 'all') && (
            <Link
              to="/trip-planner"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Plan Your First Trip</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default SavedTrips