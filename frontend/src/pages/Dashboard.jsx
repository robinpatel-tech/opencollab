import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getMyProjects, getMyApplications,
  getProjectApplications, updateApplicationStatus
} from '../services/api'

export default function Dashboard() {
  const [tab, setTab] = useState('myProjects')
  const [myProjects, setMyProjects] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [incomingApps, setIncomingApps] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getMyProjects().then(res => {
      setMyProjects(res.data)
      res.data.forEach(p => {
        getProjectApplications(p.id).then(a => {
          setIncomingApps(prev => [...prev, ...a.data])
        }).catch(() => {})
      })
    })
    getMyApplications().then(res => setMyApplications(res.data))
  }, [])

  const handleStatus = async (appId, status) => {
    await updateApplicationStatus(appId, status)
    setIncomingApps(prev =>
      prev.map(a => a.id === appId ? { ...a, status } : a)
    )
  }

  const statusBadge = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {[
          { key: 'myProjects', label: 'My Projects' },
          { key: 'incoming', label: `Incoming (${incomingApps.length})` },
          { key: 'applied', label: 'My Applications' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              tab === t.key
                ? 'bg-white text-gray-900 font-medium shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* My Projects */}
      {tab === 'myProjects' && (
        <div className="space-y-3">
          {myProjects.length === 0 ? (
            <p className="text-gray-400 text-sm">You haven't posted any projects yet.</p>
          ) : myProjects.map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{p.commitmentLevel} commitment</p>
              </div>
              <button
                onClick={() => navigate(`/projects/${p.id}`)}
                className="text-sm text-blue-600 hover:underline"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Incoming Applications */}
      {tab === 'incoming' && (
        <div className="space-y-3">
          {incomingApps.length === 0 ? (
            <p className="text-gray-400 text-sm">No applications received yet.</p>
          ) : incomingApps.map(app => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{app.applicantUsername}</p>
                  <p className="text-xs text-gray-400">for {app.projectTitle} · {app.roleAppliedFor}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge[app.status]}`}>
                  {app.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{app.message}</p>
              {app.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatus(app.id, 'ACCEPTED')}
                    className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatus(app.id, 'REJECTED')}
                    className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-lg hover:bg-red-100"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => navigate(`/chat/${app.applicantId}`)}
                    className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100"
                  >
                    Chat
                  </button>
                </div>
              )}
              {app.status === 'ACCEPTED' && (
                <button
                  onClick={() => navigate(`/chat/${app.applicantId}`)}
                  className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100"
                >
                  Open Chat
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* My Applications */}
      {tab === 'applied' && (
        <div className="space-y-3">
          {myApplications.length === 0 ? (
            <p className="text-gray-400 text-sm">You haven't applied to any projects yet.</p>
          ) : myApplications.map(app => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{app.projectTitle}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Role: {app.roleAppliedFor}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge[app.status]}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}