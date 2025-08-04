"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Download, Star, ExternalLink, Plus, Trash, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PackagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState<"installed" | "available">("installed")
  const { toast } = useToast()

  const installedPackages = [
    {
      name: "react",
      version: "18.2.0",
      description: "A JavaScript library for building user interfaces",
      size: "2.3 MB",
      lastUpdated: "hace 2 días",
      dependencies: 3,
    },
    {
      name: "next",
      version: "13.4.0",
      description: "The React Framework for Production",
      size: "15.2 MB",
      lastUpdated: "hace 1 semana",
      dependencies: 12,
    },
    {
      name: "tailwindcss",
      version: "3.3.0",
      description: "A utility-first CSS framework",
      size: "1.8 MB",
      lastUpdated: "hace 3 días",
      dependencies: 8,
    },
    {
      name: "typescript",
      version: "5.0.4",
      description: "TypeScript is a language for application scale JavaScript development",
      size: "4.1 MB",
      lastUpdated: "hace 1 día",
      dependencies: 0,
    },
  ]

  const availablePackages = [
    {
      name: "lodash",
      version: "4.17.21",
      description: "A modern JavaScript utility library delivering modularity, performance & extras",
      downloads: "50M/week",
      stars: 55000,
      size: "1.4 MB",
      popular: true,
    },
    {
      name: "axios",
      version: "1.4.0",
      description: "Promise based HTTP client for the browser and node.js",
      downloads: "45M/week",
      stars: 98000,
      size: "500 KB",
      popular: true,
    },
    {
      name: "express",
      version: "4.18.2",
      description: "Fast, unopinionated, minimalist web framework for node",
      downloads: "30M/week",
      stars: 60000,
      size: "800 KB",
      popular: true,
    },
    {
      name: "moment",
      version: "2.29.4",
      description: "Parse, validate, manipulate, and display dates",
      downloads: "15M/week",
      stars: 47000,
      size: "2.9 MB",
      popular: false,
    },
    {
      name: "uuid",
      version: "9.0.0",
      description: "RFC4122 (v1, v4, and v5) UUIDs",
      downloads: "40M/week",
      stars: 13000,
      size: "150 KB",
      popular: false,
    },
  ]

  const handleInstallPackage = (packageName: string) => {
    toast({
      title: "Instalando paquete",
      description: `Instalando ${packageName}...`,
    })

    setTimeout(() => {
      toast({
        title: "Paquete instalado",
        description: `${packageName} se ha instalado correctamente`,
      })
    }, 2000)
  }

  const handleUninstallPackage = (packageName: string) => {
    toast({
      title: "Desinstalando paquete",
      description: `Desinstalando ${packageName}...`,
    })

    setTimeout(() => {
      toast({
        title: "Paquete desinstalado",
        description: `${packageName} se ha desinstalado correctamente`,
      })
    }, 1500)
  }

  const filteredInstalledPackages = installedPackages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredAvailablePackages = availablePackages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-[46px] border-b border-[#1c2333] flex items-center px-4 justify-between">
        <span className="text-sm font-medium">Paquetes</span>
        <Button variant="outline" className="bg-transparent border-[#1c2333] text-white h-8 px-4">
          <Settings size={14} className="mr-2" />
          Configurar
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar paquetes..."
              className="bg-[#1c2333] border-[#343a4a] text-white pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-[#1c2333] p-1 rounded-md">
            <Button
              variant={selectedTab === "installed" ? "default" : "ghost"}
              className={`flex-1 h-8 ${
                selectedTab === "installed"
                  ? "bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                  : "text-gray-300 hover:bg-[#343a4a]"
              }`}
              onClick={() => setSelectedTab("installed")}
            >
              Instalados ({installedPackages.length})
            </Button>
            <Button
              variant={selectedTab === "available" ? "default" : "ghost"}
              className={`flex-1 h-8 ${
                selectedTab === "available"
                  ? "bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                  : "text-gray-300 hover:bg-[#343a4a]"
              }`}
              onClick={() => setSelectedTab("available")}
            >
              Disponibles
            </Button>
          </div>

          {/* Installed Packages */}
          {selectedTab === "installed" && (
            <div className="space-y-3">
              {filteredInstalledPackages.map((pkg) => (
                <Card key={pkg.name} className="bg-[#1c2333] border-[#2b3245]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Package size={18} className="text-[#6c63ff] mr-2" />
                          <h3 className="font-medium text-white">{pkg.name}</h3>
                          <Badge variant="secondary" className="ml-2 bg-[#343a4a] text-white">
                            v{pkg.version}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{pkg.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{pkg.size}</span>
                          <span>{pkg.dependencies} dependencias</span>
                          <span>Actualizado {pkg.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-[#343a4a] text-gray-300 hover:bg-[#343a4a] h-8"
                        >
                          <ExternalLink size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-8"
                          onClick={() => handleUninstallPackage(pkg.name)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Available Packages */}
          {selectedTab === "available" && (
            <div className="space-y-3">
              {filteredAvailablePackages.map((pkg) => (
                <Card key={pkg.name} className="bg-[#1c2333] border-[#2b3245]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Package size={18} className="text-[#6c63ff] mr-2" />
                          <h3 className="font-medium text-white">{pkg.name}</h3>
                          <Badge variant="secondary" className="ml-2 bg-[#343a4a] text-white">
                            v{pkg.version}
                          </Badge>
                          {pkg.popular && (
                            <Badge className="ml-2 bg-yellow-600 text-white">
                              <Star size={12} className="mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{pkg.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Download size={12} className="mr-1" />
                            {pkg.downloads}
                          </span>
                          <span className="flex items-center">
                            <Star size={12} className="mr-1" />
                            {pkg.stars.toLocaleString()}
                          </span>
                          <span>{pkg.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-[#343a4a] text-gray-300 hover:bg-[#343a4a] h-8"
                        >
                          <ExternalLink size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white border-none h-8"
                          onClick={() => handleInstallPackage(pkg.name)}
                        >
                          <Plus size={14} className="mr-1" />
                          Instalar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No results */}
          {((selectedTab === "installed" && filteredInstalledPackages.length === 0) ||
            (selectedTab === "available" && filteredAvailablePackages.length === 0)) && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No se encontraron paquetes</h3>
              <p className="text-gray-400">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
