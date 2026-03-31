import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useState, useEffect, useRef } from 'react'
import { getUnreadCount, getNotifications, markNotificationsRead } from '../services/api'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!user) return

    // Initial fetch
    getUnreadCount().then(res => setUnreadCount(res.data)).catch(console.error)

    // WebSocket for real-time notifications
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${user.token}` },
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (msg) => {
          const newNotif = JSON.parse(msg.body)
          setNotifications(prev => [newNotif, ...prev])
          setUnreadCount(prev => prev + 1)
        })
      }
    })

    client.activate()
    return () => client.deactivate()
  }, [user])

  const toggleDropdown = async () => {
    if (!showDropdown) {
      const res = await getNotifications()
      setNotifications(res.data)
    } else {
      await markNotificationsRead()
      setUnreadCount(0)
    }
    setShowDropdown(!showDropdown)
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/feed" className="text-xl font-bold text-blue-600">
        OpenCollab
      </Link>
      
      {user ? (
        <div className="flex items-center gap-6">
          <Link to="/feed" className="text-gray-600 hover:text-blue-600 text-sm font-medium">Browse</Link>
          <Link to="/projects/create" className="text-gray-600 hover:text-blue-600 text-sm font-medium">Post Project</Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm font-medium">Dashboard</Link>
          <Link to="/profile" className="text-gray-600 hover:text-blue-600 text-sm font-medium">Profile</Link>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                  <button onClick={toggleDropdown} className="text-xs text-gray-400 hover:text-gray-600 underline">Close</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">No notifications yet.</div>
                  ) : notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                      <div className="flex-1">
                        <p className="text-xs text-gray-800 leading-snug">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-gray-200"></div>
          <span className="text-sm font-medium text-gray-700">Hi, {user.username}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 font-medium hover:bg-gray-200 px-4 py-2 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Login</Link>
          <Link to="/register" className="text-sm bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  )
}