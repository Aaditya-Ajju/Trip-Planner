import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import axios from 'axios'
import toast from 'react-hot-toast'

const Profile = () => {
  const { currentUser, userProfile, fetchUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    location: '',
    bio: ''
  })

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        bio: userProfile.bio || ''
      })
    }
  }, [userProfile])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = await currentUser.getIdToken()
      await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      await fetchUserProfile(currentUser)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: userProfile?.displayName || '',
      phone: userProfile?.phone || '',
      location: userProfile?.location || '',
      bio: userProfile?.bio || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {userProfile?.displayName || currentUser?.displayName || 'User'}
              </h2>
              <p className="text-gray-300">{currentUser?.email}</p>
            </div>

            {/* Account Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-300">Email</p>
                  <p className="text-white">{currentUser?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Email Status</p>
                  <p className="text-white">
                    {currentUser?.emailVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`form-input pl-10 ${!isEditing ? 'bg-opacity-5' : ''}`}
                  placeholder="Enter your display name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`form-input pl-10 ${!isEditing ? 'bg-opacity-5' : ''}`}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`form-input pl-10 ${!isEditing ? 'bg-opacity-5' : ''}`}
                  placeholder="Enter your location"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows="4"
                className={`form-textarea ${!isEditing ? 'bg-opacity-5' : ''}`}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 pt-8 border-t border-white border-opacity-20">
          <h3 className="text-xl font-semibold text-white mb-4">Account Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
              <p className="text-2xl font-bold text-white">{userProfile?.tripsCount || 0}</p>
              <p className="text-sm text-gray-300">Trips Planned</p>
            </div>
            <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
              <p className="text-2xl font-bold text-white">{userProfile?.citiesCount || 0}</p>
              <p className="text-sm text-gray-300">Cities Visited</p>
            </div>
            <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
              <p className="text-2xl font-bold text-white">
                {userProfile?.createdAt ? new Date(userProfile.createdAt).getFullYear() : new Date().getFullYear()}
              </p>
              <p className="text-sm text-gray-300">Member Since</p>
            </div>
            <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
              <p className="text-2xl font-bold text-white">
                {currentUser?.emailVerified ? '✓' : '⚠️'}
              </p>
              <p className="text-sm text-gray-300">Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile