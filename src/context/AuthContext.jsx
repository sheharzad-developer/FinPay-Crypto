import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Load users from localStorage
const loadUsers = () => {
  try {
    const stored = localStorage.getItem('crypto_wallet_users')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem('crypto_wallet_users', JSON.stringify(users))
}

// Load verification codes
const loadVerificationCodes = () => {
  try {
    const stored = localStorage.getItem('crypto_wallet_verification_codes')
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Save verification codes
const saveVerificationCodes = (codes) => {
  localStorage.setItem('crypto_wallet_verification_codes', JSON.stringify(codes))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(loadUsers())
  const [verificationCodes, setVerificationCodes] = useState(loadVerificationCodes())

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('crypto_wallet_current_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      // Check if user is verified
      if (userData.verified) {
        setUser(userData)
      } else {
        // Clear unverified user
        localStorage.removeItem('crypto_wallet_current_user')
      }
    }
  }, [])

  // Save users whenever they change
  useEffect(() => {
    saveUsers(users)
  }, [users])

  // Save verification codes whenever they change
  useEffect(() => {
    saveVerificationCodes(verificationCodes)
  }, [verificationCodes])

  // Sign up function
  const signUp = async (email, password, name) => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this should be hashed
      name,
      verified: false,
      createdAt: new Date().toISOString()
    }

    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Save user and verification code
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)

    const updatedCodes = {
      ...verificationCodes,
      [email]: {
        code: verificationCode,
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
      }
    }
    setVerificationCodes(updatedCodes)

    // Simulate sending email (in production, this would call an API)
    console.log(`📧 Verification email sent to ${email}`)
    console.log(`🔑 Verification code: ${verificationCode}`) // For demo purposes

    // Store unverified user temporarily
    localStorage.setItem('crypto_wallet_pending_verification', JSON.stringify(newUser))

    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.',
      email,
      code: verificationCode // Return code for demo display
    }
  }

  // Verify email
  const verifyEmail = (email, code) => {
    const codeData = verificationCodes[email]

    if (!codeData) {
      return { success: false, error: 'No verification code found. Please sign up again.' }
    }

    if (Date.now() > codeData.expiresAt) {
      return { success: false, error: 'Verification code expired. Please request a new one.' }
    }

    if (codeData.code !== code) {
      return { success: false, error: 'Invalid verification code' }
    }

    // Find and update user
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, verified: true }
      }
      return u
    })
    setUsers(updatedUsers)

    // Remove verification code
    const updatedCodes = { ...verificationCodes }
    delete updatedCodes[email]
    setVerificationCodes(updatedCodes)

    // Get verified user
    const verifiedUser = updatedUsers.find(u => u.email === email)
    setUser(verifiedUser)
    localStorage.setItem('crypto_wallet_current_user', JSON.stringify(verifiedUser))
    localStorage.removeItem('crypto_wallet_pending_verification')

    return { success: true, user: verifiedUser }
  }

  // Sign in function
  const signIn = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password)

    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' }
    }

    if (!foundUser.verified) {
      return { success: false, error: 'Please verify your email first', needsVerification: true }
    }

    setUser(foundUser)
    localStorage.setItem('crypto_wallet_current_user', JSON.stringify(foundUser))

    return { success: true, user: foundUser }
  }

  // Sign out function
  const signOut = () => {
    setUser(null)
    localStorage.removeItem('crypto_wallet_current_user')
  }

  // Resend verification code
  const resendVerificationCode = (email) => {
    const foundUser = users.find(u => u.email === email)
    if (!foundUser) {
      return { success: false, error: 'User not found' }
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const updatedCodes = {
      ...verificationCodes,
      [email]: {
        code: verificationCode,
        expiresAt: Date.now() + 15 * 60 * 1000
      }
    }
    setVerificationCodes(updatedCodes)

    console.log(`📧 Verification email resent to ${email}`)
    console.log(`🔑 Verification code: ${verificationCode}`) // For demo purposes

    return {
      success: true,
      message: 'Verification code resent! Please check your inbox.',
      code: verificationCode // Return code for demo display
    }
  }

  // Get verification code (for demo display)
  const getVerificationCode = (email) => {
    const codeData = verificationCodes[email]
    if (!codeData) return null
    
    // Check if expired
    if (Date.now() > codeData.expiresAt) return null
    
    return codeData.code
  }

  return (
    <AuthContext.Provider value={{
      user,
      signUp,
      signIn,
      signOut,
      verifyEmail,
      resendVerificationCode,
      getVerificationCode,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

