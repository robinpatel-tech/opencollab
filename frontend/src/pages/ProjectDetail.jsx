import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, applyToProject, deleteProject, getMilestones, createMilestone, updateMilestone } from '../services/api'
import { useAuth } from '../context/useAuth'

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [milestones, setMilestones] = useState([])
  const [activeTab, setActiveTab] = useState('details') // 'details' or 'milestones'
  const [showApply, setShowApply] = useState(false)
  const [form, setForm] = useState({ message: '', roleAppliedFor: '' })
  const [newMilestone, setNewMilestone] = useState({ title: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getProject(id).then(res => setProject(res.data)).catch(console.error)
    getMilestones(id).then(res => setMilestones(res.data)).catch(console.error)
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await applyToProject(id, form)
      setSuccess('Application sent successfully!')
      setShowApply(false)
    } catch (err) {
      console.error('Apply error:', err)
      const msg = err.response?.data?.message || err.response?.data || 'Failed to apply'
      setError(typeof msg === 'string' ? msg : 'Failed to apply')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await deleteProject(id)
      navigate('/feed')
    } catch (err) {
      setError('Failed to delete project')
    }
  }

  const handleAddMilestone = async (e) => {
    e.preventDefault()
    if (!newMilestone.title.trim()) return
    try {
      const res = await createMilestone(id, newMilestone)
      setMilestones([...milestones, res.data])
      setNewMilestone({ title: '' })
    } catch (err) {
      console.error('Failed to add milestone')
    }
  }

  const toggleMilestone = async (milestone) => {
    if (!isOwner) return
    try {
      const res = await updateMilestone(milestone.id, { ...milestone, completed: !milestone.isCompleted })
      setMilestones(milestones.map(m => m.id === milestone.id ? res.data : m))
    } catch (err) {
      console.error('Failed to update milestone')
    }
  }

  if (!project) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse text-gray-400">Loading project details...</div>
    </div>
  )

  const isOwner = user && project && Number(user.userId) === Number(project.ownerId)
  const completedCount = milestones.filter(m => m.isCompleted).length
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

  const commitmentColor = {
    LOW: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Project Details
          </button>
          <button 
            onClick={() => setActiveTab('milestones')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'milestones' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Roadmap & Milestones
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'details' ? (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{project.title}</h1>
                <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${commitmentColor[project.commitmentLevel]}`}>
                  {project.commitmentLevel} commitment
                </span>
              </div>

              <p className="text-gray-600 mb-8 text-lg leading-relaxed">{project.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map(t => (
                      <span key={t} className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Roles Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.rolesNeeded?.map(r => (
                      <span key={r} className="bg-white text-purple-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-100 shadow-sm">{r}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400 mb-10 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-[10px]">
                  {project.ownerUsername.charAt(0)}
                </div>
                Posted by <span onClick={() => navigate(`/profile/${project.ownerId}`)} className="text-blue-600 font-bold hover:underline cursor-pointer">{project.ownerUsername}</span>
              </div>

              {/* Team Members Section */}
              <div className="border-t border-gray-100 pt-8 mb-10">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                   Official Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-blue-50/50 rounded-2xl p-4 flex items-center justify-between border border-blue-100/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {project.ownerUsername.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p onClick={() => navigate(`/profile/${project.ownerId}`)} className="text-sm font-semibold text-gray-900 cursor-pointer hover:underline">{project.ownerUsername}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Project Lead</p>
                        </div>
                      </div>
                   </div>

                   {project.collaborators?.map(member => (
                      <div key={member.id} className="bg-gray-50/50 rounded-2xl p-4 flex items-center justify-between border border-gray-100/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 font-bold text-sm shadow-sm border border-gray-200">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p onClick={() => navigate(`/profile/${member.id}`)} className="text-sm font-semibold text-gray-900 cursor-pointer hover:underline">{member.username}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Collaborator</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigate(`/chat/${member.id}`, { state: { name: member.username } })}
                          className="text-[11px] bg-white text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 font-bold hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          Message
                        </button>
                      </div>
                   ))}
                </div>
              </div>

              {success && <p className="text-green-600 bg-green-50 p-4 rounded-2xl text-sm font-bold mb-6 flex items-center gap-2 border border-green-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                {success}
              </p>}
              {error && <p className="text-red-500 bg-red-50 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100">{error}</p>}

              {isOwner ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/dashboard`)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                  >
                    Manage Applications
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all border border-red-100"
                  >
                    Delete Project
                  </button>
                </div>
              ) : (
                !showApply ? (
                  <button
                    onClick={() => setShowApply(true)}
                    className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98]"
                  >
                    Apply to Join "{project.title}"
                  </button>
                ) : (
                  <form onSubmit={handleApply} className="bg-gray-50 border border-gray-100 rounded-3xl p-6 space-y-5 animate-in slide-in-from-bottom-4 duration-500">
                    <h3 className="font-bold text-gray-900 text-lg">Your Application</h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Role you're applying for</label>
                      <select
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={form.roleAppliedFor}
                        onChange={(e) => setForm({ ...form, roleAppliedFor: e.target.value })}
                        required
                      >
                        <option value="">Select a role</option>
                        {Array.from(project.rolesNeeded || []).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message to the owner</label>
                      <textarea
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[120px]"
                        placeholder="Tell them why you'd be a great fit..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">
                        Send Application
                      </button>
                      <button type="button" onClick={() => setShowApply(false)} className="text-gray-500 px-6 py-3 text-sm font-bold">
                        Cancel
                      </button>
                    </div>
                  </form>
                )
              )}
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                   <div>
                     <h2 className="text-2xl font-bold text-gray-900">Project Roadmap</h2>
                     <p className="text-sm text-gray-400 mt-1">Track major goals and developmental progress.</p>
                   </div>
                   <div className="text-right">
                     <span className="text-3xl font-bold text-blue-600">{progressPercent}%</span>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Completion</p>
                   </div>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                     style={{ width: `${progressPercent}%` }}
                   ></div>
                </div>
              </div>

              {isOwner && (
                <form onSubmit={handleAddMilestone} className="flex gap-3 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <input 
                    className="flex-1 border-none bg-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="Describe a new milestone..."
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ title: e.target.value })}
                  />
                  <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
                    Add
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {milestones.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 italic bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                    No milestones defined roadmap yet.
                  </div>
                ) : milestones.map((m, idx) => (
                  <div key={m.id} className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${m.isCompleted ? 'bg-green-50/30 border-green-100 shadow-sm' : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md'}`}>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-xs text-gray-400 border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-sm ${m.isCompleted ? 'text-green-700 line-through' : 'text-gray-900'}`}>{m.title}</h4>
                      {m.dueDate && <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tight">Target: {new Date(m.dueDate).toLocaleDateString()}</p>}
                    </div>
                    {isOwner ? (
                      <button 
                        onClick={() => toggleMilestone(m)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${m.isCompleted ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-white border border-gray-200 text-gray-300 hover:border-blue-500 hover:text-blue-500'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </button>
                    ) : (
                      m.isCompleted && (
                        <div className="text-green-500 bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}