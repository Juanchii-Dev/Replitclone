"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileCode,
  Server,
  BookOpen,
  Package,
  Users,
  Settings,
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  Folder,
  Star,
  Trash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

type NavItem = {
  name: string
  icon: React.ElementType
  href: string
}

type ProjectItem = {
  id: string
  name: string
  lastEdited: string
  language: string
}

export function SidebarNavigation() {
  const [expanded, setExpanded] = useState(true)
  const [showProjects, setShowProjects] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [recentProjects, setRecentProjects] = useState<ProjectItem[]>([
    {
      id: "1",
      name: "Instagram Clone",
      lastEdited: "1 hour ago",
      language: "JavaScript",
    },
    {
      id: "2",
      name: "Python API",
      lastEdited: "yesterday",
      language: "Python",
    },
    {
      id: "3",
      name: "Portfolio Website",
      lastEdited: "3 days ago",
      language: "HTML/CSS",
    },
  ])
  const { toast } = useToast()
  const pathname = usePathname()

  const mainNavItems: NavItem[] = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Code", icon: FileCode, href: "/code" },
    { name: "Server", icon: Server, href: "/server" },
    { name: "Docs", icon: BookOpen, href: "/docs" },
    { name: "Packages", icon: Package, href: "/packages" },
    { name: "Community", icon: Users, href: "/community" },
  ]

  const handleCreateProject = () => {
    toast({
      title: "Nuevo proyecto",
      description: "Creando nuevo proyecto...",
    })

    // Simulate creating a new project
    setTimeout(() => {
      const newProject = {
        id: `${recentProjects.length + 1}`,
        name: `Nuevo Proyecto ${recentProjects.length + 1}`,
        lastEdited: "just now",
        language: "JavaScript",
      }

      setRecentProjects([newProject, ...recentProjects])

      toast({
        title: "Proyecto creado",
        description: `Se ha creado "${newProject.name}" exitosamente`,
      })
    }, 1500)
  }

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    toast({
      title: "Eliminando proyecto",
      description: "Eliminando proyecto...",
    })

    // Simulate deleting a project
    setTimeout(() => {
      setRecentProjects(recentProjects.filter((project) => project.id !== id))

      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado exitosamente",
      })
    }, 1000)
  }

  const handleStarProject = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    toast({
      title: "Proyecto destacado",
      description: "El proyecto ha sido marcado como destacado",
    })
  }

  const filteredProjects = recentProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div
      className={`h-screen bg-[#0e1525] border-r border-[#1c2333] flex flex-col transition-all duration-300 ${expanded ? "w-64" : "w-16"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#1c2333]">
        {expanded && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#6c63ff] rounded-md flex items-center justify-center text-white font-bold">
              &gt;_
            </div>
            <span className="ml-2 font-bold text-white">Replit</span>
          </div>
        )}
        {!expanded && (
          <div className="w-8 h-8 bg-[#6c63ff] rounded-md flex items-center justify-center text-white font-bold mx-auto">
            &gt;_
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white p-1 h-auto"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-shrink-0 py-2">
        <TooltipProvider>
          {mainNavItems.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 my-1 rounded-md ${
                    pathname === item.href
                      ? "bg-[#1c2333] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1c2333]"
                  }`}
                >
                  <item.icon size={20} className={expanded ? "mr-3" : "mx-auto"} />
                  {expanded && <span>{item.name}</span>}
                </Link>
              </TooltipTrigger>
              {!expanded && <TooltipContent side="right">{item.name}</TooltipContent>}
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Divider */}
      <div className="border-t border-[#1c2333] my-2"></div>

      {/* Projects Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Projects Header */}
        <div className="flex items-center justify-between px-3 py-2">
          {expanded && <span className="text-sm font-medium text-white">Projects</span>}
          <div className="flex items-center ml-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white p-1 h-auto"
                    onClick={handleCreateProject}
                  >
                    <Plus size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={expanded ? "bottom" : "right"}>New Project</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {expanded && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-1 h-auto ml-1"
                onClick={() => setShowProjects(!showProjects)}
              >
                <ChevronRight
                  size={18}
                  className={`transform transition-transform ${showProjects ? "rotate-90" : ""}`}
                />
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        {expanded && showProjects && (
          <div className="px-3 py-2">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full bg-[#1c2333] border border-[#343a4a] rounded-md pl-8 pr-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6c63ff]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Projects List */}
        {showProjects && (
          <div className="flex-1 overflow-y-auto px-2">
            {expanded ? (
              filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/repl/${project.id}`}
                    className="flex items-center p-2 my-1 rounded-md hover:bg-[#1c2333] group"
                  >
                    <Folder size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{project.name}</div>
                      <div className="text-xs text-gray-500">{project.lastEdited}</div>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-yellow-400 p-1 h-auto"
                        onClick={(e) => handleStarProject(project.id, e)}
                      >
                        <Star size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 p-1 h-auto"
                        onClick={(e) => handleDeleteProject(project.id, e)}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {searchQuery ? "No projects found" : "No recent projects"}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center">
                {recentProjects.slice(0, 3).map((project) => (
                  <TooltipProvider key={project.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/repl/${project.id}`}
                          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#1c2333] my-1"
                        >
                          <Folder size={20} className="text-gray-400" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{project.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1c2333] p-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`flex items-center ${expanded ? "w-full justify-start" : "mx-auto"} text-gray-400 hover:text-white hover:bg-[#1c2333]`}
              >
                <Settings size={20} className={expanded ? "mr-3" : ""} />
                {expanded && <span>Settings</span>}
              </Button>
            </TooltipTrigger>
            {!expanded && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
