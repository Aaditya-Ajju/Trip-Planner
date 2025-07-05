import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  destination: {
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  budget: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'cancelled'],
    default: 'planned'
  },
  activities: [{
    name: String,
    description: String,
    date: Date,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  weather: {
    temperature: Number,
    description: String,
    icon: String,
    lastUpdated: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Trip', tripSchema);