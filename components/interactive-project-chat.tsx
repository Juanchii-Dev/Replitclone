"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Send,
  Brain,
  CheckCircle,
  Clock,
  ArrowLeft,
  Loader2,
  Code,
  FileCode,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Key,
  File,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AIAgent, type ProjectPlan, type FileAction } from "@/lib/ai-agent"

interface Message {
  id: string
  sender: "user" | "agent"
  content: string
  timestamp: Date
  type?: "plan" | "question" | "confirmation" | "normal" | "apikey" | "building" | "file" | "command"
  planData?: ProjectPlan
  fileData?: FileAction
  commandData?: { command: string; output: string; success: boolean }
  buildingData?: { step: string; progress: number; files: FileAction[] }
}

interface Technology {
  name: string
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Testing" | "Other"
  reason: string
  icon: string
}

interface Phase {
  id: string
  name: string
  description: string
  duration: string
  tasks: Task[]
  dependencies: string[]
  deliverables: string[]
}

interface Task {
  id: string
  name: string
  description: string
  estimatedHours: number
  priority: "Alta" | "Media" | "Baja"
  skills: string[]
}

interface InteractiveProjectChatProps {
  projectDescription: string
  onProjectApproved: (project: any) => void
  onBackToHome: () => void
}

export function InteractiveProjectChat({
  projectDescription,
  onProjectApproved,
  onBackToHome,
}: InteractiveProjectChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(null)
  const [planStatus, setPlanStatus] = useState<"generating" | "ready" | "approved" | "rejected">("generating")
  const [chatPhase, setChatPhase] = useState<"planning" | "clarification" | "approval" | "apikey" | "building">(
    "planning",
  )
  const [aiAgent, setAiAgent] = useState<AIAgent | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildProgress, setBuildProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [generatedFiles, setGeneratedFiles] = useState<FileAction[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Initialize chat with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      sender: "agent",
      content: `🔍 **Analizando tu solicitud de proyecto...**

Entiendo que quieres desarrollar: **${projectDescription}**

Voy a crear un plan detallado que incluirá:
- 📋 Análisis completo de requerimientos
- 🏗️ Arquitectura técnica recomendada
- 🛠️ Stack tecnológico optimizado
- ⏱️ Cronograma realista de desarrollo

Dame un momento para analizar todos los aspectos técnicos y crear el mejor plan posible...`,
      timestamp: new Date(),
      type: "normal",
    }

    setMessages([welcomeMessage])

    // Generate plan after a delay
    setTimeout(() => {
      generateProjectPlan()
    }, 3000)
  }, [projectDescription])

  const generateProjectPlan = async () => {
    setIsTyping(true)

    // Simulate plan generation with realistic data
    setTimeout(() => {
      const plan: ProjectPlan = {
        title: `${projectDescription.split(" ").slice(0, 3).join(" ")}`,
        description: `Aplicación completa con ${projectDescription}`,
        estimatedTime: "2-3 semanas",
        technologies: ["React + TypeScript", "Node.js + Express", "PostgreSQL", "Tailwind CSS"],
        architecture: "Full-stack con React frontend, Node.js backend, PostgreSQL database",
        steps: [
          {
            id: "setup",
            title: "Setup y Configuración",
            description: "Configuración inicial del proyecto y dependencias",
            actions: [],
            status: "pending",
            timestamp: new Date(),
          },
          {
            id: "development",
            title: "Desarrollo Core",
            description: "Implementación de funcionalidades principales",
            actions: [],
            status: "pending",
            timestamp: new Date(),
          },
          {
            id: "deploy",
            title: "Testing y Deploy",
            description: "Pruebas y deployment a producción",
            actions: [],
            status: "pending",
            timestamp: new Date(),
          },
        ],
        codebaseAnalysis: {
          architecture: "Nueva aplicación",
          frameworks: [],
          dependencies: {},
          patterns: [],
          issues: [],
          suggestions: [],
          complexity: 1,
        },
      }

      setCurrentPlan(plan)
      setIsTyping(false)
      setPlanStatus("ready")
      setChatPhase("approval")

      const planMessage: Message = {
        id: "plan-presentation",
        sender: "agent",
        content: `🎯 **Plan de Desarrollo Listo**

He creado un plan optimizado para tu proyecto:

**📋 ${plan.title}**
**⏱️ Tiempo estimado:** ${plan.estimatedTime}
**🛠️ Stack:** React + TypeScript, Node.js, PostgreSQL
**📈 Fases:** ${plan.steps.length} fases de desarrollo

**¿Qué voy a construir?**
- ✅ Frontend React completo con TypeScript
- ✅ Backend Node.js con API REST
- ✅ Base de datos PostgreSQL configurada
- ✅ Integración completa frontend-backend
- ✅ Deployment listo para producción

**Timeline:**
• **Semana 1:** Setup y configuración inicial
• **Semanas 1-2:** Desarrollo de funcionalidades core
• **Semana 3:** Testing y deployment

¿Apruebas este plan para comenzar la construcción?`,
        timestamp: new Date(),
        type: "plan",
        planData: plan,
      }

      setMessages((prev) => [...prev, planMessage])
    }, 2000)
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: inputMessage,
      timestamp: new Date(),
      type: "normal",
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setIsTyping(true)

    // Handle different phases
    setTimeout(() => {
      let agentResponse = ""

      if (chatPhase === "apikey") {
        // Handle API key input
        if (currentInput.startsWith("sk-") && currentInput.length > 20) {
          setApiKey(currentInput)
          agentResponse = `✅ **API Key configurada correctamente**

Perfecto, he configurado tu API Key de OpenAI. Ahora puedo comenzar la construcción del proyecto.

**🚀 Iniciando construcción automática...**

Voy a crear tu proyecto paso a paso:
1. 📁 Configurar estructura de archivos
2. 💻 Generar código completo y funcional
3. 🔗 Configurar todas las conexiones
4. ✅ Validar funcionalidad

**Comenzando en 3 segundos...**`

          setChatPhase("building")

          // Start building after showing confirmation
          setTimeout(() => {
            startProjectBuilding(currentInput)
          }, 3000)
        } else {
          agentResponse = `❌ **API Key inválida**

La API Key debe comenzar con "sk-" y tener al menos 20 caracteres.

Por favor, proporciona una API Key válida de OpenAI para continuar con la construcción del proyecto.

Puedes obtener tu API Key en: https://platform.openai.com/api-keys`
        }
      } else if (chatPhase === "approval") {
        if (
          currentInput.toLowerCase().includes("apruebo") ||
          currentInput.toLowerCase().includes("acepto") ||
          currentInput.toLowerCase().includes("sí") ||
          currentInput.toLowerCase().includes("si") ||
          currentInput.toLowerCase().includes("aprobar")
        ) {
          agentResponse = `🔑 **Plan aprobado - Necesito tu API Key**

Excelente! Para construir tu proyecto necesito acceso a OpenAI GPT-4.

**¿Por qué necesito la API Key?**
- 🧠 Generar código inteligente y funcional
- 🔍 Analizar y optimizar la arquitectura
- 🛠️ Crear componentes personalizados
- ✅ Validar y corregir errores automáticamente

**¿Cómo obtener tu API Key?**
1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva API Key
3. Cópiala y pégala aquí

**Tu API Key estará segura y solo se usará para este proyecto.**

Por favor, proporciona tu API Key de OpenAI (comienza con "sk-"):`

          setChatPhase("apikey")
        } else if (currentInput.toLowerCase().includes("no") || currentInput.toLowerCase().includes("rechazo")) {
          agentResponse = `🤔 **Entiendo tus reservas**

No hay problema, puedo ajustar el plan según tus necesidades.

**¿Qué te gustaría cambiar?**
- 🛠️ Stack tecnológico diferente
- ⏱️ Timeline más corto/largo
- 🎯 Funcionalidades específicas
- 🏗️ Arquitectura alternativa

Por favor, dime específicamente qué aspectos te gustaría modificar.`
        } else {
          agentResponse = `💭 **Respondiendo a tu consulta...**

Entiendo tu pregunta sobre el plan. 

${
  currentInput.toLowerCase().includes("tiempo") || currentInput.toLowerCase().includes("duración")
    ? "⏱️ **Sobre el timeline:** El tiempo estimado incluye desarrollo completo, testing, y deployment. Podemos ajustarlo según tus prioridades."
    : currentInput.toLowerCase().includes("tecnología") || currentInput.toLowerCase().includes("stack")
      ? "🛠️ **Sobre las tecnologías:** He seleccionado un stack moderno y probado. Si prefieres tecnologías específicas, puedo ajustar el plan."
      : "📋 **Sobre el plan:** He diseñado cada fase para maximizar valor y minimizar riesgos. Cada decisión tiene una justificación técnica sólida."
}

¿Hay algo más específico que te gustaría saber? ¿O estás listo para aprobar el plan?`
        }
      } else {
        agentResponse = `🤖 **Procesando tu mensaje...**

Gracias por tu input. Estoy aquí para responder cualquier pregunta sobre el plan de desarrollo.

¿Hay algo específico sobre el proyecto que te gustaría discutir?`
      }

      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        content: agentResponse,
        timestamp: new Date(),
        type: chatPhase === "apikey" ? "apikey" : "normal",
      }

      setMessages((prev) => [...prev, agentMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleApprovePlan = () => {
    if (currentPlan) {
      const approvalMessage: Message = {
        id: `approval-${Date.now()}`,
        sender: "agent",
        content: `🔑 **Plan Aprobado - Necesito tu API Key**

Excelente! Para construir tu proyecto necesito acceso a OpenAI GPT-4.

**¿Por qué necesito la API Key?**
- 🧠 Generar código inteligente y funcional
- 🔍 Analizar y optimizar la arquitectura
- 🛠️ Crear componentes personalizados
- ✅ Validar y corregir errores automáticamente

**¿Cómo obtener tu API Key?**
1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva API Key
3. Cópiala y pégala en el chat

**Tu API Key estará segura y solo se usará para este proyecto.**

Por favor, proporciona tu API Key de OpenAI (comienza con "sk-"):`,
        timestamp: new Date(),
        type: "apikey",
      }

      setMessages((prev) => [...prev, approvalMessage])
      setChatPhase("apikey")
    }
  }

  const handleRejectPlan = () => {
    const rejectionMessage: Message = {
      id: `rejection-${Date.now()}`,
      sender: "agent",
      content: `🤔 **Plan rechazado - Vamos a mejorarlo**

No hay problema, entiendo que el plan actual no cumple completamente tus expectativas.

**¿Qué te gustaría ajustar?**
- 🛠️ **Stack tecnológico:** ¿Prefieres otras tecnologías?
- ⏱️ **Timeline:** ¿Necesitas más/menos tiempo?
- 🎯 **Funcionalidades:** ¿Faltan features importantes?
- 🏗️ **Arquitectura:** ¿Prefieres un approach diferente?

Por favor, dime específicamente qué aspectos te gustaría cambiar.`,
      timestamp: new Date(),
      type: "question",
    }

    setMessages((prev) => [...prev, rejectionMessage])
    setChatPhase("clarification")
  }

  const startProjectBuilding = async (apiKeyValue: string) => {
    try {
      // Initialize AI Agent with the provided API key
      const agent = new AIAgent(apiKeyValue)
      setAiAgent(agent)
      setIsBuilding(true)
      setBuildProgress(0)

      // Start building message
      const buildingStartMessage: Message = {
        id: `building-start-${Date.now()}`,
        sender: "agent",
        content: `🚀 **Construcción Iniciada**

Comenzando la construcción de tu proyecto con IA...

**🔍 Paso 1: Analizando requerimientos**
Analizando "${projectDescription}" para crear la arquitectura óptima...`,
        timestamp: new Date(),
        type: "building",
        buildingData: { step: "Analizando requerimientos", progress: 10, files: [] },
      }

      setMessages((prev) => [...prev, buildingStartMessage])
      setCurrentStep("Analizando requerimientos")
      setBuildProgress(10)

      // Step 1: Create project plan
      setTimeout(async () => {
        const plan = await agent.createProjectPlan(projectDescription)

        const step1Message: Message = {
          id: `building-step1-${Date.now()}`,
          sender: "agent",
          content: `✅ **Análisis Completado**

**🏗️ Paso 2: Creando estructura del proyecto**
Generando estructura de archivos y configuración inicial...

**Arquitectura detectada:** ${plan.architecture}
**Tecnologías:** ${plan.technologies.join(", ")}`,
          timestamp: new Date(),
          type: "building",
          buildingData: { step: "Creando estructura", progress: 25, files: [] },
        }

        setMessages((prev) => [...prev, step1Message])
        setCurrentStep("Creando estructura")
        setBuildProgress(25)

        // Step 2: Generate project structure
        setTimeout(() => {
          generateProjectStructure(agent, plan)
        }, 2000)
      }, 3000)
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: "agent",
        content: `❌ **Error en la construcción**

Hubo un problema al inicializar el agente:
${error instanceof Error ? error.message : "Error desconocido"}

Por favor, verifica tu API Key e intenta nuevamente.`,
        timestamp: new Date(),
        type: "normal",
      }

      setMessages((prev) => [...prev, errorMessage])
      setIsBuilding(false)
      setChatPhase("apikey")
    }
  }

  const generateProjectStructure = async (agent: AIAgent, plan: ProjectPlan) => {
    try {
      // Generate package.json
      const packageJsonContent = `{
  "name": "${plan.title.toLowerCase().replace(/\s+/g, "-")}",
  "version": "1.0.0",
  "description": "${plan.description}",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}`

      const packageJsonFile: FileAction = {
        type: "create",
        path: "/package.json",
        content: packageJsonContent,
        explanation: "Configuración del proyecto con dependencias necesarias",
        purpose: "Definir dependencias y scripts del proyecto",
      }

      setGeneratedFiles([packageJsonFile])

      const step2Message: Message = {
        id: `building-step2-${Date.now()}`,
        sender: "agent",
        content: `📁 **Archivo creado: package.json**

**¿Por qué este archivo?** Define las dependencias y configuración del proyecto
**¿Qué incluye?** Next.js, React, TypeScript y herramientas de desarrollo

**🔧 Paso 3: Generando componentes principales**
Creando componentes React y páginas principales...`,
        timestamp: new Date(),
        type: "file",
        fileData: packageJsonFile,
        buildingData: { step: "Generando componentes", progress: 50, files: [packageJsonFile] },
      }

      setMessages((prev) => [...prev, step2Message])
      setCurrentStep("Generando componentes")
      setBuildProgress(50)

      // Step 3: Generate main components
      setTimeout(() => {
        generateMainComponents(agent, plan)
      }, 2000)
    } catch (error) {
      console.error("Error generating structure:", error)
    }
  }

  const generateMainComponents = async (agent: AIAgent, plan: ProjectPlan) => {
    try {
      // Generate main page component
      const mainPageContent = `import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [message, setMessage] = useState('¡Bienvenido a tu nueva aplicación!')

  return (
    <>
      <Head>
        <title>${plan.title}</title>
        <meta name="description" content="${plan.description}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ${plan.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              ${plan.description}
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Estado del Proyecto</h2>
              <p className="text-green-600 font-medium">{message}</p>
              <button 
                onClick={() => setMessage('¡Proyecto funcionando correctamente!')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Probar Funcionalidad
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🛠️ Tecnologías</h3>
              <ul className="space-y-2">
                ${plan.technologies
                  .map(
                    (tech) => `<li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  ${tech}
                </li>`,
                  )
                  .join("\n                ")}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📋 Características</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Interfaz moderna y responsive
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Código TypeScript type-safe
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Optimizado para producción
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Listo para deployment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}`

      const mainPageFile: FileAction = {
        type: "create",
        path: "/pages/index.tsx",
        content: mainPageContent,
        explanation: "Página principal de la aplicación con interfaz completa",
        purpose: "Punto de entrada principal de la aplicación",
      }

      const updatedFiles = [...generatedFiles, mainPageFile]
      setGeneratedFiles(updatedFiles)

      const step3Message: Message = {
        id: `building-step3-${Date.now()}`,
        sender: "agent",
        content: `⚛️ **Archivo creado: pages/index.tsx**

**¿Por qué este archivo?** Página principal de la aplicación
**¿Qué incluye?** Interfaz completa, responsive, y funcional

**🎨 Paso 4: Configurando estilos y optimizaciones**
Añadiendo Tailwind CSS y configuraciones finales...`,
        timestamp: new Date(),
        type: "file",
        fileData: mainPageFile,
        buildingData: { step: "Configurando estilos", progress: 75, files: updatedFiles },
      }

      setMessages((prev) => [...prev, step3Message])
      setCurrentStep("Configurando estilos")
      setBuildProgress(75)

      // Step 4: Final configurations
      setTimeout(() => {
        finalizeProject(plan, updatedFiles)
      }, 2000)
    } catch (error) {
      console.error("Error generating components:", error)
    }
  }

  const finalizeProject = (plan: ProjectPlan, files: FileAction[]) => {
    // Generate final configuration files
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}`

    const tailwindFile: FileAction = {
      type: "create",
      path: "/tailwind.config.js",
      content: tailwindConfig,
      explanation: "Configuración de Tailwind CSS para estilos",
      purpose: "Configurar sistema de diseño y estilos",
    }

    const readmeContent = `# ${plan.title}

${plan.description}

## 🚀 Tecnologías Utilizadas

${plan.technologies.map((tech) => `- ${tech}`).join("\n")}

## 📦 Instalación

\`\`\`bash
npm install
\`\`\`

## 🏃‍♂️ Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Build para Producción

\`\`\`bash
npm run build
npm start
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
${plan.title.toLowerCase().replace(/\s+/g, "-")}/
├── pages/
│   └── index.tsx          # Página principal
├── package.json           # Dependencias y scripts
├── tailwind.config.js     # Configuración de Tailwind
└── README.md             # Este archivo
\`\`\`

## ✨ Características

- ✅ Interfaz moderna y responsive
- ✅ TypeScript para type safety
- ✅ Tailwind CSS para estilos
- ✅ Optimizado para producción
- ✅ Listo para deployment

## 🚀 Deployment

Este proyecto está listo para ser desplegado en Vercel, Netlify, o cualquier plataforma que soporte Next.js.

---

**Proyecto generado automáticamente por IA** 🤖`

    const readmeFile: FileAction = {
      type: "create",
      path: "/README.md",
      content: readmeContent,
      explanation: "Documentación completa del proyecto",
      purpose: "Guía de instalación y uso del proyecto",
    }

    const finalFiles = [...files, tailwindFile, readmeFile]
    setGeneratedFiles(finalFiles)

    const completionMessage: Message = {
      id: `building-complete-${Date.now()}`,
      sender: "agent",
      content: `🎉 **¡Proyecto Completado Exitosamente!**

**✅ Construcción finalizada en tiempo récord**

**📁 Archivos generados:**
- \`package.json\` - Configuración del proyecto
- \`pages/index.tsx\` - Página principal completa
- \`tailwind.config.js\` - Configuración de estilos
- \`README.md\` - Documentación completa

**🚀 Tu proyecto está listo para:**
- ✅ Desarrollo local (\`npm run dev\`)
- ✅ Build de producción (\`npm run build\`)
- ✅ Deployment inmediato
- ✅ Personalización y extensión

**📋 Próximos pasos:**
1. Descarga los archivos generados
2. Ejecuta \`npm install\` para instalar dependencias
3. Ejecuta \`npm run dev\` para iniciar desarrollo
4. ¡Comienza a personalizar tu aplicación!

**¿Necesitas algún ajuste o funcionalidad adicional?**`,
      timestamp: new Date(),
      type: "building",
      buildingData: { step: "Completado", progress: 100, files: finalFiles },
    }

    setMessages((prev) => [...prev, completionMessage])
    setCurrentStep("Completado")
    setBuildProgress(100)
    setIsBuilding(false)

    // Show success toast
    toast({
      title: "🎉 Proyecto Completado",
      description: "Tu aplicación ha sido generada exitosamente",
    })
  }

  const getFileIcon = (filePath: string) => {
    const extension = filePath.split(".").pop()
    switch (extension) {
      case "tsx":
      case "jsx":
        return <Code className="w-4 h-4 text-blue-400" />
      case "json":
        return <FileCode className="w-4 h-4 text-green-400" />
      case "js":
        return <FileCode className="w-4 h-4 text-yellow-400" />
      case "md":
        return <File className="w-4 h-4 text-gray-400" />
      default:
        return <File className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-[46px] border-b border-[#1c2333] flex items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={onBackToHome}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 text-[#6c63ff] mr-2" />
            <span className="text-sm font-medium">Chat de Construcción IA</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            className={`${
              chatPhase === "planning"
                ? "bg-blue-600"
                : chatPhase === "approval"
                  ? "bg-yellow-600"
                  : chatPhase === "apikey"
                    ? "bg-purple-600"
                    : chatPhase === "building"
                      ? "bg-green-600"
                      : "bg-gray-600"
            } text-white`}
          >
            {chatPhase === "planning"
              ? "Planificando"
              : chatPhase === "approval"
                ? "Esperando Aprobación"
                : chatPhase === "apikey"
                  ? "Configurando API"
                  : chatPhase === "building"
                    ? "Construyendo"
                    : "Clarificando"}
          </Badge>

          {isBuilding && (
            <Badge className="bg-green-600 text-white">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              {Math.round(buildProgress)}%
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] ${
                      message.sender === "user" ? "bg-[#6c63ff] text-white" : "bg-[#1c2333] text-gray-100"
                    } rounded-lg p-4`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "agent" && <Brain className="w-5 h-5 text-[#6c63ff] mt-1 flex-shrink-0" />}
                      <div className="flex-1">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{message.content}</pre>
                        <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>

                    {/* Plan Details - Simplified */}
                    {message.type === "plan" && message.planData && (
                      <div className="mt-4 space-y-4">
                        <Separator className="bg-gray-600" />

                        {/* Simplified Plan Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-[#0e1525] border-[#2b3245]">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-white text-sm">📋 Resumen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Duración:</span>
                                <span className="text-white">{message.planData.estimatedTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Fases:</span>
                                <span className="text-white">{message.planData.steps.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Tecnologías:</span>
                                <span className="text-white">{message.planData.technologies.length}</span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-[#0e1525] border-[#2b3245]">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-white text-sm">🛠️ Stack</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {message.planData.technologies.map((tech, index) => (
                                  <Badge key={index} variant="secondary" className="bg-[#343a4a] text-white text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Action Buttons - Always visible */}
                        <div className="flex space-x-3 pt-4">
                          <Button
                            onClick={handleApprovePlan}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Aprobar y Construir
                          </Button>
                          <Button
                            onClick={handleRejectPlan}
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white flex-1 bg-transparent"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modificar Plan
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* File Display */}
                    {message.type === "file" && message.fileData && (
                      <div className="mt-4 space-y-3">
                        <Separator className="bg-gray-600" />
                        <div className="bg-[#0e1525] border border-[#2b3245] rounded p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            {getFileIcon(message.fileData.path)}
                            <span className="text-sm font-medium text-white">{message.fileData.path}</span>
                            <Badge className="bg-green-600 text-white text-xs">Creado</Badge>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{message.fileData.explanation}</p>
                          <details className="text-xs">
                            <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                              Ver contenido del archivo
                            </summary>
                            <pre className="mt-2 p-2 bg-[#1c2333] rounded text-gray-300 overflow-x-auto max-h-40">
                              <code>{message.fileData.content}</code>
                            </pre>
                          </details>
                        </div>
                      </div>
                    )}

                    {/* Building Progress */}
                    {message.type === "building" && message.buildingData && (
                      <div className="mt-4 space-y-3">
                        <Separator className="bg-gray-600" />
                        <div className="bg-[#0e1525] border border-[#2b3245] rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">{message.buildingData.step}</span>
                            <span className="text-xs text-gray-400">{message.buildingData.progress}%</span>
                          </div>
                          <Progress value={message.buildingData.progress} className="h-2 mb-2" />
                          {message.buildingData.files.length > 0 && (
                            <div className="text-xs text-gray-400">
                              Archivos generados: {message.buildingData.files.length}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1c2333] text-gray-100 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-[#6c63ff]" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#6c63ff] rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-[#6c63ff] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#6c63ff] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400">El agente está escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          {chatPhase !== "building" && (
            <div className="border-t border-[#1c2333] p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      chatPhase === "apikey"
                        ? "Pega tu API Key de OpenAI aquí (sk-...)..."
                        : chatPhase === "approval"
                          ? "Escribe 'apruebo' para continuar, o haz preguntas sobre el plan..."
                          : "Escribe tu mensaje o pregunta..."
                    }
                    type={chatPhase === "apikey" ? "password" : "text"}
                    className="bg-[#1c2333] border-[#2b3245] text-white flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                  >
                    {chatPhase === "apikey" ? <Key className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>

                {chatPhase === "approval" && currentPlan && (
                  <div className="flex space-x-2 mt-3">
                    <Button
                      onClick={handleApprovePlan}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Aprobar Plan
                    </Button>
                    <Button
                      onClick={handleRejectPlan}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                      size="sm"
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Solicitar Cambios
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with Progress */}
        <div className="w-80 border-l border-[#1c2333] bg-[#0e1525] p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Estado del Proyecto</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <div>📋 {currentPlan?.title || "Analizando..."}</div>
                <div>⏱️ {currentPlan?.estimatedTime || "Calculando..."}</div>
                <div>🛠️ {currentPlan?.technologies.length || 0} tecnologías</div>
                <div>📁 {generatedFiles.length} archivos generados</div>
              </div>
            </div>

            <Separator className="bg-[#1c2333]" />

            <div>
              <h4 className="text-sm font-medium text-white mb-2">Progreso de Construcción</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-300">Plan generado</span>
                </div>
                <div className="flex items-center space-x-2">
                  {chatPhase === "approval" || chatPhase === "apikey" || chatPhase === "building" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-xs text-gray-300">Plan aprobado</span>
                </div>
                <div className="flex items-center space-x-2">
                  {chatPhase === "building" || buildProgress > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : chatPhase === "apikey" ? (
                    <Clock className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-xs text-gray-300">API Key configurada</span>
                </div>
                <div className="flex items-center space-x-2">
                  {buildProgress === 100 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : isBuilding ? (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-xs text-gray-300">Proyecto construido</span>
                </div>
              </div>
            </div>

            {isBuilding && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Construyendo...</h4>
                <Progress value={buildProgress} className="h-2 mb-2" />
                <div className="text-xs text-gray-400">{currentStep}</div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(buildProgress)}% completado</div>
              </div>
            )}

            {generatedFiles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Archivos Generados</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {generatedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      {getFileIcon(file.path)}
                      <span className="text-gray-300 truncate">{file.path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
