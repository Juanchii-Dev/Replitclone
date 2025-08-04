"use client"
import { useState, useRef, useEffect } from "react"
import { Home, Package, Server, Users, BookOpen, FileCode, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

import { HomePage } from "@/components/pages/home-page"
import { FilesPage } from "@/components/pages/files-page"
import { ServerPage } from "@/components/pages/server-page"
import { DocsPage } from "@/components/pages/docs-page"
import { PackagesPage } from "@/components/pages/packages-page"
import { CommunityPage } from "@/components/pages/community-page"
import { AIAgentInterface } from "@/components/ai-agent-interface"
import { InteractiveProjectChat } from "@/components/interactive-project-chat"

// Define types
type Message = {
  id: number
  sender: "user" | "agent"
  content: string
  timestamp: string
}

type Project = {
  id: number
  name: string
  files: { name: string; path: string; content: string }[]
  checkpoints: { id: number; name: string; completed: boolean }[]
}

type Workflow = {
  id: number
  name: string
  progress: number
  steps: number
  completedSteps: number
}

type FileType = {
  name: string
  path: string
  content: string
  language: string
  lastModified: Date
}

// Sample data
const sampleProjects: Project[] = [
  {
    id: 1,
    name: "Instagram Clone",
    files: [
      { name: "index.js", path: "/src/index.js", content: "// Archivo principal" },
      { name: "App.js", path: "/src/App.js", content: "// Componente App" },
      { name: "styles.css", path: "/src/styles.css", content: "/* Estilos */" },
    ],
    checkpoints: [
      { id: 1, name: "Configuración inicial", completed: true },
      { id: 2, name: "Componentes básicos", completed: true },
      { id: 3, name: "Integración de API", completed: false },
    ],
  },
]

export default function ReplitInterface() {
  const [description, setDescription] = useState("")
  const [isBuilding, setIsBuilding] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showInteractiveChat, setShowInteractiveChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [projectName, setProjectName] = useState("HollaConnect")
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("chat")
  const [currentProject, setCurrentProject] = useState<Project>(sampleProjects[0])
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [workflows, setWorkflows] = useState<Workflow[]>([
    { id: 1, name: "Sistema de login con JWT", progress: 60, steps: 5, completedSteps: 3 },
    { id: 2, name: "Conexión a API REST", progress: 30, steps: 4, completedSteps: 1 },
  ])
  const [showFileExplorer, setShowFileExplorer] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nueva actualización", message: "Se ha actualizado el agente a la versión 2.0", read: false },
    {
      id: 2,
      title: "Checkpoint completado",
      message: "Se ha completado el checkpoint 'Componentes básicos'",
      read: true,
    },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState("")
  const { toast } = useToast()
  const isMobile = useMobile()
  const [activePage, setActivePage] = useState<string>("home")
  const [pendingProjectDescription, setPendingProjectDescription] = useState<string>("")

  // Initialize chat on component mount
  useEffect(() => {
    setShowChat(true)
    setMessages([
      {
        id: 1,
        sender: "agent",
        content:
          "¡Hola! Soy tu agente de IA programador senior. Puedo ayudarte a crear aplicaciones completas desde cero. ¿Qué te gustaría construir hoy?",
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  const handleStartBuilding = (projectDescription: string) => {
    if (projectDescription.trim() === "") return

    setIsBuilding(true)
    setPendingProjectDescription(projectDescription)

    const projectNameFromDescription = projectDescription.split(" ").slice(0, 3).join(" ")
    setProjectName(projectNameFromDescription || "New Project")

    // Redirect to interactive chat instead of creating project immediately
    setTimeout(() => {
      setIsBuilding(false)
      setShowInteractiveChat(true)
      setActivePage("interactive-chat")

      toast({
        title: "🚀 Iniciando Chat Interactivo",
        description: "El agente creará un plan detallado para tu proyecto",
      })
    }, 1500)
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return

    const userMessage = {
      id: Date.now(),
      sender: "user" as const,
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "agent" as const,
          content:
            "Para obtener la mejor experiencia, te recomiendo usar la interfaz del Agente IA donde puedo mostrarte cada paso del desarrollo en detalle. Puedes acceder haciendo clic en el ícono del cerebro en la barra lateral.",
          timestamp: new Date().toISOString(),
        },
      ])
    }, 1500)
  }

  const handleRun = () => {
    setIsRunning(true)
    setConsoleOutput("Ejecutando...")

    setTimeout(() => {
      setIsRunning(false)
      setConsoleOutput("Aplicación ejecutada correctamente.")
      toast({
        title: "Ejecución completada",
        description: "La aplicación se ha ejecutado correctamente.",
      })
    }, 2000)
  }

  const handleFileExplorerToggle = () => {
    setShowFileExplorer(!showFileExplorer)
    toast({
      title: showFileExplorer ? "Explorador cerrado" : "Explorador abierto",
      description: showFileExplorer
        ? "Se ha cerrado el explorador de archivos"
        : "Se ha abierto el explorador de archivos",
    })
  }

  const handleNotificationRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleProjectApproved = (approvedProject: any) => {
    // When project is approved, switch to AI Agent interface
    setCurrentProject(approvedProject)
    setActivePage("ai-agent")
    setShowInteractiveChat(false)

    toast({
      title: "✅ Proyecto Aprobado",
      description: "Iniciando construcción del proyecto completo",
    })
  }

  const handleBackToHome = () => {
    setShowInteractiveChat(false)
    setActivePage("home")
    setPendingProjectDescription("")
  }

  if (!showChat && !showInteractiveChat) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0e1525] text-white">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a HollaConnect</h1>
        <p className="text-gray-400 mb-8">Describe el proyecto que quieres construir:</p>
        <Textarea
          placeholder="Quiero construir..."
          className="w-full max-w-md bg-transparent border border-gray-700 text-white rounded-md p-3 mb-4 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant="outline"
          className="bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
          onClick={() => handleStartBuilding(description)}
          disabled={isBuilding}
        >
          {isBuilding ? "Iniciando Chat..." : "Comenzar a construir"}
        </Button>
      </div>
    )
  }

  const renderPageContent = () => {
    switch (activePage) {
      case "home":
        return <HomePage onCreateProject={handleStartBuilding} />
      case "files":
        return <FilesPage />
      case "server":
        return <ServerPage />
      case "docs":
        return <DocsPage />
      case "packages":
        return <PackagesPage />
      case "community":
        return <CommunityPage />
      case "ai-agent":
        return <AIAgentInterface initialDescription={pendingProjectDescription} />
      case "interactive-chat":
        return (
          <InteractiveProjectChat
            projectDescription={pendingProjectDescription}
            onProjectApproved={handleProjectApproved}
            onBackToHome={handleBackToHome}
          />
        )
      default:
        return <HomePage onCreateProject={handleStartBuilding} />
    }
  }

  return (
    <div className="flex h-screen bg-[#0e1525] text-white overflow-hidden">
      {/* Left Sidebar - Icons */}
      <div className="w-[42px] min-w-[42px] border-r border-[#1c2333] flex flex-col items-center py-4">
        <div className="flex flex-col items-center gap-6">
          <button
            className={`w-6 h-6 flex items-center justify-center ${activePage === "home" ? "text-[#6c63ff]" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActivePage("home")}
          >
            <Home size={20} />
          </button>
          <button
            className={`w-6 h-6 flex items-center justify-center ${activePage === "ai-agent" ? "text-[#6c63ff]" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActivePage("ai-agent")}
          >
            <Brain size={20} />
          </button>
          <button
            className={`w-6 h-6 flex items-center justify-center ${activePage === "files" ? "text-[#6c63ff]" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActivePage("files")}
          >
            <FileCode size={20} />
          </button>
          <button
            className={`w-6 h-6 flex items-center justify-center ${activePage === "server" ? "text-[#6c63ff]" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActivePage("server")}
          >
            <Server size={20} />
          </button>
          <button
            className={`w-6 h-6 flex items-center justify-center ${activePage === "docs" ? "text-[#6c63ff]" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActivePage("docs")}
          >
            <BookOpen size={20} />
          </button>
          <button
            className={`w-6 h-6 flex items-center justify-center ${activePage === "packages" ? "text-[#6c63ff]" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActivePage("packages")}
          >
            <Package size={20} />
          </button>
          <button
            className={`w-6 h-6 flex items-center justify-center ${activePage === "community" ? "text-[#6c63ff]" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActivePage("community")}
          >
            <Users size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {renderPageContent()}
    </div>
  )
}
