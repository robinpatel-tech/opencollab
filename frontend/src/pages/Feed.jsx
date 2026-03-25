import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAllProjects } from '../services/api'

const TECHS = ['React', 'Spring Boot', 'Node.js', 'Python', 'Flutter', 'MySQL']
const ROLES = ['Frontend Dev', 'Backend Dev', 'UI Designer', 'DevOps', 'Mobile Dev']
const COMMITMENTS = ['LOW', 'MEDIUM', 'HIGH']

export default function Feed() {
  const [projects, setProjects] = useState([])
  const [filters, setFilters] = useState({ tech: '', role: '', commitment: '' })
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.tech) params.tech = filters.tech
      if (filters.role) params.role = filters.role
      if (filters.commitment) params.commitment = filters.commitment
      const res = await getAllProjects(params)
      setProjects(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const commitmentColor = {
    LOW: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Find your next collaboration</p>
        </div>
        <Link
          to="/projects/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Post Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.tech}
          onChange={(e) => setFilters({ ...filters, tech: e.target.value })}
        >
          <option value="">All Tech Stacks</option>
          {TECHS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.commitment}
          onChange={(e) => setFilters({ ...filters, commitment: e.target.value })}
        >
          <option value="">Any Commitment</option>
          {COMMITMENTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(filters.tech || filters.role || filters.commitment) && (
          <button
            onClick={() => setFilters({ tech: '', role: '', commitment: '' })}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Project Cards */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No projects found. Be the first to post one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-semibold text-gray-900 text-base">{project.title}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${commitmentColor[project.commitmentLevel]}`}>
                  {project.commitmentLevel}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.techStack?.map(tech => (
                  <span key={tech} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>by {project.ownerUsername}</span>
                <span>{project.rolesNeeded?.join(', ')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}