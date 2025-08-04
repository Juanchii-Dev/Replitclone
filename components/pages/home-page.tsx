"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Zap,
  Code,
  Globe,
  Smartphone,
  Brain,
  Rocket,
  Star,
  Clock,
  Users,
  Lightbulb,
  Target,
  ArrowRight,
} from "lucide-react"

interface HomePageProps {
  onCreateProject: (description: string) => void
}

export function HomePage({ onCreateProject }: HomePageProps) {
  const [projectDescription, setProjectDescription] = useState("")

  const projectTemplates = [
    {
      title: "E-commerce Completo",
      description: "Tienda online con carrito, pagos, inventario y panel admin",
      icon: <Globe className="w-6 h-6" />,
      tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
      complexity: "Avanzado",
      time: "8-10 semanas",
      features: ["Autenticación", "Pagos", "Inventario", "Admin Panel"],
    },
    {
      title: "Red Social",
      description: "Plataforma social con posts, comentarios, likes y chat en tiempo real",
      icon: <Users className="w-6 h-6" />,
      tags: ["React", "Socket.io", "MongoDB", "Redis"],
      complexity: "Avanzado",
      time: "10-12 semanas",
      features: ["Chat Real-time", "Feed", "Notificaciones", "Multimedia"],
    },
    {
      title: "App de Productividad",
      description: "Gestor de tareas con colaboración, calendarios y reportes",
      icon: <Target className="w-6 h-6" />,
      tags: ["Vue.js", "Express", "MySQL", "WebSockets"],
      complexity: "Intermedio",
      time: "6-8 semanas",
      features: ["Colaboración", "Calendarios", "Reportes", "Notificaciones"],
    },
    {
      title: "Plataforma de Aprendizaje",
      description: "LMS con cursos, videos, quizzes y certificaciones",
      icon: <Lightbulb className="w-6 h-6" />,
      tags: ["Next.js", "Prisma", "PostgreSQL", "AWS"],
      complexity: "Avanzado",
      time: "12-14 semanas",
      features: ["Videos", "Quizzes", "Certificados", "Progreso"],
    },
    {
      title: "Dashboard Analytics",
      description: "Panel de control con métricas, gráficos y reportes en tiempo real",
      icon: <Zap className="w-6 h-6" />,
      tags: ["React", "D3.js", "Node.js", "InfluxDB"],
      complexity: "Intermedio",
      time: "4-6 semanas",
      features: ["Gráficos", "Real-time", "Exportar", "Alertas"],
    },
    {
      title: "App Móvil Híbrida",
      description: "Aplicación móvil multiplataforma con funcionalidades nativas",
      icon: <Smartphone className="w-6 h-6" />,
      tags: ["React Native", "Expo", "Firebase", "Push"],
      complexity: "Intermedio",
      time: "8-10 semanas",
      features: ["Nativo", "Push", "Offline", "Geolocalización"],
    },
  ]

  const handleTemplateSelect = (template: any) => {
    const description = `${template.description}. 

Características principales:
${template.features.map((f: string) => `- ${f}`).join("\n")}

Stack tecnológico sugerido: ${template.tags.join(", ")}
Complejidad: ${template.complexity}
Tiempo estimado: ${template.time}

Por favor, crea una implementación completa y funcional con todas las características mencionadas.`

    setProjectDescription(description)
  }

  const handleStartBuilding = () => {
    if (projectDescription.trim()) {
      onCreateProject(projectDescription)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Básico":
        return "bg-green-600"
      case "Intermedio":
        return "bg-yellow-600"
      case "Avanzado":
        return "bg-orange-600"
      case "Experto":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-8 h-8 text-[#6c63ff]" />
            <h1 className="text-3xl font-bold text-white">HollaConnect AI</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Agente IA programador senior que construye aplicaciones completas desde cero
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Rocket className="w-4 h-4" />
              <span>Desarrollo Full-Stack</span>
            </div>
            <div className="flex items-center space-x-1">
              <Code className="w-4 h-4" />
              <span>Código Production-Ready</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>Deployment Automático</span>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="bg-[#1c2333] border-[#2b3245]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Plus className="w-5 h-5 mr-2 text-[#6c63ff]" />
              Crear Proyecto Personalizado
            </CardTitle>
            <CardDescription className="text-gray-400">
              Describe tu proyecto y el agente creará un plan detallado antes de construirlo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ej: Quiero construir una plataforma de e-learning con React y Node.js que incluya autenticación de usuarios, sistema de cursos con videos, quizzes interactivos, certificaciones automáticas, panel de administración, sistema de pagos con Stripe, notificaciones push, chat en tiempo real entre estudiantes, dashboard de analytics para instructores, y deployment automatizado en AWS..."
              className="bg-[#0e1525] border-[#2b3245] text-white min-h-[120px] resize-none"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Tip:</span> Sé específico sobre funcionalidades, tecnologías y
                características para obtener mejores resultados
              </div>
              <Button
                onClick={handleStartBuilding}
                disabled={!projectDescription.trim()}
                className="bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                Iniciar Chat de Planificación
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Project Templates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Plantillas de Proyecto</h2>
            <Badge className="bg-[#6c63ff] text-white">
              <Star className="w-3 h-3 mr-1" />
              Más Populares
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectTemplates.map((template, index) => (
              <Card
                key={index}
                className="bg-[#1c2333] border-[#2b3245] hover:border-[#6c63ff] transition-colors cursor-pointer group"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#6c63ff]/10 rounded-lg text-[#6c63ff]">{template.icon}</div>
                      <div>
                        <CardTitle className="text-white text-lg group-hover:text-[#6c63ff] transition-colors">
                          {template.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`text-xs ${getComplexityColor(template.complexity)}`}>
                            {template.complexity}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {template.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#6c63ff] transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-400 leading-relaxed">{template.description}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-gray-300 mb-2">Stack Tecnológico:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="outline"
                            className="text-xs bg-transparent border-[#343a4a] text-gray-400"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-gray-300 mb-2">Características:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, featureIndex) => (
                          <Badge
                            key={featureIndex}
                            className="text-xs bg-[#6c63ff]/10 text-[#6c63ff] border-[#6c63ff]/20"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2 text-[#6c63ff]" />
                IA Avanzada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Agente con capacidades completas de análisis, planificación, desarrollo, testing y deployment
                automático.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="w-5 h-5 mr-2 text-[#6c63ff]" />
                Código Profesional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Código limpio, documentado, con tests automatizados y siguiendo las mejores prácticas de la industria.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Rocket className="w-5 h-5 mr-2 text-[#6c63ff]" />
                Deploy Automático
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Configuración automática de CI/CD, containerización con Docker, y deployment listo para producción.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#6c63ff]">100+</div>
            <div className="text-sm text-gray-400">Proyectos Creados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#6c63ff]">50+</div>
            <div className="text-sm text-gray-400">Tecnologías</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#6c63ff]">95%</div>
            <div className="text-sm text-gray-400">Código Funcional</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#6c63ff]">24/7</div>
            <div className="text-sm text-gray-400">Disponibilidad</div>
          </div>
        </div>
      </div>
    </div>
  )
}
