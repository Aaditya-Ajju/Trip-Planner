import { Calendar, MapPin, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

const TripCard = ({ trip, onEdit, onDelete }) => {
  return (
    <div className="trip-card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">{trip.city}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(trip)}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-300"
          >
            <Edit className="h-4 w-4 text-gray-300" />
          </button>
          <button
            onClick={() => onDelete(trip._id)}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-300"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-300">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {format(new Date(trip.startDate), 'MMM dd, yyyy')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
          </span>
        </div>
        
        {trip.notes && (
          <div className="text-sm text-gray-200 bg-white bg-opacity-5 p-3 rounded-lg">
            {trip.notes}
          </div>
        )}
        
        <div className="text-xs text-gray-400">
          Created {format(new Date(trip.createdAt), 'MMM dd, yyyy')}
        </div>
      </div>
    </div>
  )
}

export default TripCard