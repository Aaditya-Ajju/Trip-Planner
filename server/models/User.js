import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  travelPreferences: {
    type: [String],
    default: []
  },
  stats: {
    tripsPlanned: {
      type: Number,
      default: 0
    },
    citiesVisited: {
      type: Number,
      default: 0
    },
    countriesVisited: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);