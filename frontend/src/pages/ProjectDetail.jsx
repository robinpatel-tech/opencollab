import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, applyToProject, deleteProject } from '../services/api'
import { useAuth } from '../context/useAuth'

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [showApply, setShowApply] = useState(false)
  const [form, setForm] = useState({ message: '', roleAppliedFor: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getProject(id).then(res => setProject(res.data)).catch(console.error)
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    try {
      await applyToProject(id, form)
      setSuccess('Application sent successfully!')
      setShowApply(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this project?')) return
    await deleteProject(id)
    navigate('/feed')
  }

  if (!project) return <div className="text-center py-20 text-gray-400">Loading...</div>

  const isOwner = user?.userId === project.ownerId
  const commitmentColor = {
    LOW: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${commitmentColor[project.commitmentLevel]}`}>
            {project.commitmentLevel} commitment
          </span>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack?.map(t => (
                <span key={t} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Roles Needed</h3>
            <div className="flex flex-wrap gap-1.5">
              {project.rolesNeeded?.map(r => (
                <span key={r} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">{r}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-6">
          Posted by <span className="text-gray-600 font-medium">{project.ownerUsername}</span>
        </div>

        {success && <p className="text-green-600 bg-green-50 p-3 rounded-lg text-sm mb-4">{success}</p>}
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg text-sm mb-4">{error}</p>}

        {isOwner ? (
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/dashboard`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              View Applications
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100"
            >
              Delete Project
            </button>
          </div>
        ) : (
          !showApply ? (
            <button
              onClick={() => setShowApply(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Apply to Join
            </button>
          ) : (
            <form onSubmit={handleApply} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-800">Your Application</h3>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Role you're applying for</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.roleAppliedFor}
                  onChange={(e) => setForm({ ...form, roleAppliedFor: e.target.value })}
                >
                  <option value="">Select a role</option>
                  {project.rolesNeeded?.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Message to the owner</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Tell them why you'd be a great fit..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Send Application
                </button>
                <button type="button" onClick={() => setShowApply(false)} className="text-gray-500 px-4 py-2 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  )
}