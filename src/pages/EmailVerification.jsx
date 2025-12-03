import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function EmailVerification() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmail, resendVerificationCode, getVerificationCode } = useAuth()
  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState(null)
  const [verified, setVerified] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [verificationCode, setVerificationCode] = useState(location.state?.code || null)

  useEffect(() => {
    if (!email) {
      // Try to get email from localStorage
      const pendingUser = localStorage.getItem('crypto_wallet_pending_verification')
      if (pendingUser) {
        const userData = JSON.parse(pendingUser)
        setEmail(userData.email)
      } else {
        navigate('/signup')
      }
    }
  }, [email, navigate])

  useEffect(() => {
    // Get verification code for display (demo purposes)
    if (email) {
      const code = getVerificationCode(email)
      if (code) {
        setVerificationCode(code)
      }
    }
  }, [email, getVerificationCode])

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return // Only allow single digit
    if (!/^\d*$/.test(value)) return // Only allow numbers

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('')
      setCode(newCode)
      // Focus last input
      const lastInput = document.getElementById('code-5')
      if (lastInput) lastInput.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const verificationCode = code.join('')

    if (verificationCode.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter the complete 6-digit code' })
      return
    }

    setLoading(true)
    setMessage(null)

    const result = await verifyEmail(email, verificationCode)

    if (result.success) {
      setVerified(true)
      setMessage({ type: 'success', text: 'Email verified successfully! Redirecting...' })
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } else {
      setMessage({ type: 'error', text: result.error })
      setCode(['', '', '', '', '', ''])
      // Focus first input
      const firstInput = document.getElementById('code-0')
      if (firstInput) firstInput.focus()
    }
    setLoading(false)
  }

  const handleResend = async () => {
    setResending(true)
    setMessage(null)

    const result = await resendVerificationCode(email)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setCode(['', '', '', '', '', ''])
      if (result.code) {
        setVerificationCode(result.code)
      }
    } else {
      setMessage({ type: 'error', text: result.error })
    }

    setResending(false)
  }

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">📧</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a verification code to
            </p>
            <p className="text-gray-800 font-semibold mt-1">{email}</p>
          </div>

          {/* Demo: Show Verification Code */}
          {verificationCode && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">Demo Mode:</p>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  {showCode ? 'Hide' : 'Show'} Code
                </button>
              </div>
              {showCode && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-300">
                  <p className="text-xs text-gray-600 mb-1">Your verification code:</p>
                  <p className="text-2xl font-bold text-indigo-700 text-center tracking-wider">
                    {verificationCode}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    ⚠️ In production, this would be sent via email
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                Enter 6-digit code
              </label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-xl font-medium flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend Code'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link to="/signin" className="text-sm text-gray-600 hover:text-gray-800">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

