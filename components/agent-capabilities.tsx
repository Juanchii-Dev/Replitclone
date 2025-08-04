"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentFeatures } from "@/components/agent-features"
import { FileCode, Workflow, TestTube, Bug } from "lucide-react"

export function AgentCapabilities() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  
  return (
    <div className="w-full p-4 bg-[#0e1525] text-white">
      <h2 className="text-2xl font-bold mb-6">Agente de Programación Avanzado</h2>
      
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          <TabsTrigger value="demos">Demostraciones</TabsTrigger>
          <TabsTrigger value="languages">Lenguajes Soportados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features">
          <AgentFeatures />
        </TabsContent>
        
        <TabsContent value="demos">
          {!activeDemo ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#1c2333] border-[#2b3245] cursor-pointer hover:bg-[#2b3245] transition-colors" onClick={() => setActiveDemo("multifile")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileCode className="mr-2 h-5 w-5 text-[#6c63ff]" />
                    Edición Multi-archivo
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Modificación coordinada de varios archivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Demuestra cómo el agente puede modificar múltiples archivos manteniendo la coherencia entre ellos.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1c2333] border-[#2b3245] cursor-pointer hover:bg-[#2b3245] transition-colors" onClick={() => setActiveDemo("workflow")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Workflow className="mr-2 h-5 w-5 text-[#6c63ff]" />
                    Automatización de Workflow
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Implementación paso a paso de tareas complejas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Muestra cómo el agente implementa un sistema de autenticación completo paso a paso.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1c2333] border-[#2b3245] cursor-pointer hover:bg-[#2b3245] transition-colors" onClick={() => setActiveDemo("testing")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="mr-2 h-5 w-5 text-[#6c63ff]" />
                    Testing Automático
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Generación y ejecución de tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Demuestra cómo el agente puede escribir y ejecutar tests para verificar la funcionalidad del código.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1c2333] border-[#2b3245] cursor-pointer hover:bg-[#2b3245] transition-colors" onClick={() => setActiveDemo("debugging")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bug className="mr-2 h-5 w-5 text-[#6c63ff]" />
                    Debugging Asistido
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Análisis y corrección de errores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>&nbsp;\
