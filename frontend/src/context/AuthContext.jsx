import { useState } from 'react'
import { AuthContext } from './AuthContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const username = localStorage.getItem('username')
      const userId = localStorage.getItem('userId')
      return { token, username, userId: parseInt(userId) }
    }
    return null
  })

  const loginUser = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    localStorage.setItem('userId', data.userId)
    setUser({ token: data.token, username: data.username, userId: data.userId })
  }

  const logoutUser = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}