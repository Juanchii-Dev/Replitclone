"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Square, RefreshCw, Activity, Cpu, HardDrive, Wifi, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ServerPage() {
  const [serverStatus, setServerStatus] = useState<"stopped" | "starting" | "running" | "stopping">("stopped")
  const [logs, setLogs] = useState<string[]>([
    "[INFO] Server initialized",
    "[INFO] Checking dependencies...",
    "[INFO] Ready to start",
  ])
  const { toast } = useToast()

  const serverStats = {
    cpu: 23,
    memory: 45,
    disk: 12,
    network: 8.5,
  }

  const services = [
    { name: "Web Server", status: "running", port: 3000, uptime: "2h 15m" },
    { name: "Database", status: "running", port: 5432, uptime: "2h 15m" },
    { name: "Redis Cache", status: "stopped", port: 6379, uptime: "0m" },
    { name: "API Gateway", status: "running", port: 8080, uptime: "2h 10m" },
  ]

  const handleStartServer = () => {
    setServerStatus("starting")
    setLogs((prev) => [...prev, "[INFO] Starting server..."])

    setTimeout(() => {
      setServerStatus("running")
      setLogs((prev) => [...prev, "[INFO] Server started successfully", "[INFO] Listening on port 3000"])
      toast({
        title: "Servidor iniciado",
        description: "El servidor está funcionando correctamente",
      })
    }, 2000)
  }

  const handleStopServer = () => {
    setServerStatus("stopping")
    setLogs((prev) => [...prev, "[INFO] Stopping server..."])

    setTimeout(() => {
      setServerStatus("stopped")
      setLogs((prev) => [...prev, "[INFO] Server stopped"])
      toast({
        title: "Servidor detenido",
        description: "El servidor se ha detenido correctamente",
      })
    }, 1000)
  }

  const handleRestartServer = () => {
    setServerStatus("stopping")
    setLogs((prev) => [...prev, "[INFO] Restarting server..."])

    setTimeout(() => {
      setServerStatus("starting")
      setLogs((prev) => [...prev, "[INFO] Server stopped", "[INFO] Starting server..."])

      setTimeout(() => {
        setServerStatus("running")
        setLogs((prev) => [...prev, "[INFO] Server restarted successfully"])
        toast({
          title: "Servidor reiniciado",
          description: "El servidor se ha reiniciado correctamente",
        })
      }, 2000)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500"
      case "stopped":
        return "bg-red-500"
      case "starting":
      case "stopping":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle size={16} className="text-green-500" />
      case "stopped":
        return <AlertCircle size={16} className="text-red-500" />
      default:
        return <RefreshCw size={16} className="text-yellow-500 animate-spin" />
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-[46px] border-b border-[#1c2333] flex items-center px-4 justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium">Servidor</span>
          <Badge className={`ml-2 ${getStatusColor(serverStatus)} text-white`}>
            {serverStatus === "starting" && "Iniciando"}
            {serverStatus === "running" && "Ejecutándose"}
            {serverStatus === "stopping" && "Deteniendo"}
            {serverStatus === "stopped" && "Detenido"}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          {serverStatus === "stopped" && (
            <Button
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white border-none h-8 px-4"
              onClick={handleStartServer}
            >
              <Play size={14} className="mr-2" />
              Iniciar
            </Button>
          )}
          {serverStatus === "running" && (
            <>
              <Button
                variant="outline"
                className="bg-yellow-600 hover:bg-yellow-700 text-white border-none h-8 px-4"
                onClick={handleRestartServer}
              >
                <RefreshCw size={14} className="mr-2" />
                Reiniciar
              </Button>
              <Button
                variant="outline"
                className="bg-red-600 hover:bg-red-700 text-white border-none h-8 px-4"
                onClick={handleStopServer}
              >
                <Square size={14} className="mr-2" />
                Detener
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Server Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">CPU</p>
                  <p className="text-2xl font-bold text-white">{serverStats.cpu}%</p>
                </div>
                <Cpu className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={serverStats.cpu} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Memoria</p>
                  <p className="text-2xl font-bold text-white">{serverStats.memory}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={serverStats.memory} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Disco</p>
                  <p className="text-2xl font-bold text-white">{serverStats.disk}%</p>
                </div>
                <HardDrive className="h-8 w-8 text-purple-500" />
              </div>
              <Progress value={serverStats.disk} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Red</p>
                  <p className="text-2xl font-bold text-white">{serverStats.network} MB/s</p>
                </div>
                <Wifi className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <Card className="bg-[#1c2333] border-[#2b3245]">
          <CardHeader>
            <CardTitle className="text-white">Servicios</CardTitle>
            <CardDescription className="text-gray-400">Estado de los servicios del servidor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#0e1525] rounded-md">
                  <div className="flex items-center">
                    {getStatusIcon(service.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{service.name}</p>
                      <p className="text-xs text-gray-400">Puerto {service.port}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(service.status)} text-white`}>
                      {service.status === "running" ? "Activo" : "Inactivo"}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1">Uptime: {service.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card className="bg-[#1c2333] border-[#2b3245]">
          <CardHeader>
            <CardTitle className="text-white">Logs del Servidor</CardTitle>
            <CardDescription className="text-gray-400">Registro de actividad en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-md p-4 h-64 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="text-gray-300 mb-1">
                  <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
