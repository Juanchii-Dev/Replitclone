"use client"

import { useState } from "react"
import {
  FileCode,
  Lightbulb,
  MessageSquare,
  Wand2,
  Bug,
  Files,
  Brain,
  Workflow,
  CheckSquare,
  TestTube,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AgentFeatures() {
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [codeExplanation, setCodeExplanation] = useState<string | null>(null)

  // Simular autocompletado inteligente
  const handleAutocomplete = () => {
    setSelectedCode(`function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}`)
  }

  // Simular explicación de código
  const handleExplainCode = () => {
    setCodeExplanation(`Esta función calcula el total de una compra:

1. Recibe un array de items como parámetro
2. Utiliza el método reduce() para iterar sobre cada item
3. Para cada item, multiplica su precio por su cantidad
4. Acumula estos valores para obtener el total
5. Retorna el valor total calculado

Es una implementación eficiente que utiliza programación funcional.`)
  }

  // Simular generación de función
  const handleGenerateFunction = () => {
    setSelectedCode(`/**
 * Valida si un email tiene formato correcto
 * @param {string} email - El email a validar
 * @returns {boolean} - true si el email es válido, false en caso contrario
 */
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}`)
  }

  // Simular debugging asistido
  const handleDebug = () => {
    setSelectedCode(`// Error original:
function fetchData() {
  fetch('https://api.example.com/data')
    .then(response => response.json)
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

// Corrección:
function fetchData() {
  fetch('https://api.example.com/data')
    .then(response => response.json()) // Se añadieron paréntesis para llamar al método
    .then(data => console.log(data))
    .catch(error => console.error(error));
}`)

    setCodeExplanation(`Error detectado: response.json es una referencia al método, pero no lo estás ejecutando.

Solución: Añadir paréntesis para llamar al método: response.json()

Este es un error común cuando se trabaja con Promises en JavaScript. El método json() de la respuesta fetch debe ser invocado como una función para parsear el cuerpo de la respuesta como JSON.`)
  }

  return (
    <div className="w-full p-4 bg-[#0e1525] text-white">
      <h2 className="text-2xl font-bold mb-6">Capacidades del Agente</h2>

      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">Básicas</TabsTrigger>
          <TabsTrigger value="intermediate">Intermedias</TabsTrigger>
          <TabsTrigger value="advanced">Avanzadas</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCode className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Autocompletado Inteligente
                </CardTitle>
                <CardDescription className="text-gray-400">Sugerencias de código en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Te sugiere código en tiempo real mientras escribes, aprendiendo de tu estilo y del contexto de tu
                  proyecto.
                </p>
                <Button
                  variant="outline"
                  className="bg-transparent border-[#2b3245] text-white hover:bg-[#2b3245]"
                  onClick={handleAutocomplete}
                >
                  Ver ejemplo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Explicación de Código
                </CardTitle>
                <CardDescription className="text-gray-400">Entiende cualquier fragmento de código</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Selecciona cualquier fragmento de código y el agente te explicará qué hace, cómo funciona y por qué.
                </p>
                <Button
                  variant="outline"
                  className="bg-transparent border-[#2b3245] text-white hover:bg-[#2b3245]"
                  onClick={handleExplainCode}
                >
                  Ver ejemplo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Generación de Funciones
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Crea funciones completas con una simple descripción
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Pide una función específica y el agente la generará adaptándose al lenguaje y estilo de tu proyecto.
                </p>
                <Button
                  variant="outline"
                  className="bg-transparent border-[#2b3245] text-white hover:bg-[#2b3245]"
                  onClick={handleGenerateFunction}
                >
                  Ver ejemplo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Chat Contextual
                </CardTitle>
                <CardDescription className="text-gray-400">Conversa sobre tu código y proyecto</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Una barra lateral de chat donde puedes hacer preguntas sobre tu código, pedir generación o
                  refactorización, y consultar documentación.
                </p>
                <Button variant="outline" className="bg-transparent border-[#2b3245] text-white hover:bg-[#2b3245]">
                  Abrir chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Files className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Modificaciones en Múltiples Archivos
                </CardTitle>
                <CardDescription className="text-gray-400">Cambios coordinados en todo el proyecto</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  El agente puede modificar varios archivos a la vez, actualizando referencias y manteniendo la
                  coherencia del código.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Memoria Contextual
                </CardTitle>
                <CardDescription className="text-gray-400">Recuerda tu sesión y objetivos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  El agente recuerda lo que has hecho en la sesión y mantiene objetivos a largo plazo, avanzando por
                  pasos.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Análisis de Errores
                </CardTitle>
                <CardDescription className="text-gray-400">Debugging asistido inteligente</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Pega un error de consola y el agente te explicará qué significa, por qué ocurrió y cómo solucionarlo.
                </p>
                <Button
                  variant="outline"
                  className="bg-transparent border-[#2b3245] text-white hover:bg-[#2b3245]"
                  onClick={handleDebug}
                >
                  Ver ejemplo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Generación de Proyectos Completos
                </CardTitle>
                <CardDescription className="text-gray-400">Crea proyectos enteros desde cero</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Describe un proyecto y el agente generará todos los archivos, estructura de carpetas, componentes y
                  lógica necesarios.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Workflow className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Automatización de Workflows
                </CardTitle>
                <CardDescription className="text-gray-400">Implementa tareas complejas paso a paso</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Define tareas complejas como "Crear un sistema de login con JWT" y el agente las implementará paso a
                  paso.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckSquare className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Checkpoint Controlado
                </CardTitle>
                <CardDescription className="text-gray-400">Control total sobre los checkpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Configura el agente para no guardar checkpoints automáticos hasta que todo esté terminado y revisado.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1c2333] border-[#2b3245]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="mr-2 h-5 w-5 text-[#6c63ff]" />
                  Revisión y Testing
                </CardTitle>
                <CardDescription className="text-gray-400">Tests automáticos y revisión de código</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  El agente puede escribir y ejecutar tests automáticos, detectando errores de lógica o casos no
                  contemplados.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedCode && (
        <div className="mt-8 p-4 bg-[#1c2333] rounded-md border border-[#2b3245]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Ejemplo de código</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-400 hover:text-white"
              onClick={() => setSelectedCode(null)}
            >
              <X size={16} />
            </Button>
          </div>
          <pre className="p-4 bg-[#0e1525] rounded overflow-x-auto">
            <code className="text-sm font-mono text-white">{selectedCode}</code>
          </pre>

          {codeExplanation && (
            <div className="mt-4 p-4 bg-[#0e1525] rounded border border-[#2b3245]">
              <h4 className="text-md font-medium mb-2">Explicación:</h4>
              <p className="text-sm text-gray-300 whitespace-pre-line">{codeExplanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
