'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        email,
        password,
      })

      setQrCode(response.data.qrCode)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  if (qrCode) {
    return (
      <div className="container">
        <div className="card">
          <h1>¡Registro Exitoso!</h1>
          <p>Escanea este código QR con Google Authenticator</p>
          <div className="qr-container">
            <img src={qrCode} alt="QR Code" />
          </div>
          <button onClick={() => router.push('/login')}>
            Ir al Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Registro</h1>
        <p>Crea tu cuenta con autenticación 2FA</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="link" onClick={() => router.push('/login')}>
          ¿Ya tienes cuenta? Inicia sesión
        </div>
      </div>
    </div>
  )
}
