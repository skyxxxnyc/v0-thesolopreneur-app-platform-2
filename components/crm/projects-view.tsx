"use client"

import { useState } from "react"
import { Plus, Search, LayoutGrid, List, FolderKanban, Clock, CheckCircle, PauseCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProjectDetailModal } from "./project-detail-modal"
import { AddProjectModal } from "./add-project-modal"
import type { Project } from "@/lib/types/crm"

interface ProjectsViewProps {
  projects: Project[]
  companies: { id: string; name: string }[]
  tenantId: string | null
}

const statusColors: Record<string, string> = {
  planning: "bg-zinc-700 text-zinc-300",
  in_progress: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  on_hold: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  completed: "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30",
  cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
}

const priorityColors: Record<string, string> = {
  low: "text-zinc-500",
  medium: "text-yellow-400",
  high: "text-orange-400",
  urgent: "text-red-400",
}

export function ProjectsView({ projects, companies, tenantId }: ProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")

  const filteredProjects = projects.filter((project) => {
    return (
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project as any).company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const projectsByStatus = {
    planning: filteredProjects.filter((p) => p.status === "planning"),
    in_progress: filteredProjects.filter((p) => p.status === "in_progress"),
    on_hold: filteredProjects.filter((p) => p.status === "on_hold"),
    completed: filteredProjects.filter((p) => p.status === "completed"),
  }

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-zinc-500 mt-1">Track work and engagements with clients</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <FolderKanban className="w-5 h-5 text-white" />
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Total Projects</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span className="text-2xl font-bold text-cyan-400">{stats.active}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">In Progress</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-5 h-5 text-[#00ff88]" />
            <span className="text-2xl font-bold text-[#00ff88]">{stats.completed}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
          />
        </div>
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1">
          <Button
            size="sm"
            variant={viewMode === "kanban" ? "default" : "ghost"}
            onClick={() => setViewMode("kanban")}
            className={viewMode === "kanban" ? "bg-zinc-700" : "text-zinc-500 hover:text-white"}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "ghost"}
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-zinc-700" : "text-zinc-500 hover:text-white"}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-4 gap-4">
          {(["planning", "in_progress", "on_hold", "completed"] as const).map((status) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status === "planning" && <FolderKanban className="w-4 h-4 text-zinc-500" />}
                  {status === "in_progress" && <Clock className="w-4 h-4 text-cyan-400" />}
                  {status === "on_hold" && <PauseCircle className="w-4 h-4 text-yellow-400" />}
                  {status === "completed" && <CheckCircle className="w-4 h-4 text-[#00ff88]" />}
                  <span className="text-sm font-semibold text-white capitalize">{status.replace("_", " ")}</span>
                </div>
                <span className="text-xs text-zinc-600">{projectsByStatus[status].length}</span>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {projectsByStatus[status].length === 0 ? (
                  <div className="bg-zinc-900/50 border border-dashed border-zinc-800 p-4 text-center">
                    <p className="text-xs text-zinc-600">No projects</p>
                  </div>
                ) : (
                  projectsByStatus[status].map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-zinc-900 border border-zinc-800 p-3 hover:border-zinc-700 cursor-pointer transition-colors"
                    >
                      <p className="font-medium text-white text-sm mb-2 line-clamp-1">{project.name}</p>
                      {(project as any).company && (
                        <p className="text-xs text-zinc-500 mb-2">{(project as any).company.name}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {project.priority && (
                          <span className={`text-xs font-medium uppercase ${priorityColors[project.priority]}`}>
                            {project.priority}
                          </span>
                        )}
                        {project.due_date && (
                          <span className="text-xs text-zinc-600">
                            {new Date(project.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Project</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Company</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Priority</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    {projects.length === 0 ? (
                      <div className="space-y-2">
                        <FolderKanban className="w-8 h-8 mx-auto text-zinc-600" />
                        <p>No projects yet</p>
                        <Button
                          size="sm"
                          onClick={() => setIsAddModalOpen(true)}
                          className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                        >
                          Create your first project
                        </Button>
                      </div>
                    ) : (
                      "No projects match your search"
                    )}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedProject(project)}
                  >
                    <td className="p-4">
                      <p className="font-medium text-white">{project.name}</p>
                      {project.description && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{project.description}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-zinc-400">{(project as any).company?.name || "—"}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[project.status]}>{project.status.replace("_", " ")}</Badge>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-medium uppercase ${priorityColors[project.priority]}`}>
                        {project.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-zinc-500">
                        {project.due_date ? new Date(project.due_date).toLocaleDateString() : "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      {isAddModalOpen && tenantId && (
        <AddProjectModal tenantId={tenantId} companies={companies} onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  )
}
