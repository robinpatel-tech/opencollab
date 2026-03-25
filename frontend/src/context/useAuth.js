import { useContext } from 'react'
import { AuthContext } from './AuthContext.js'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    return { user: null, loginUser: () => {}, logoutUser: () => {} }
  }
  return context
}