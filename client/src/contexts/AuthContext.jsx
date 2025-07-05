import { createContext, useContext, useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth'
import { auth } from '../firebase/config'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName })
    await sendEmailVerification(userCredential.user)
    
    // Create user profile in backend
    try {
      const token = await userCredential.user.getIdToken()
      await axios.post('/api/users/profile', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName,
        emailVerified: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
    
    return userCredential
  }

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    if (!userCredential.user.emailVerified) {
      // Sign out immediately if not verified
      await signOut(auth)
      throw new Error('Please verify your email before logging in.')
    }
    return userCredential
  }

  const logout = () => {
    return signOut(auth)
  }

  const fetchUserProfile = async (user) => {
    try {
      const token = await user.getIdToken()
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserProfile(response.data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Function to resend verification email
  const resendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      if (user) {
        fetchUserProfile(user)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    fetchUserProfile,
    resendVerificationEmail
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}