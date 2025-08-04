"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Settings,
  Brain,
  FileCode,
  Folder,
  File,
  Plus,
  Edit,
  Eye,
  Code,
  Lightbulb,
  Bug,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Key,
  ExternalLink,
  Terminal,
  Search,
  Wrench,
  BookOpen,
  Shield,
  Zap,
  BarChart3,
  GitBranch,
  Cpu,
  Database,
  Globe,
  Smartphone,
  Copy,
  MessageSquare,
} from "lucide-react"
import { useAIAgent } from "@/hooks/use-ai-agent"
import { useToast } from "@/hooks/use-toast"
import type { AgentMode } from "@/lib/ai-agent"

interface AIAgentInterfaceProps {
  initialDescription?: string
}

export function AIAgentInterface({ initialDescription }: AIAgentInterfaceProps) {
  const [apiKey, setApiKey] = useState("")
  const [showApiKeyInput, setShowApiKeyInput] = useState(true)
  const [projectDescription, setProjectDescription] = useState(initialDescription || "")
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [codeToExplain, setCodeToExplain] = useState("")
  const [codeToGenerate, setCodeToGenerate] = useState("")
  const [codeToDebug, setCodeToDebug] = useState("")
  const [debugError, setDebugError] = useState("")
  const [toolResult, setToolResult] = useState("")
  const [isToolWorking, setIsToolWorking] = useState(false)
  const [projectType, setProjectType] = useState("web-app")
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(["React", "Node.js", "TypeScript"])
  const [showCursorResponses, setShowCursorResponses] = useState(true)
  const logEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [cursorStyleResponses, setCursorStyleResponses] = useState<string[]>([])
  const [executionLog, setExecutionLog] = useState<string[]>([])

  const {
    isInitialized,
    currentPlan,
    files,
    currentStep,
    isExecuting,
    progress,
    error,
    agentMode,
    commandHistory,
    codebaseAnalysis,
    initializeAgent,
    createProject,
    executeStep,
    executeAllSteps,
    changeAgentMode,
    analyzeCodebase,
    detectAndFixErrors,
    refactorCode,
    generateDocumentation,
    setupProject,
    streamStepExecution,
    generateCode,
    explainCode,
    debugCode,
    generateIntelligentCompletion,
  } = useAIAgent()

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [executionLog, cursorStyleResponses])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error del Agente",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleInitializeAgent = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key requerida",
        description: "Por favor ingresa tu API Key de OpenAI para usar el agente",
        variant: "destructive",
      })
      return
    }

    if (!apiKey.startsWith("sk-")) {
      toast({
        title: "API Key inválida",
        description: "La API Key debe comenzar con 'sk-'",
        variant: "destructive",
      })
      return
    }

    try {
      initializeAgent(apiKey)
      setShowApiKeyInput(false)
      toast({
        title: "🎉 Agente Cursor-Style Inicializado",
        description: "Agente con respuestas profesionales y capacidades completas activado",
      })

      if (initialDescription && projectDescription) {
        setTimeout(() => {
          handleCreateProject()
        }, 500)
      }
    } catch (err) {
      console.error("Initialization error:", err)
      toast({
        title: "Error de inicialización",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const handleCreateProject = async () => {
    if (!projectDescription.trim()) {
      toast({
        title: "Descripción requerida",
        description: "Por favor describe el proyecto que quieres crear",
        variant: "destructive",
      })
      return
    }

    if (!isInitialized) {
      toast({
        title: "Agente no inicializado",
        description: "Por favor inicializa el agente con tu API Key primero",
        variant: "destructive",
      })
      return
    }

    setIsCreatingProject(true)
    try {
      await createProject(projectDescription)
      toast({
        title: "🎯 Proyecto Planificado con Estilo Cursor",
        description: "Plan completo creado con análisis arquitectural detallado",
      })
    } catch (err) {
      console.error("Error creating project:", err)
      toast({
        title: "Error creando proyecto",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setIsCreatingProject(false)
    }
  }

  const handleSetupProject = async () => {
    try {
      await setupProject(projectType, selectedTechnologies)
      toast({
        title: "🏗️ Setup Completado",
        description: "Estructura del proyecto configurada con explicaciones detalladas",
      })
    } catch (err) {
      toast({
        title: "Error en setup",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const handleAnalyzeCodebase = async () => {
    try {
      await analyzeCodebase()
      toast({
        title: "🔍 Análisis Cursor-Style Completado",
        description: "Codebase analizado con explicaciones técnicas detalladas",
      })
    } catch (err) {
      toast({
        title: "Error en análisis",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const handleDetectErrors = async () => {
    if (!selectedFile) {
      toast({
        title: "Selecciona un archivo",
        description: "Selecciona un archivo para analizar errores",
        variant: "destructive",
      })
      return
    }

    try {
      await detectAndFixErrors(selectedFile)
      toast({
        title: "🔧 Errores Corregidos con Estilo Cursor",
        description: "Análisis y corrección con explicaciones paso a paso",
      })
    } catch (err) {
      toast({
        title: "Error en análisis",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const handleRefactor = async (type: "performance" | "security" | "maintainability" | "architecture") => {
    try {
      await refactorCode(type)
      toast({
        title: "⚡ Refactoring Cursor-Style Completado",
        description: `Código refactorizado para ${type} con justificaciones técnicas`,
      })
    } catch (err) {
      toast({
        title: "Error en refactoring",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const handleGenerateDocumentation = async () => {
    try {
      await generateDocumentation()
      toast({
        title: "📚 Documentación Cursor-Style Generada",
        description: "Documentación completa con explicaciones profesionales",
      })
    } catch (err) {
      toast({
        title: "Error generando documentación",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const handleExecuteStep = async (step: any) => {
    try {
      await executeStep(step)
      toast({
        title: "✅ Paso Completado",
        description: `${step.title} ejecutado con explicaciones detalladas`,
      })
    } catch (err) {
      toast({
        title: "Error ejecutando paso",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const handleStreamExecution = async (step: any) => {
    setStreamingText("")
    try {
      for await (const chunk of streamStepExecution(step)) {
        setStreamingText((prev) => prev + chunk)
      }
    } catch (err) {
      toast({
        title: "Error en streaming",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    }
  }

  const handleGenerateCode = async () => {
    if (!codeToGenerate.trim()) return

    setIsToolWorking(true)
    setToolResult("🔍 Analizando solicitud y generando código con estilo Cursor...")
    try {
      const result = await generateCode(codeToGenerate)
      setToolResult(result)
      toast({
        title: "💻 Código Generado",
        description: "Código generado con explicaciones técnicas detalladas",
      })
    } catch (err) {
      setToolResult(`Error generando código: ${err instanceof Error ? err.message : "Error desconocido"}`)
      toast({
        title: "Error",
        description: "Error generando código",
        variant: "destructive",
      })
    } finally {
      setIsToolWorking(false)
    }
  }

  const handleExplainCode = async () => {
    if (!codeToExplain.trim()) return

    setIsToolWorking(true)
    setToolResult("🔍 Analizando código con estilo profesional Cursor...")
    try {
      const result = await explainCode(codeToExplain)
      setToolResult(result)
      toast({
        title: "💡 Código Explicado",
        description: "Explicación técnica detallada generada",
      })
    } catch (err) {
      setToolResult(`Error explicando código: ${err instanceof Error ? err.message : "Error desconocido"}`)
      toast({
        title: "Error",
        description: "Error explicando código",
        variant: "destructive",
      })
    } finally {
      setIsToolWorking(false)
    }
  }

  const handleDebugCode = async () => {
    if (!codeToDebug.trim() || !debugError.trim()) return

    setIsToolWorking(true)
    setToolResult("🔍 Analizando error con metodología Cursor...")
    try {
      const result = await debugCode(codeToDebug, debugError)
      setToolResult(result)
      toast({
        title: "🐛 Debug Completado",
        description: "Error analizado y corregido con explicaciones paso a paso",
      })
    } catch (err) {
      setToolResult(`Error en debug: ${err instanceof Error ? err.message : "Error desconocido"}`)
      toast({
        title: "Error",
        description: "Error en debugging",
        variant: "destructive",
      })
    } finally {
      setIsToolWorking(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "📋 Copiado",
        description: "Respuesta copiada al portapapeles",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      })
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getFileIcon = (file: any) => {
    if (file.type === "folder") {
      return <Folder className="w-4 h-4 text-blue-400" />
    }

    switch (file.extension) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <FileCode className="w-4 h-4 text-yellow-400" />
      case "html":
        return <FileCode className="w-4 h-4 text-orange-400" />
      case "css":
        return <FileCode className="w-4 h-4 text-purple-400" />
      case "json":
        return <File className="w-4 h-4 text-green-400" />
      default:
        return <File className="w-4 h-4 text-gray-400" />
    }
  }

  const getModeIcon = (mode: AgentMode) => {
    switch (mode) {
      case "autonomous":
        return <Brain className="w-4 h-4" />
      case "collaborative":
        return <GitBranch className="w-4 h-4" />
      case "exploration":
        return <Search className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  const projectTypes = [
    { value: "web-app", label: "Aplicación Web", icon: Globe },
    { value: "mobile-app", label: "App Móvil", icon: Smartphone },
    { value: "api", label: "API Backend", icon: Database },
    { value: "desktop-app", label: "App Desktop", icon: Cpu },
  ]

  const technologies = [
    "React",
    "Vue.js",
    "Angular",
    "Svelte",
    "Node.js",
    "Express",
    "Fastify",
    "NestJS",
    "Python",
    "Django",
    "Flask",
    "FastAPI",
    "TypeScript",
    "JavaScript",
    "PHP",
    "Laravel",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Vercel",
  ]

  if (showApiKeyInput || !isInitialized) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Brain className="w-16 h-16 text-[#6c63ff] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Agente IA Cursor-Style</h2>
            <p className="text-gray-400">
              Desarrollador full-stack con respuestas profesionales y explicaciones detalladas
            </p>
          </div>

          <Alert className="bg-[#1c2333] border-[#2b3245]">
            <MessageSquare className="h-4 w-4" />
            <AlertDescription className="text-gray-300">
              <strong>Estilo Cursor AI:</strong> Respuestas profesionales con análisis step-by-step, justificaciones
              técnicas, y explicaciones educativas.
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6c63ff] hover:underline ml-1 inline-flex items-center"
              >
                Obtener API Key <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </AlertDescription>
          </Alert>

          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2 text-[#6c63ff]" />
                Agente Cursor-Style
              </CardTitle>
              <CardDescription className="text-gray-400">
                Conecta tu API Key para activar respuestas profesionales con explicaciones técnicas detalladas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="sk-..."
                className="bg-[#0e1525] border-[#2b3245] text-white"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleInitializeAgent()
                  }
                }}
              />
              <Button
                onClick={handleInitializeAgent}
                className="w-full bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                disabled={!apiKey.trim()}
              >
                <Key className="w-4 h-4 mr-2" />
                Inicializar Agente Cursor-Style
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            <p>
              <strong>Características del estilo Cursor:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• 🔍 Análisis inicial contextual detallado</li>
              <li>• 📝 Explicación step-by-step de decisiones</li>
              <li>• 🎯 Justificación de tecnologías elegidas</li>
              <li>• ⚡ Anticipación de problemas y soluciones</li>
              <li>• 🔗 Conexiones claras entre componentes</li>
              <li>• 📚 Instrucciones específicas de uso</li>
            </ul>
          </div>

          {error && (
            <Alert className="bg-red-900/20 border-red-600">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Enhanced Header with Cursor-Style indicator */}
      <div className="h-[46px] border-b border-[#1c2333] flex items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Brain className="w-5 h-5 text-[#6c63ff] mr-2" />
            <span className="text-sm font-medium">Agente IA Cursor-Style</span>
            <Badge className="ml-2 bg-purple-600 text-white text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Profesional
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={agentMode} onValueChange={(value: AgentMode) => changeAgentMode(value)}>
              <SelectTrigger className="w-32 h-7 bg-[#1c2333] border-[#2b3245] text-white">
                <div className="flex items-center">
                  {getModeIcon(agentMode)}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1c2333] border-[#2b3245] text-white">
                <SelectItem value="autonomous">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    Autónomo
                  </div>
                </SelectItem>
                <SelectItem value="collaborative">
                  <div className="flex items-center">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Colaborativo
                  </div>
                </SelectItem>
                <SelectItem value="exploration">
                  <div className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Exploración
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {currentPlan && (
            <Badge className="bg-green-600 text-white">
              {currentPlan.steps.filter((s) => s.status === "completed").length}/{currentPlan.steps.length} completados
            </Badge>
          )}
          {isExecuting && (
            <Badge className="bg-blue-600 text-white">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Ejecutando
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className={`h-8 px-3 ${showCursorResponses ? "bg-[#6c63ff] text-white" : "bg-transparent border-[#1c2333] text-white"}`}
            onClick={() => setShowCursorResponses(!showCursorResponses)}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Cursor Style
          </Button>

          {currentPlan && (
            <Button
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white border-none h-8 px-4"
              onClick={executeAllSteps}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Ejecutar Todo
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            className="bg-transparent border-[#1c2333] text-white h-8 px-2"
            onClick={() => setShowApiKeyInput(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="project" className="flex-1 flex flex-col">
            <div className="border-b border-[#1c2333] px-4">
              <TabsList className="bg-transparent">
                <TabsTrigger value="project">Proyecto</TabsTrigger>
                <TabsTrigger value="cursor-responses">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Respuestas Cursor
                </TabsTrigger>
                <TabsTrigger value="analysis">Análisis</TabsTrigger>
                <TabsTrigger value="files">Archivos</TabsTrigger>
                <TabsTrigger value="terminal">Terminal</TabsTrigger>
                <TabsTrigger value="tools">Herramientas</TabsTrigger>
                <TabsTrigger value="execution">Ejecución</TabsTrigger>
              </TabsList>
            </div>

            {/* New Cursor Responses Tab */}
            <TabsContent value="cursor-responses" className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Respuestas Estilo Cursor</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-600 text-white">{cursorStyleResponses.length} respuestas</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-[#343a4a] text-gray-300 hover:bg-[#343a4a]"
                      onClick={() => setCursorStyleResponses([])}
                    >
                      Limpiar
                    </Button>
                  </div>
                </div>

                <Card className="flex-1 bg-[#1c2333] border-[#2b3245]">
                  <CardContent className="p-0 h-full">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        {cursorStyleResponses.length > 0 ? (
                          cursorStyleResponses.map((response, index) => (
                            <Card key={index} className="bg-[#0e1525] border-[#2b3245]">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <Badge className="bg-purple-600 text-white text-xs">Respuesta #{index + 1}</Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-auto text-gray-400 hover:text-white"
                                    onClick={() => copyToClipboard(response)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="prose prose-invert max-w-none">
                                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                                    {response}
                                  </pre>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-white mb-2">No hay respuestas Cursor aún</h4>
                            <p className="text-gray-400 mb-4">
                              Las respuestas profesionales del agente aparecerán aquí cuando comiences a trabajar
                            </p>
                            <div className="text-sm text-gray-500 space-y-2">
                              <p>
                                <strong>Características del estilo Cursor:</strong>
                              </p>
                              <ul className="text-left inline-block space-y-1">
                                <li>• 🔍 Análisis inicial contextual</li>
                                <li>• 📝 Explicación step-by-step</li>
                                <li>• 🎯 Justificación de decisiones técnicas</li>
                                <li>• ⚡ Anticipación de problemas</li>
                                <li>• 🔗 Conexiones entre componentes</li>
                                <li>• 📚 Instrucciones de uso claras</li>
                              </ul>
                            </div>
                          </div>
                        )}
                        <div ref={logEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="project" className="flex-1 p-4 overflow-y-auto">
              {!currentPlan ? (
                <div className="space-y-6">
                  {/* Project Setup */}
                  <Card className="bg-[#1c2333] border-[#2b3245]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Wrench className="w-5 h-5 mr-2 text-[#6c63ff]" />
                        Setup Rápido de Proyecto
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Configura la estructura inicial del proyecto con tecnologías específicas y explicaciones
                        detalladas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Tipo de Proyecto</label>
                          <Select value={projectType} onValueChange={setProjectType}>
                            <SelectTrigger className="bg-[#0e1525] border-[#2b3245] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1c2333] border-[#2b3245] text-white">
                              {projectTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center">
                                    <type.icon className="w-4 h-4 mr-2" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Tecnologías</label>
                          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                            {technologies.map((tech) => (
                              <Badge
                                key={tech}
                                variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
                                className={`cursor-pointer ${
                                  selectedTechnologies.includes(tech)
                                    ? "bg-[#6c63ff] text-white"
                                    : "bg-transparent border-[#343a4a] text-gray-300 hover:bg-[#343a4a]"
                                }`}
                                onClick={() => {
                                  setSelectedTechnologies((prev) =>
                                    prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
                                  )
                                }}
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleSetupProject}
                        className="bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                        disabled={isExecuting}
                      >
                        <Wrench className="w-4 h-4 mr-2" />
                        Configurar con Estilo Cursor
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Custom Project */}
                  <Card className="bg-[#1c2333] border-[#2b3245]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Plus className="w-5 h-5 mr-2 text-[#6c63ff]" />
                        Crear Proyecto Personalizado
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Describe tu proyecto y el agente creará un plan completo con análisis arquitectural y
                        explicaciones paso a paso
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Ej: Una plataforma de e-learning con React, Node.js, PostgreSQL que incluya autenticación JWT, sistema de pagos con Stripe, videoconferencias con WebRTC, chat en tiempo real con Socket.io, dashboard de analytics con Chart.js, sistema de notificaciones push, y deployment automatizado en AWS con CI/CD usando GitHub Actions..."
                        className="bg-[#0e1525] border-[#2b3245] text-white min-h-[120px]"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                      />
                      <div className="text-xs text-gray-500">
                        <p>
                          <strong>Tip:</strong> Sé específico sobre tecnologías, funcionalidades, y arquitectura para
                          obtener respuestas más detalladas estilo Cursor.
                        </p>
                      </div>
                      <Button
                        onClick={handleCreateProject}
                        className="bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                        disabled={!projectDescription.trim() || isCreatingProject}
                      >
                        {isCreatingProject ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analizando y Planificando con IA...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Crear Plan Cursor-Style
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Project Overview */}
                  <Card className="bg-[#1c2333] border-[#2b3245]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-[#6c63ff]" />
                        {currentPlan.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">{currentPlan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{currentPlan.estimatedTime}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          <span className="text-sm">{currentPlan.architecture}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Wrench className="w-4 h-4 mr-1" />
                          <span className="text-sm">{currentPlan.technologies.length} tecnologías</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentPlan.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="bg-[#343a4a] text-white">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      {currentPlan.reasoning && (
                        <div className="mb-4 p-3 bg-[#0e1525] rounded border">
                          <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Justificación Técnica (Estilo Cursor)
                          </h4>
                          <p className="text-sm text-gray-300">{currentPlan.reasoning}</p>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <span>Progreso del proyecto</span>
                          <span>
                            {currentPlan.steps.filter((s) => s.status === "completed").length}/
                            {currentPlan.steps.length} ({Math.round(progress)}%)
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Development Steps */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      Pasos de Desarrollo (Cursor-Style)
                    </h3>
                    {currentPlan.steps.map((step, index) => (
                      <Card key={step.id} className="bg-[#1c2333] border-[#2b3245]">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#343a4a] text-white text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getStepIcon(step.status)}
                                  <h4 className="font-medium text-white">{step.title}</h4>
                                  <Badge
                                    className={`text-xs ${
                                      step.status === "completed"
                                        ? "bg-green-600"
                                        : step.status === "in-progress"
                                          ? "bg-blue-600"
                                          : step.status === "error"
                                            ? "bg-red-600"
                                            : "bg-gray-600"
                                    } text-white`}
                                  >
                                    {step.status === "completed"
                                      ? "Completado"
                                      : step.status === "in-progress"
                                        ? "En progreso"
                                        : step.status === "error"
                                          ? "Error"
                                          : "Pendiente"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">{step.description}</p>

                                {step.reasoning && (
                                  <div className="mb-3 p-2 bg-[#0e1525] rounded border-l-2 border-purple-500">
                                    <p className="text-xs text-purple-300">
                                      <strong>¿Por qué este paso?</strong> {step.reasoning}
                                    </p>
                                  </div>
                                )}

                                {step.connections && step.connections.length > 0 && (
                                  <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-1">Conexiones:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {step.connections.map((connection, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs bg-transparent border-[#343a4a] text-gray-400"
                                        >
                                          {connection}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>{step.actions.length} acciones</span>
                                  {step.commands && <span>{step.commands.length} comandos</span>}
                                  {step.testResults && (
                                    <span>
                                      Tests: {step.testResults.passed}✅ {step.testResults.failed}❌
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent border-[#343a4a] text-gray-300 hover:bg-[#343a4a] h-8"
                                onClick={() => handleStreamExecution(step)}
                                disabled={isExecuting}
                                title="Ver explicación paso a paso"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-[#6c63ff] hover:bg-[#5a52d3] text-white border-none h-8"
                                onClick={() => handleExecuteStep(step)}
                                disabled={isExecuting || step.status === "completed"}
                                title="Ejecutar paso con explicaciones Cursor"
                              >
                                {step.status === "completed" ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Análisis del Codebase (Cursor-Style)
                  </h3>
                  <Button
                    onClick={handleAnalyzeCodebase}
                    className="bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                    disabled={files.length === 0 || isExecuting}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Analizar con Explicaciones
                  </Button>
                </div>

                {codebaseAnalysis ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-[#1c2333] border-[#2b3245]">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-[#6c63ff]" />
                          Arquitectura
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">{codebaseAnalysis.architecture}</p>
                        {codebaseAnalysis.reasoning && (
                          <div className="mb-4 p-3 bg-[#0e1525] rounded border">
                            <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Análisis Cursor
                            </h4>
                            <p className="text-sm text-gray-300">{codebaseAnalysis.reasoning}</p>
                          </div>
                        )}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                            <span>Complejidad</span>
                            <span>{codebaseAnalysis.complexity}/10</span>
                          </div>
                          <Progress value={codebaseAnalysis.complexity * 10} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            {codebaseAnalysis.complexity <= 3
                              ? "🟢 Proyecto simple, fácil de mantener"
                              : codebaseAnalysis.complexity <= 6
                                ? "🟡 Complejidad moderada, bien estructurado"
                                : codebaseAnalysis.complexity <= 8
                                  ? "🟠 Proyecto complejo, requiere experiencia"
                                  : "🔴 Muy complejo, necesita refactoring"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#1c2333] border-[#2b3245]">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Wrench className="w-5 h-5 mr-2 text-[#6c63ff]" />
                          Tecnologías Detectadas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {codebaseAnalysis.frameworks.map((framework) => (
                            <Badge key={framework} variant="secondary" className="bg-[#343a4a] text-white">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">
                          <p className="mb-2">
                            <strong>¿Cómo las identifiqué?</strong>
                          </p>
                          <p>
                            Análisis de imports, configuraciones, patrones de código, y estructura de archivos siguiendo
                            metodología Cursor.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#1c2333] border-[#2b3245]">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                          Issues Encontrados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {codebaseAnalysis.issues.length > 0 ? (
                          <ul className="space-y-2">
                            {codebaseAnalysis.issues.map((issue, index) => (
                              <li key={index} className="text-sm text-gray-300 flex items-start">
                                <AlertCircle className="w-4 h-4 mr-2 text-red-400 mt-0.5 flex-shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-4">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-gray-400">No se encontraron issues críticos</p>
                            <p className="text-xs text-gray-500 mt-1">El código sigue buenas prácticas</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-[#1c2333] border-[#2b3245]">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                          Sugerencias Cursor-Style
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {codebaseAnalysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-gray-300">
                              <div className="flex items-start">
                                <Lightbulb className="w-4 h-4 mr-2 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p>{suggestion}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    <strong>¿Por qué esta mejora?</strong> Basada en análisis de patrones y mejores
                                    prácticas de la industria.
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-[#1c2333] border-[#2b3245]">
                    <CardContent className="p-8 text-center">
                      <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-white mb-2">No hay análisis disponible</h4>
                      <p className="text-gray-400 mb-4">
                        Ejecuta el análisis del codebase para ver información detallada con explicaciones estilo Cursor
                      </p>
                      <div className="text-sm text-gray-500 space-y-2">
                        <p>
                          <strong>El análisis Cursor incluirá:</strong>
                        </p>
                        <ul className="text-left inline-block space-y-1">
                          <li>• 🔍 Identificación de arquitectura con justificaciones</li>
                          <li>• 🛠️ Detección de tecnologías y frameworks</li>
                          <li>• ⚠️ Issues potenciales con explicaciones</li>
                          <li>• 💡 Sugerencias específicas de mejora</li>
                          <li>• 📊 Métricas de complejidad y calidad</li>
                          <li>• 🔗 Análisis de relaciones entre archivos</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Advanced Analysis Tools */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={handleDetectErrors}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={!selectedFile || isExecuting}
                  >
                    <Bug className="w-4 h-4 mr-2" />
                    Detectar Errores
                  </Button>

                  <Button
                    onClick={() => handleRefactor("performance")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={files.length === 0 || isExecuting}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Optimizar Performance
                  </Button>

                  <Button
                    onClick={() => handleRefactor("security")}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={files.length === 0 || isExecuting}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Mejorar Seguridad
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Estructura de Archivos</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-[#343a4a] text-white">
                      {files.length} archivos
                    </Badge>
                    <Button
                      onClick={handleGenerateDocumentation}
                      className="bg-[#6c63ff] hover:bg-[#5a52d3] text-white h-8 px-3"
                      disabled={files.length === 0 || isExecuting}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Generar Docs Cursor
                    </Button>
                  </div>
                </div>

                {files.length === 0 ? (
                  <Card className="bg-[#1c2333] border-[#2b3245]">
                    <CardContent className="p-8 text-center">
                      <Folder className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-white mb-2">No hay archivos aún</h4>
                      <p className="text-gray-400 mb-4">
                        Los archivos aparecerán aquí cuando el agente comience a trabajar
                      </p>
                      <div className="text-sm text-gray-500 space-y-2">
                        <p>
                          <strong>Cuando genere archivos, verás:</strong>
                        </p>
                        <ul className="text-left inline-block space-y-1">
                          <li>• 📁 Estructura completa del proyecto</li>
                          <li>• 💻 Código con comentarios explicativos</li>
                          <li>• 🔍 Análisis de cada archivo generado</li>
                          <li>• 🔗 Relaciones entre componentes</li>
                          <li>• 📝 Justificaciones técnicas Cursor-style</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <Card
                        key={file.id}
                        className={`bg-[#1c2333] border-[#2b3245] cursor-pointer hover:border-[#6c63ff] transition-colors ${
                          selectedFile === file.id ? "border-[#6c63ff] ring-1 ring-[#6c63ff]" : ""
                        }`}
                        onClick={() => setSelectedFile(selectedFile === file.id ? null : file.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file)}
                              <div>
                                <p className="text-sm font-medium text-white">{file.name}</p>
                                <p className="text-xs text-gray-400">{file.path}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">{file.lastModified.toLocaleTimeString()}</span>
                              {file.analysis && (
                                <Badge className="bg-green-600 text-white text-xs">
                                  <Search className="w-3 h-3 mr-1" />
                                  Analizado
                                </Badge>
                              )}
                              <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-400 hover:text-white">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {selectedFile === file.id && file.content && (
                            <div className="mt-3 space-y-3">
                              <div className="p-3 bg-[#0e1525] rounded border">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium text-white">Contenido del Archivo</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-auto text-gray-400 hover:text-white"
                                    onClick={() => copyToClipboard(file.content || "")}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <pre className="text-xs text-gray-300 overflow-x-auto max-h-60">
                                  <code>{file.content}</code>
                                </pre>
                              </div>

                              {file.analysis && (
                                <div className="p-3 bg-[#0e1525] rounded border border-green-600/20">
                                  <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                                    <MessageSquare className="w-4 h-4 mr-1 text-green-400" />
                                    Análisis Cursor-Style
                                  </h4>
                                  <div className="text-xs text-gray-300 space-y-2">
                                    <p>
                                      <strong>Propósito:</strong> {file.analysis.reasoning || "Análisis en progreso"}
                                    </p>
                                    <p>
                                      <strong>Complejidad:</strong> {file.analysis.complexity}/10
                                    </p>
                                    {file.analysis.patterns.length > 0 && (
                                      <p>
                                        <strong>Patrones:</strong> {file.analysis.patterns.join(", ")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="terminal" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    Terminal y Comandos (Cursor-Style)
                  </h3>
                  <Badge variant="secondary" className="bg-[#343a4a] text-white">
                    {commandHistory.length} comandos ejecutados
                  </Badge>
                </div>

                <Card className="bg-[#1c2333] border-[#2b3245]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Terminal className="w-5 h-5 mr-2 text-[#6c63ff]" />
                      Historial de Comandos con Explicaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {commandHistory.length > 0 ? (
                      <div className="space-y-4 max-h-60 overflow-y-auto">
                        {commandHistory.map((cmd, index) => (
                          <div key={index} className="bg-[#0e1525] p-4 rounded border">
                            <div className="flex items-center justify-between mb-3">
                              <code className="text-sm text-blue-400 font-mono">{cmd.command}</code>
                              <div className="flex items-center space-x-2">
                                <Badge className={cmd.success ? "bg-green-600" : "bg-red-600"}>
                                  {cmd.success ? "✅" : "❌"}
                                </Badge>
                                <span className="text-xs text-gray-500">{cmd.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </div>

                            {cmd.purpose && (
                              <div className="mb-2 p-2 bg-[#1c2333] rounded border-l-2 border-purple-500">
                                <p className="text-xs text-purple-300">
                                  <strong>¿Por qué este comando?</strong> {cmd.purpose}
                                </p>
                              </div>
                            )}

                            {cmd.expectedResult && (
                              <div className="mb-2 p-2 bg-[#1c2333] rounded border-l-2 border-blue-500">
                                <p className="text-xs text-blue-300">
                                  <strong>Resultado esperado:</strong> {cmd.expectedResult}
                                </p>
                              </div>
                            )}

                            <pre className="text-xs text-gray-300 whitespace-pre-wrap">{cmd.output}</pre>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Terminal className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-white mb-2">No hay comandos ejecutados aún</h4>
                        <p className="text-gray-400 mb-4">
                          Los comandos aparecerán aquí cuando el agente los ejecute con explicaciones Cursor-style
                        </p>
                        <div className="text-sm text-gray-500 space-y-2">
                          <p>
                            <strong>Cada comando incluirá:</strong>
                          </p>
                          <ul className="text-left inline-block space-y-1">
                            <li>• 🎯 Propósito específico del comando</li>
                            <li>• 📋 Resultado esperado</li>
                            <li>• ✅ Estado de ejecución</li>
                            <li>• 📝 Output completo</li>
                            <li>• ⏰ Timestamp de ejecución</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Common Commands */}
                <Card className="bg-[#1c2333] border-[#2b3245]">
                  <CardHeader>
                    <CardTitle className="text-white">Comandos Comunes con Explicaciones</CardTitle>
                    <CardDescription className="text-gray-400">
                      Comandos frecuentes que el agente puede ejecutar con justificaciones técnicas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { cmd: "npm install", purpose: "Instalar dependencias del proyecto" },
                        { cmd: "npm run build", purpose: "Compilar aplicación para producción" },
                        { cmd: "npm test", purpose: "Ejecutar suite de tests automatizados" },
                        { cmd: "git status", purpose: "Verificar estado del repositorio" },
                        { cmd: "git add .", purpose: "Preparar cambios para commit" },
                        { cmd: "git commit -m 'update'", purpose: "Confirmar cambios en el repositorio" },
                        { cmd: "docker build .", purpose: "Crear imagen Docker del proyecto" },
                        { cmd: "yarn dev", purpose: "Iniciar servidor de desarrollo" },
                      ].map((command, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#0e1525] rounded border">
                          <div className="flex-1">
                            <code className="text-sm text-blue-400 font-mono">{command.cmd}</code>
                            <p className="text-xs text-gray-500 mt-1">{command.purpose}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto text-gray-400 hover:text-white"
                            title="Ejecutar comando"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-[#1c2333] border-[#2b3245]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Code className="w-5 h-5 mr-2 text-[#6c63ff]" />
                        Generador de Código Cursor-Style
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Genera código con explicaciones técnicas detalladas y justificaciones
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Ej: Crea un componente React para mostrar una lista de productos con filtros avanzados, paginación, búsqueda en tiempo real, ordenamiento por múltiples criterios, y integración con una API REST. Incluye manejo de estados de carga, errores, y optimización de performance..."
                        className="bg-[#0e1525] border-[#2b3245] text-white min-h-[100px]"
                        value={codeToGenerate}
                        onChange={(e) => setCodeToGenerate(e.target.value)}
                      />
                      <div className="text-xs text-gray-500">
                        <p>
                          <strong>Tip:</strong> Sé específico sobre funcionalidades, patrones, y tecnologías para
                          obtener código más detallado.
                        </p>
                      </div>
                      <Button
                        className="w-full bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                        onClick={handleGenerateCode}
                        disabled={!codeToGenerate.trim() || isToolWorking}
                      >
                        {isToolWorking ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Code className="w-4 h-4 mr-2" />
                        )}
                        Generar con Explicaciones
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1c2333] border-[#2b3245]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-[#6c63ff]" />
                        Explicador de Código Cursor-Style
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Obtén explicaciones técnicas detalladas con análisis arquitectural
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Pega el código que quieres entender..."
                        className="bg-[#0e1525] border-[#2b3245] text-white min-h-[100px]"
                        value={codeToExplain}
                        onChange={(e) => setCodeToExplain(e.target.value)}
                      />
                      <div className="text-xs text-gray-500">
                        <p>
                          <strong>Incluirá:</strong> Funcionalidad, patrones, mejores prácticas, y oportunidades de
                          mejora.
                        </p>
                      </div>
                      <Button
                        className="w-full bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                        onClick={handleExplainCode}
                        disabled={!codeToExplain.trim() || isToolWorking}
                      >
                        {isToolWorking ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Lightbulb className="w-4 h-4 mr-2" />
                        )}
                        Explicar Técnicamente
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1c2333] border-[#2b3245] md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Bug className="w-5 h-5 mr-2 text-[#6c63ff]" />
                        Debugger Avanzado Cursor-Style
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Encuentra y corrige errores con análisis profundo y explicaciones paso a paso
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Código con Error</label>
                          <Textarea
                            placeholder="Pega el código con error..."
                            className="bg-[#0e1525] border-[#2b3245] text-white min-h-[100px]"
                            value={codeToDebug}
                            onChange={(e) => setCodeToDebug(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Descripción del Error</label>
                          <Textarea
                            placeholder="Describe el error que estás viendo, cuándo ocurre, qué esperabas que pasara..."
                            className="bg-[#0e1525] border-[#2b3245] text-white min-h-[100px]"
                            value={debugError}
                            onChange={(e) => setDebugError(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>
                          <strong>El análisis incluirá:</strong> Causa raíz, solución completa, prevención futura, y
                          tests de validación.
                        </p>
                      </div>
                      <Button
                        className="w-full bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                        onClick={handleDebugCode}
                        disabled={!codeToDebug.trim() || !debugError.trim() || isToolWorking}
                      >
                        {isToolWorking ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Bug className="w-4 h-4 mr-2" />
                        )}
                        Analizar y Corregir
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Advanced Refactoring Tools */}
                <Card className="bg-[#1c2333] border-[#2b3245]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Wrench className="w-5 h-5 mr-2 text-[#6c63ff]" />
                      Herramientas de Refactoring Cursor-Style
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Mejora tu código automáticamente con explicaciones detalladas de cada cambio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        onClick={() => handleRefactor("performance")}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center p-4 h-auto"
                        disabled={files.length === 0 || isExecuting}
                      >
                        <Zap className="w-6 h-6 mb-2" />
                        <span className="text-sm">Performance</span>
                        <span className="text-xs text-blue-200 mt-1">Optimización de velocidad</span>
                      </Button>
                      <Button
                        onClick={() => handleRefactor("security")}
                        className="bg-red-600 hover:bg-red-700 text-white flex flex-col items-center p-4 h-auto"
                        disabled={files.length === 0 || isExecuting}
                      >
                        <Shield className="w-6 h-6 mb-2" />
                        <span className="text-sm">Seguridad</span>
                        <span className="text-xs text-red-200 mt-1">Eliminar vulnerabilidades</span>
                      </Button>
                      <Button
                        onClick={() => handleRefactor("maintainability")}
                        className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center p-4 h-auto"
                        disabled={files.length === 0 || isExecuting}
                      >
                        <Wrench className="w-6 h-6 mb-2" />
                        <span className="text-sm">Mantenibilidad</span>
                        <span className="text-xs text-green-200 mt-1">Mejorar legibilidad</span>
                      </Button>
                      <Button
                        onClick={() => handleRefactor("architecture")}
                        className="bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center p-4 h-auto"
                        disabled={files.length === 0 || isExecuting}
                      >
                        <BarChart3 className="w-6 h-6 mb-2" />
                        <span className="text-sm">Arquitectura</span>
                        <span className="text-xs text-purple-200 mt-1">Mejorar diseño</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tool Results */}
                {toolResult && (
                  <Card className="bg-[#1c2333] border-[#2b3245]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Resultado Cursor-Style
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard(toolResult)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-[#0e1525] p-4 rounded border max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                          {toolResult}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="execution" className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    Log de Ejecución Cursor-Style
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`${agentMode === "autonomous" ? "bg-green-600" : agentMode === "collaborative" ? "bg-blue-600" : "bg-purple-600"} text-white`}
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      Modo: {agentMode}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${showCursorResponses ? "bg-[#6c63ff] text-white" : "bg-transparent border-[#343a4a] text-gray-300"} hover:bg-[#343a4a]`}
                      onClick={() => setShowCursorResponses(!showCursorResponses)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Cursor
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-[#343a4a] text-gray-300 hover:bg-[#343a4a]"
                      onClick={() => {
                        setExecutionLog([])
                        setCursorStyleResponses([])
                        setStreamingText("")
                      }}
                    >
                      Limpiar
                    </Button>
                  </div>
                </div>

                <Card className="flex-1 bg-[#1c2333] border-[#2b3245]">
                  <CardContent className="p-0 h-full">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-3">
                        {showCursorResponses
                          ? // Show Cursor-style responses
                            cursorStyleResponses.map((response, index) => (
                              <div key={index} className="bg-[#0e1525] p-4 rounded border border-purple-500/20">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge className="bg-purple-600 text-white text-xs">
                                    <MessageSquare className="w-3 h-3 mr-1" />
                                    Cursor Response #{index + 1}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-auto text-gray-400 hover:text-white"
                                    onClick={() => copyToClipboard(response)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                                  {response}
                                </pre>
                              </div>
                            ))
                          : // Show regular execution log
                            executionLog.map((log, index) => (
                              <div key={index} className="text-gray-300 font-mono text-sm">
                                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                              </div>
                            ))}

                        {streamingText && (
                          <div className="text-blue-400 whitespace-pre-wrap border-l-2 border-blue-400 pl-3 bg-[#0e1525] p-3 rounded">
                            <div className="flex items-center mb-2">
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              <span className="text-sm font-medium">Streaming en vivo...</span>
                            </div>
                            <pre className="text-sm font-sans leading-relaxed">{streamingText}</pre>
                          </div>
                        )}

                        {executionLog.length === 0 && cursorStyleResponses.length === 0 && !streamingText && (
                          <div className="text-center py-12">
                            <Terminal className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-white mb-2">Log de Ejecución Vacío</h4>
                            <p className="text-gray-400 mb-4">
                              Las respuestas y logs del agente aparecerán aquí cuando comiences a trabajar
                            </p>
                            <div className="text-sm text-gray-500 space-y-2">
                              <p>
                                <strong>Tipos de respuestas que verás:</strong>
                              </p>
                              <ul className="text-left inline-block space-y-1">
                                <li>• 🔍 Análisis inicial contextual</li>
                                <li>• 📝 Explicaciones step-by-step</li>
                                <li>• 🎯 Justificaciones técnicas</li>
                                <li>• ⚡ Resultados de ejecución</li>
                                <li>• 🔗 Conexiones entre componentes</li>
                                <li>• 📚 Próximos pasos sugeridos</li>
                              </ul>
                            </div>
                          </div>
                        )}

                        <div ref={logEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
