import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)
    const result = await signUp(formData.email, formData.password, formData.name)

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: result.message,
        code: result.code // Include code in message for display
      })
      setTimeout(() => {
        navigate('/verify-email', { state: { email: formData.email, code: result.code } })
      }, 2000)
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl font-bold text-white">₿</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-700 font-medium">Join FinPay and start managing your crypto</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 transition-all duration-200 font-medium text-gray-800 placeholder:text-gray-400 bg-white ${
                  errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 transition-all duration-200 font-medium text-gray-800 placeholder:text-gray-400 bg-white ${
                  errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 transition-all duration-200 font-medium text-gray-800 placeholder:text-gray-400 bg-white ${
                  errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-600 text-xs mt-1 font-medium">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 transition-all duration-200 font-medium text-gray-800 placeholder:text-gray-400 bg-white ${
                  errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
            </div>

            {message && (
              <div className={`p-4 rounded-xl font-medium ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                  <span>{message.text}</span>
                </div>
                {message.code && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-green-300">
                    <p className="text-xs text-gray-600 mb-1">Demo: Your verification code:</p>
                    <p className="text-xl font-bold text-green-700 text-center tracking-wider">
                      {message.code}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      ⚠️ In production, this would be sent via email
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700 font-medium">
              Already have an account?{' '}
              <Link to="/signin" className="font-bold text-indigo-600 hover:text-indigo-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

