'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function TwoFactor() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('tempUserId')
    if (!userId) {
      router.push('/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const userId = localStorage.getItem('tempUserId')

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/2fa/verify`, {
        userId,
        token: code,
      })

      localStorage.setItem('token', response.data.accessToken)
      localStorage.removeItem('tempUserId')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Código 2FA inválido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Verificación 2FA</h1>
        <p>Ingresa el código de 6 dígitos de Google Authenticator</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Código 2FA</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              placeholder="000000"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>

        <div className="link" onClick={() => router.push('/login')}>
          Volver al login
        </div>
      </div>
    </div>
  )
}
