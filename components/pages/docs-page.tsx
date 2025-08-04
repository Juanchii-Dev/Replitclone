"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Code, Zap, Globe, ExternalLink, Star } from "lucide-react"

export function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "Todos", count: 24 },
    { id: "getting-started", name: "Primeros Pasos", count: 5 },
    { id: "api", name: "API Reference", count: 8 },
    { id: "tutorials", name: "Tutoriales", count: 6 },
    { id: "examples", name: "Ejemplos", count: 5 },
  ]

  const docs = [
    {
      id: 1,
      title: "Introducción a Replit",
      description: "Aprende los conceptos básicos para empezar a usar Replit",
      category: "getting-started",
      difficulty: "Principiante",
      readTime: "5 min",
      popular: true,
    },
    {
      id: 2,
      title: "Configuración del Entorno",
      description: "Cómo configurar tu entorno de desarrollo",
      category: "getting-started",
      difficulty: "Principiante",
      readTime: "10 min",
      popular: false,
    },
    {
      id: 3,
      title: "API de Autenticación",
      description: "Documentación completa de la API de autenticación",
      category: "api",
      difficulty: "Intermedio",
      readTime: "15 min",
      popular: true,
    },
    {
      id: 4,
      title: "Creando tu Primera App",
      description: "Tutorial paso a paso para crear tu primera aplicación",
      category: "tutorials",
      difficulty: "Principiante",
      readTime: "30 min",
      popular: true,
    },
    {
      id: 5,
      title: "Despliegue en Producción",
      description: "Guía para desplegar tu aplicación en producción",
      category: "tutorials",
      difficulty: "Avanzado",
      readTime: "20 min",
      popular: false,
    },
    {
      id: 6,
      title: "Ejemplo: Chat en Tiempo Real",
      description: "Implementación completa de un chat usando WebSockets",
      category: "examples",
      difficulty: "Intermedio",
      readTime: "45 min",
      popular: true,
    },
    {
      id: 7,
      title: "API de Archivos",
      description: "Cómo manejar archivos usando la API",
      category: "api",
      difficulty: "Intermedio",
      readTime: "12 min",
      popular: false,
    },
    {
      id: 8,
      title: "Ejemplo: E-commerce",
      description: "Aplicación completa de e-commerce con React y Node.js",
      category: "examples",
      difficulty: "Avanzado",
      readTime: "60 min",
      popular: true,
    },
  ]

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-500"
      case "Intermedio":
        return "bg-yellow-500"
      case "Avanzado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "getting-started":
        return <Zap size={16} />
      case "api":
        return <Code size={16} />
      case "tutorials":
        return <BookOpen size={16} />
      case "examples":
        return <Globe size={16} />
      default:
        return <BookOpen size={16} />
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-[46px] border-b border-[#1c2333] flex items-center px-4 justify-between">
        <span className="text-sm font-medium">Documentación</span>
        <Button variant="outline" className="bg-transparent border-[#1c2333] text-white h-8 px-4">
          <ExternalLink size={14} className="mr-2" />
          Ver en Web
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar en la documentación..."
              className="bg-[#1c2333] border-[#343a4a] text-white pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`h-8 ${
                  selectedCategory === category.id
                    ? "bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                    : "bg-transparent border-[#343a4a] text-gray-300 hover:bg-[#1c2333]"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {getCategoryIcon(category.id)}
                <span className="ml-2">{category.name}</span>
                <Badge variant="secondary" className="ml-2 bg-[#343a4a] text-white">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Popular Docs */}
          {selectedCategory === "all" && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Star size={18} className="mr-2 text-yellow-500" />
                Documentación Popular
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {docs
                  .filter((doc) => doc.popular)
                  .slice(0, 3)
                  .map((doc) => (
                    <Card key={doc.id} className="bg-[#1c2333] border-[#2b3245] hover:border-[#6c63ff] cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className={`${getDifficultyColor(doc.difficulty)} text-white`}>{doc.difficulty}</Badge>
                          <span className="text-xs text-gray-400">{doc.readTime}</span>
                        </div>
                        <CardTitle className="text-white text-base">{doc.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-gray-400">{doc.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* All Docs */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              {selectedCategory === "all"
                ? "Toda la Documentación"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <div className="space-y-3">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} className="bg-[#1c2333] border-[#2b3245] hover:border-[#6c63ff] cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium text-white mr-3">{doc.title}</h3>
                          {doc.popular && <Star size={14} className="text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{doc.description}</p>
                        <div className="flex items-center space-x-3">
                          <Badge className={`${getDifficultyColor(doc.difficulty)} text-white text-xs`}>
                            {doc.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-500">{doc.readTime}</span>
                          <div className="flex items-center text-xs text-gray-500">
                            {getCategoryIcon(doc.category)}
                            <span className="ml-1 capitalize">{doc.category.replace("-", " ")}</span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-gray-400 ml-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {filteredDocs.length === 0 && (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No se encontraron documentos</h3>
              <p className="text-gray-400">Intenta con otros términos de búsqueda o categorías</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
