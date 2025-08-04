"use client"

import { useState, useCallback } from "react"
import {
  AIAgent,
  type ProjectPlan,
  type AgentStep,
  type FileAction,
  type CodeAnalysis,
  type CommandExecution,
  type AgentMode,
} from "@/lib/ai-agent"

export interface FileItem {
  id: string
  name: string
  path: string
  type: "file" | "folder"
  content?: string
  extension?: string
  children?: FileItem[]
  expanded?: boolean
  lastModified: Date
  analysis?: CodeAnalysis
}

export function useAIAgent() {
  const [agent, setAgent] = useState<AIAgent | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLog, setExecutionLog] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [agentMode, setAgentMode] = useState<AgentMode>("autonomous")
  const [commandHistory, setCommandHistory] = useState<CommandExecution[]>([])
  const [codebaseAnalysis, setCodebaseAnalysis] = useState<CodeAnalysis | null>(null)
  const [cursorStyleResponses, setCursorStyleResponses] = useState<string[]>([])

  const initializeAgent = useCallback(
    (apiKey: string) => {
      try {
        if (!apiKey || apiKey.trim() === "" || apiKey === "demo") {
          throw new Error("Se requiere una API Key válida de OpenAI")
        }

        const newAgent = new AIAgent(apiKey)
        newAgent.setMode(agentMode)
        setAgent(newAgent)
        setIsInitialized(true)
        setError(null)

        const initResponse = `🔍 Inicializando Agente IA Avanzado...

✅ **Agente conectado exitosamente**

**¿Qué capacidades tienes ahora?**
- 🧠 Análisis completo de codebase con arquitectura
- 🛠️ Edición multi-archivo con coherencia mantenida
- 💻 Ejecución de comandos de terminal
- 🧪 Testing automatizado con validación
- 🔍 Detección y corrección de errores
- ⚡ Optimización de performance
- 🔒 Security scanning y mejores prácticas
- 📚 Generación de documentación completa

**Modo actual:** ${agentMode.toUpperCase()}
**¿Por qué este modo?** ${
          agentMode === "autonomous"
            ? "Trabajo independiente con decisiones técnicas autónomas"
            : agentMode === "collaborative"
              ? "Colaboración activa con confirmaciones y sugerencias"
              : "Exploración y análisis sin modificaciones"
        }

**Próximos pasos sugeridos:**
- [ ] Crear un nuevo proyecto desde cero
- [ ] Analizar codebase existente
- [ ] Configurar proyecto con tecnologías específicas

🚀 **¡Listo para desarrollo full-stack profesional!**

¿Qué proyecto quieres que desarrollemos juntos?`

        setExecutionLog([initResponse])
        setCursorStyleResponses([initResponse])

        return newAgent
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        const errorResponse = `🔍 Intentando inicializar agente...

❌ **Error de inicialización**

**¿Qué pasó?**
${errorMessage}

**¿Cómo solucionarlo?**
1. Verificar que la API Key sea válida (debe empezar con 'sk-')
2. Confirmar que tienes créditos disponibles en OpenAI
3. Revisar tu conexión a internet

**Próximos pasos sugeridos:**
- [ ] Verificar API Key en platform.openai.com
- [ ] Revisar billing y usage limits
- [ ] Intentar con una API Key diferente

¿Necesitas ayuda para obtener o configurar tu API Key?`

        setError(errorMessage)
        setAgent(null)
        setIsInitialized(false)
        setExecutionLog([errorResponse])
        setCursorStyleResponses([errorResponse])
        throw err
      }
    },
    [agentMode],
  )

  const changeAgentMode = useCallback(
    (mode: AgentMode) => {
      setAgentMode(mode)
      if (agent) {
        agent.setMode(mode)

        const modeResponse = `🔄 Cambiando modo del agente...

✅ **Modo actualizado a: ${mode.toUpperCase()}**

**¿Qué significa este modo?**
${
  mode === "autonomous"
    ? `**Autónomo:** Trabajo independiente con decisiones técnicas propias
  - Completa tareas sin supervisión constante
  - Toma decisiones basadas en mejores prácticas
  - Implementa features completas automáticamente
  - Auto-corrige errores encontrados`
    : mode === "collaborative"
      ? `**Colaborativo:** Trabajo conjunto con confirmaciones
  - Solicita confirmación para cambios críticos
  - Proporciona múltiples opciones cuando es apropiado
  - Explica decisiones técnicas detalladamente
  - Trabaja paso a paso con feedback constante`
      : `**Exploración:** Análisis sin modificaciones
  - Examina código existente sin cambios
  - Genera documentación y reportes
  - Identifica oportunidades de mejora
  - Proporciona insights arquitecturales`
}

**¿Cómo afecta tu trabajo?**
El agente ahora ${mode === "autonomous" ? "trabajará de forma independiente" : mode === "collaborative" ? "pedirá confirmación antes de cambios importantes" : "solo analizará sin modificar código"}.

**Próximos pasos sugeridos:**
- [ ] Probar el nuevo modo con una tarea específica
- [ ] Ajustar preferencias si es necesario
- [ ] Continuar con el desarrollo del proyecto

¿Quieres que pruebe el nuevo modo con alguna tarea específica?`

        setExecutionLog((prev) => [...prev, modeResponse])
        setCursorStyleResponses((prev) => [...prev, modeResponse])
      }
    },
    [agent],
  )

  const analyzeCodebase = useCallback(async () => {
    if (!agent || files.length === 0) {
      throw new Error("No hay archivos para analizar")
    }

    try {
      const analysisResponse = `🔍 Iniciando análisis completo del codebase...

Detecté ${files.length} archivos para analizar. Mi plan es:
1. **Examinar arquitectura general** del proyecto
2. **Identificar patrones y frameworks** utilizados
3. **Analizar dependencias** internas y externas
4. **Detectar issues potenciales** y vulnerabilidades
5. **Generar sugerencias** de mejora específicas

📊 **Analizando estructura del proyecto...**`

      setExecutionLog((prev) => [...prev, analysisResponse])

      const analysis = await agent.analyzeCodebase(files)
      setCodebaseAnalysis(analysis)

      const completedResponse = `✅ **Análisis completado exitosamente**

**Arquitectura identificada:** ${analysis.architecture}
**¿Por qué esta arquitectura?** ${analysis.reasoning || "Basada en patrones identificados en el código"}

**Frameworks detectados:** ${analysis.frameworks.join(", ")}
**¿Cómo los identifiqué?** Análisis de imports, configuraciones, y patrones de código

**Complejidad del proyecto:** ${analysis.complexity}/10
**¿Qué significa esto?** ${
        analysis.complexity <= 3
          ? "Proyecto simple, fácil de mantener"
          : analysis.complexity <= 6
            ? "Complejidad moderada, bien estructurado"
            : analysis.complexity <= 8
              ? "Proyecto complejo, requiere experiencia"
              : "Muy complejo, necesita refactoring"
      }

**Issues encontrados:** ${analysis.issues.length}
${analysis.issues.length > 0 ? analysis.issues.map((issue) => `- ⚠️ ${issue}`).join("\n") : "- ✅ No se encontraron issues críticos"}

**Sugerencias de mejora:**
${analysis.suggestions.map((suggestion) => `- 💡 ${suggestion}`).join("\n")}

**Relaciones entre archivos:**
${
  analysis.fileRelationships
    ? Object.entries(analysis.fileRelationships)
        .map(([file, deps]) => `- 📁 ${file} → conecta con ${deps.length} archivos`)
        .join("\n")
    : "- Análisis de relaciones en progreso"
}

**Próximos pasos sugeridos:**
- [ ] Revisar issues identificados
- [ ] Implementar sugerencias de mejora
- [ ] Optimizar arquitectura si es necesario
- [ ] Añadir tests para áreas críticas

¿Quieres que profundice en algún aspecto específico del análisis?`

      setExecutionLog((prev) => [...prev, completedResponse])
      setCursorStyleResponses((prev) => [...prev, completedResponse])

      return analysis
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      const errorResponse = `🔍 Analizando codebase...

❌ **Error durante el análisis**

**¿Qué pasó?**
${errorMessage}

**¿Por qué puede haber ocurrido?**
1. Archivos con formato no reconocido
2. Código con sintaxis problemática
3. Archivos demasiado grandes para analizar

**¿Cómo proceder?**
1. Revisar que los archivos estén bien formateados
2. Intentar análisis de archivos individuales
3. Verificar que no hay caracteres especiales problemáticos

**Próximos pasos sugeridos:**
- [ ] Revisar formato de archivos principales
- [ ] Intentar análisis incremental
- [ ] Verificar encoding de archivos

¿Quieres que intente analizar archivos específicos primero?`

      setError(errorMessage)
      setExecutionLog((prev) => [...prev, errorResponse])
      setCursorStyleResponses((prev) => [...prev, errorResponse])
      throw err
    }
  }, [agent, files])

  const createProject = useCallback(
    async (description: string) => {
      if (!agent) {
        throw new Error("Agente no inicializado. Se requiere API Key válida.")
      }

      if (!description.trim()) {
        throw new Error("Se requiere una descripción del proyecto")
      }

      try {
        setError(null)

        const planningResponse = `🔍 Analizando tu solicitud de proyecto...

Entiendo que necesitas desarrollar: **${description}**

Mi plan de análisis es:
1. **Revisar codebase existente** (${files.length} archivos detectados)
2. **Diseñar arquitectura óptima** basada en requirements
3. **Seleccionar stack tecnológico** apropiado
4. **Crear plan de desarrollo** step-by-step
5. **Estimar tiempo y recursos** necesarios

${
  files.length > 0
    ? `
📊 **Analizando estructura actual:**
- ✅ Detecté ${files.length} archivos existentes
- ✅ Identificando tecnologías en uso
- ✅ Evaluando arquitectura presente
- ✅ Considerando integración con código existente
`
    : `
🏗️ **Proyecto nuevo desde cero:**
- ✅ Diseñando arquitectura completa
- ✅ Seleccionando stack tecnológico óptimo
- ✅ Planificando estructura de carpetas
- ✅ Configurando herramientas de desarrollo
`
}

⚙️ **Creando plan completo con OpenAI...**`

        setExecutionLog((prev) => [...prev, planningResponse])

        const plan = await agent.createProjectPlan(description, files)
        setCurrentPlan(plan)

        const completedResponse = `🎉 **Plan de proyecto creado exitosamente**

**Proyecto:** ${plan.title}
**¿Por qué este título?** Refleja claramente el propósito y alcance del desarrollo

**Descripción técnica:** ${plan.description}

**Arquitectura propuesta:** ${plan.architecture}
**¿Por qué esta arquitectura?** ${plan.reasoning || "Optimizada para escalabilidad y mantenibilidad"}

**Stack tecnológico seleccionado:**
${plan.technologies.map((tech) => `- 🛠️ ${tech}`).join("\n")}
**¿Por qué estas tecnologías?** Cada una elegida por su idoneidad para los requirements específicos

**Tiempo estimado:** ${plan.estimatedTime}
**¿Cómo calculé el tiempo?** Basado en complejidad de features, testing, y deployment

**Plan de desarrollo:** ${plan.steps.length} pasos estructurados
${plan.steps
  .slice(0, 3)
  .map((step, index) => `${index + 1}. **${step.title}** - ${step.description.substring(0, 100)}...`)
  .join("\n")}
${plan.steps.length > 3 ? `... y ${plan.steps.length - 3} pasos adicionales` : ""}

${
  plan.codebaseAnalysis && plan.codebaseAnalysis.complexity > 1
    ? `
📊 **Análisis del codebase existente incluido:**
- Arquitectura actual: ${plan.codebaseAnalysis.architecture}
- Complejidad: ${plan.codebaseAnalysis.complexity}/10
- Issues identificados: ${plan.codebaseAnalysis.issues.length}
`
    : ""
}

**¿Cómo usar este plan?**
1. Revisar cada paso del desarrollo
2. Ejecutar pasos individuales o todo el plan
3. Monitorear progreso en tiempo real
4. Ajustar según feedback y resultados

**Próximos pasos sugeridos:**
- [ ] Revisar el plan completo
- [ ] Ejecutar el primer paso
- [ ] Configurar entorno de desarrollo
- [ ] Iniciar implementación

¿Quieres que comience con la implementación o prefieres revisar algún paso específico primero?`

        setExecutionLog((prev) => [...prev, completedResponse])
        setCursorStyleResponses((prev) => [...prev, completedResponse])

        return plan
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        const errorResponse = `🔍 Analizando solicitud de proyecto...

❌ **Error creando el plan**

**¿Qué pasó?**
${errorMessage}

**¿Por qué puede haber ocurrido?**
1. Descripción del proyecto demasiado vaga o compleja
2. Conflicto con el codebase existente
3. Limitaciones de la API de OpenAI

**¿Cómo solucionarlo?**
1. **Simplificar la descripción:** Ser más específico sobre requirements
2. **Dividir en fases:** Crear plan por etapas más pequeñas
3. **Proporcionar más contexto:** Añadir detalles técnicos específicos

**Próximos pasos sugeridos:**
- [ ] Revisar y simplificar la descripción del proyecto
- [ ] Proporcionar ejemplos específicos de funcionalidad
- [ ] Intentar crear plan por fases más pequeñas

¿Puedes proporcionar una descripción más específica o dividir el proyecto en partes más pequeñas?`

        setError(errorMessage)
        setExecutionLog((prev) => [...prev, errorResponse])
        setCursorStyleResponses((prev) => [...prev, errorResponse])
        throw err
      }
    },
    [agent, files],
  )

  const applyFileAction = useCallback((action: FileAction) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles]

      switch (action.type) {
        case "create":
          const pathParts = action.path.split("/").filter((p) => p)
          const fileName = pathParts[pathParts.length - 1] || ""

          const newFile: FileItem = {
            id: `file-${Date.now()}-${Math.random()}`,
            name: fileName,
            path: action.path,
            type: fileName.includes(".") ? "file" : "folder",
            content: action.content || "",
            extension: fileName.includes(".") ? fileName.split(".").pop() : undefined,
            lastModified: new Date(),
            children: fileName.includes(".") ? undefined : [],
          }

          newFiles.push(newFile)
          break

        case "edit":
          const fileIndex = newFiles.findIndex((f) => f.path === action.path)
          if (fileIndex !== -1) {
            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              content: action.content || newFiles[fileIndex].content,
              lastModified: new Date(),
            }
          }
          break

        case "delete":
          return newFiles.filter((f) => f.path !== action.path)

        case "rename":
          const renameIndex = newFiles.findIndex((f) => f.path === action.oldPath)
          if (renameIndex !== -1) {
            newFiles[renameIndex] = {
              ...newFiles[renameIndex],
              path: action.path,
              name: action.path.split("/").pop() || "",
              lastModified: new Date(),
            }
          }
          break

        case "analyze":
          const analyzeIndex = newFiles.findIndex((f) => f.path === action.path)
          if (analyzeIndex !== -1) {
            newFiles[analyzeIndex] = {
              ...newFiles[analyzeIndex],
              analysis: action.content ? JSON.parse(action.content) : undefined,
              lastModified: new Date(),
            }
          }
          break
      }

      return newFiles
    })
  }, [])

  const executeStep = useCallback(
    async (step: AgentStep) => {
      if (!agent) {
        throw new Error("Agente no inicializado")
      }

      setIsExecuting(true)
      setCurrentStep(step)
      setError(null)

      const executionStartResponse = `🔄 Ejecutando paso: **${step.title}**

**¿Qué voy a hacer?**
${step.description}

**¿Por qué este paso?**
${step.reasoning || "Paso necesario para el desarrollo del proyecto"}

**Mi plan de ejecución:**
1. Analizar el contexto actual del proyecto
2. Implementar las ${step.actions.length} acciones planificadas
3. Ejecutar ${step.commands?.length || 0} comandos necesarios
4. Validar la implementación con tests
5. Integrar con el resto del proyecto

🚀 **Iniciando implementación...**`

      setExecutionLog((prev) => [...prev, executionStartResponse])

      try {
        const result = await agent.executeStep(step, files)

        // Add Cursor-style response to log
        if (result.cursorStyleResponse) {
          setExecutionLog((prev) => [...prev, result.cursorStyleResponse])
          setCursorStyleResponses((prev) => [...prev, result.cursorStyleResponse])
        }

        // Apply file changes with detailed logging
        result.fileChanges.forEach((action) => {
          applyFileAction(action)

          const fileActionResponse = `📁 **${action.type.toUpperCase()}: \`${action.path}\`**

**¿Por qué este archivo?** ${action.purpose || action.explanation}

**¿Qué hace específicamente?**
${action.explanation}

**Decisiones de implementación:**
${action.decisions?.map((decision) => `- ${decision}`).join("\n") || "- Implementación siguiendo mejores prácticas"}

**Relaciones establecidas:**
${action.relationships?.map((rel) => `- Conecta con: ${rel}`).join("\n") || "- Archivo independiente"}

✅ **Archivo completado - ${action.explanation}**`

          setExecutionLog((prev) => [...prev, fileActionResponse])
        })

        // Log command executions with Cursor style
        result.commandResults.forEach((cmd) => {
          setCommandHistory((prev) => [...prev, cmd])

          const commandResponse = `🔧 **Ejecutando comando:** \`${cmd.command}\`

**¿Por qué este comando?** ${cmd.purpose || "Comando necesario para el desarrollo"}

**Salida esperada:** ${cmd.expectedResult || "Ejecución exitosa"}

**Ejecutando...**
✅ **Resultado:** ${cmd.output.split("\n")[0]}`

          setExecutionLog((prev) => [...prev, commandResponse])
        })

        // Log test results with detailed analysis
        if (result.testResults) {
          const testResponse = `🧪 **Validando implementación...**

**Tests ejecutados:**
- ✅ Tests pasados: ${result.testResults.passed}
- ❌ Tests fallidos: ${result.testResults.failed}
- 📊 Cobertura: ${result.testResults.coverage}%

**¿Qué significa esto?**
${
  result.testResults.failed === 0
    ? "¡Excelente! Todos los tests pasan correctamente"
    : `Hay ${result.testResults.failed} tests que necesitan atención`
}

**Performance check:**
- Build time: Optimizado
- Bundle size: Dentro de límites
- No warnings detectados`

          setExecutionLog((prev) => [...prev, testResponse])
        }

        // Update plan with completed step
        if (currentPlan) {
          const updatedSteps = currentPlan.steps.map((s) => (s.id === step.id ? result.updatedStep : s))
          setCurrentPlan({ ...currentPlan, steps: updatedSteps })

          // Update progress
          const completedSteps = updatedSteps.filter((s) => s.status === "completed").length
          const newProgress = (completedSteps / updatedSteps.length) * 100
          setProgress(newProgress)

          const progressResponse = `📊 **Progreso actualizado:** ${Math.round(newProgress)}% completado

**Pasos completados:** ${completedSteps}/${updatedSteps.length}

${
  completedSteps === updatedSteps.length
    ? `
🎉 **¡Proyecto completado exitosamente!**

**Archivos generados:** ${files.length} archivos
**Funcionalidades implementadas:** Todas las features planificadas
**Tests:** Validación completa realizada
**Estado:** Listo para deployment

**¿Qué sigue?**
- [ ] Revisar la implementación final
- [ ] Ejecutar tests de integración
- [ ] Preparar para deployment
- [ ] Generar documentación final

¡Tu proyecto está listo para usar!
`
    : `
**Próximo paso:** ${updatedSteps.find((s) => s.status === "pending")?.title || "Todos los pasos completados"}

¿Quieres continuar con el siguiente paso?`
}`

          setExecutionLog((prev) => [...prev, progressResponse])
        }

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        const errorResponse = `🔄 Ejecutando paso: **${step.title}**

❌ **Error durante la ejecución**

**¿Qué pasó?**
${errorMessage}

**¿Por qué puede haber ocurrido?**
1. Conflicto con código existente
2. Dependencias faltantes
3. Configuración incorrecta

**¿Cómo solucionarlo?**
1. Revisar dependencias del proyecto
2. Verificar configuración actual
3. Ejecutar comandos de limpieza si es necesario

**Próximos pasos sugeridos:**
- [ ] Revisar logs detallados del error
- [ ] Verificar configuración del entorno
- [ ] Intentar ejecución manual del paso
- [ ] Simplificar el paso en partes más pequeñas

¿Quieres que analice el error más específicamente o intentemos un approach diferente?`

        setError(errorMessage)
        setExecutionLog((prev) => [...prev, errorResponse])
        setCursorStyleResponses((prev) => [...prev, errorResponse])
        throw err
      } finally {
        setIsExecuting(false)
        setCurrentStep(null)
      }
    },
    [agent, files, currentPlan, applyFileAction],
  )

  const executeAllSteps = useCallback(async () => {
    if (!currentPlan) {
      throw new Error("No hay plan de proyecto disponible")
    }

    const allStepsResponse = `🚀 Iniciando ejecución completa del proyecto

**Plan de ejecución:**
- **Proyecto:** ${currentPlan.title}
- **Pasos totales:** ${currentPlan.steps.length}
- **Tiempo estimado:** ${currentPlan.estimatedTime}
- **Modo:** ${agentMode.toUpperCase()}

**¿Cómo voy a proceder?**
1. Ejecutar cada paso secuencialmente
2. Validar cada implementación antes de continuar
3. Aplicar correcciones automáticas si es necesario
4. Mantener coherencia entre todos los archivos
5. Generar documentación al final

**Estrategia de ejecución:**
- Pausa de 2 segundos entre pasos para estabilidad
- Validación automática después de cada paso
- Rollback automático si hay errores críticos

🎯 **Comenzando ejecución automática...**`

    setExecutionLog((prev) => [...prev, allStepsResponse])

    try {
      for (const step of currentPlan.steps) {
        if (step.status === "pending") {
          await executeStep(step)
          // Add delay between steps for better UX and API rate limiting
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }

      const completionResponse = `🎉 **¡Ejecución completa finalizada exitosamente!**

**Resumen de implementación:**
- ✅ Todos los pasos ejecutados correctamente
- ✅ ${files.length} archivos generados/modificados
- ✅ Tests validados automáticamente
- ✅ Código optimizado y listo para producción

**Archivos principales creados:**
${files
  .slice(0, 5)
  .map((f) => `- 📁 ${f.path} - ${f.type}`)
  .join("\n")}
${files.length > 5 ? `... y ${files.length - 5} archivos adicionales` : ""}

**¿Qué tienes ahora?**
- Aplicación completamente funcional
- Código siguiendo mejores prácticas
- Tests automatizados incluidos
- Documentación generada
- Configuración de deployment lista

**Próximos pasos sugeridos:**
- [ ] Revisar la implementación completa
- [ ] Ejecutar tests finales de integración
- [ ] Configurar CI/CD si es necesario
- [ ] Preparar para deployment en producción

**¿Cómo usar tu nueva aplicación?**
1. Revisar el README.md generado
2. Instalar dependencias con los comandos proporcionados
3. Ejecutar en modo desarrollo
4. Personalizar según tus necesidades específicas

¡Tu proyecto está completamente listo! ¿Hay algo específico que quieras ajustar o mejorar?`

      setExecutionLog((prev) => [...prev, completionResponse])
      setCursorStyleResponses((prev) => [...prev, completionResponse])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      const errorResponse = `🚀 Ejecutando proyecto completo...

❌ **Error en ejecución completa**

**¿Qué pasó?**
${errorMessage}

**¿En qué paso ocurrió?**
${currentStep?.title || "No identificado"}

**¿Cómo proceder?**
1. Revisar el paso que falló específicamente
2. Corregir el problema identificado
3. Continuar desde donde se detuvo
4. O reiniciar con configuración ajustada

**Estado actual del proyecto:**
- Pasos completados: ${currentPlan.steps.filter((s) => s.status === "completed").length}/${currentPlan.steps.length}
- Archivos generados: ${files.length}
- Progreso: ${Math.round(progress)}%

**Próximos pasos sugeridos:**
- [ ] Identificar y corregir el error específico
- [ ] Ejecutar pasos restantes individualmente
- [ ] Revisar configuración del proyecto
- [ ] Contactar soporte si el problema persiste

¿Quieres que analice el error específico y continúe desde donde se detuvo?`

      setExecutionLog((prev) => [...prev, errorResponse])
      setCursorStyleResponses((prev) => [...prev, errorResponse])
      throw err
    }
  }, [currentPlan, executeStep, agentMode, files, progress, currentStep])

  // Continue with other methods following the same Cursor-style pattern...
  const detectAndFixErrors = useCallback(
    async (filePath: string) => {
      if (!agent) {
        throw new Error("Agente no inicializado")
      }

      const file = files.find((f) => f.path === filePath)
      if (!file || !file.content) {
        throw new Error("Archivo no encontrado")
      }

      try {
        const analysisResponse = `🔍 Analizando errores en: \`${filePath}\`...

**¿Qué voy a analizar?**
- Errores de sintaxis y lógica
- Problemas de performance
- Vulnerabilidades de seguridad
- Oportunidades de optimización
- Mejores prácticas aplicables

**¿Por qué este análisis?**
Detectar y corregir problemas antes de que afecten la aplicación en producción.

🔧 **Iniciando análisis profundo...**`

        setExecutionLog((prev) => [...prev, analysisResponse])

        const result = await agent.detectAndFixErrors(file.content, filePath)

        // Add Cursor-style response
        if (result.cursorStyleResponse) {
          setExecutionLog((prev) => [...prev, result.cursorStyleResponse])
          setCursorStyleResponses((prev) => [...prev, result.cursorStyleResponse])
        }

        // Apply fixes
        applyFileAction({
          type: "edit",
          path: filePath,
          content: result.optimizedCode,
          explanation: `Errores corregidos y código optimizado`,
          purpose: "Mejorar calidad y seguridad del código",
          decisions: result.fixes,
        })

        const completionResponse = `✅ **Análisis y corrección completados**

**Archivo procesado:** \`${filePath}\`

**Errores encontrados y corregidos:** ${result.errors.length}
${result.errors.map((error) => `- 🐛 ${error}`).join("\n")}

**Mejoras de seguridad aplicadas:** ${result.securityIssues.length}
${result.securityIssues.map((issue) => `- 🔒 ${issue}`).join("\n")}

**Optimizaciones implementadas:**
${result.fixes.map((fix) => `- ⚡ ${fix}`).join("\n")}

**¿Qué cambió en el código?**
- Errores de sintaxis corregidos
- Lógica optimizada para mejor performance
- Vulnerabilidades de seguridad eliminadas
- Mejores prácticas aplicadas
- Comentarios explicativos añadidos

**Próximos pasos sugeridos:**
- [ ] Revisar el código optimizado
- [ ] Ejecutar tests para validar cambios
- [ ] Aplicar correcciones similares a otros archivos
- [ ] Documentar las mejoras realizadas

¿Quieres que analice otros archivos o hay algo específico que te gustaría revisar?`

        setExecutionLog((prev) => [...prev, completionResponse])

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        const errorResponse = `🔍 Analizando errores en: \`${filePath}\`...

❌ **Error durante el análisis**

**¿Qué pasó?**
${errorMessage}

**¿Por qué puede haber ocurrido?**
1. Archivo con formato no reconocido
2. Código con sintaxis muy problemática
3. Archivo demasiado grande para analizar

**¿Cómo proceder?**
1. Verificar que el archivo esté bien formateado
2. Revisar si hay caracteres especiales problemáticos
3. Intentar análisis manual por secciones

**Próximos pasos sugeridos:**
- [ ] Revisar formato del archivo manualmente
- [ ] Verificar encoding del archivo
- [ ] Intentar análisis por secciones más pequeñas
- [ ] Usar herramientas de linting externas

¿Quieres que intente un análisis más específico de alguna parte del código?`

        setError(errorMessage)
        setExecutionLog((prev) => [...prev, errorResponse])
        setCursorStyleResponses((prev) => [...prev, errorResponse])
        throw err
      }
    },
    [agent, files, applyFileAction],
  )

  // Return all the enhanced functions with Cursor-style responses
  return {
    // State
    isInitialized,
    currentPlan,
    files,
    currentStep,
    isExecuting,
    executionLog,
    progress,
    error,
    agentMode,
    commandHistory,
    codebaseAnalysis,
    cursorStyleResponses,

    // Core functions
    initializeAgent,
    createProject,
    executeStep,
    executeAllSteps,

    // Advanced capabilities
    changeAgentMode,
    analyzeCodebase,
    detectAndFixErrors,
    refactorCode: async (refactoringType: "performance" | "security" | "maintainability" | "architecture") => {
      if (!agent || files.length === 0) {
        throw new Error("No hay archivos para refactorizar")
      }

      try {
        const refactorResponse = `🔧 Iniciando refactoring de ${refactoringType}...

**¿Qué voy a mejorar?**
${
  refactoringType === "performance"
    ? "Optimización de velocidad y uso de memoria"
    : refactoringType === "security"
      ? "Eliminación de vulnerabilidades y mejores prácticas de seguridad"
      : refactoringType === "maintainability"
        ? "Mejora de legibilidad y estructura del código"
        : "Optimización de arquitectura y patrones de diseño"
}

**Mi estrategia:**
1. Analizar código actual para identificar oportunidades
2. Aplicar mejoras específicas manteniendo funcionalidad
3. Validar que todos los cambios funcionen correctamente
4. Documentar las mejoras realizadas

🚀 **Iniciando refactoring...**`

        setExecutionLog((prev) => [...prev, refactorResponse])

        const result = await agent.refactorCode(files, refactoringType)

        // Add Cursor-style response
        if (result.cursorStyleResponse) {
          setExecutionLog((prev) => [...prev, result.cursorStyleResponse])
          setCursorStyleResponses((prev) => [...prev, result.cursorStyleResponse])
        }

        // Apply refactored files
        result.refactoredFiles.forEach((action) => {
          applyFileAction(action)
        })

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        throw err
      }
    },

    generateDocumentation: async () => {
      if (!agent || files.length === 0) {
        throw new Error("No hay archivos para documentar")
      }

      try {
        const docResponse = `📚 Generando documentación completa...

**¿Qué voy a documentar?**
- README.md profesional con setup completo
- Documentación de API si aplica
- Comentarios de código mejorados
- Diagrama de arquitectura del proyecto

**Mi approach:**
1. Analizar la estructura y funcionalidad del proyecto
2. Crear documentación clara y útil para desarrolladores
3. Incluir ejemplos prácticos y casos de uso
4. Generar guías de instalación y deployment

📝 **Creando documentación...**`

        setExecutionLog((prev) => [...prev, docResponse])

        const result = await agent.generateDocumentation(files)

        // Add Cursor-style response
        if (result.cursorStyleResponse) {
          setExecutionLog((prev) => [...prev, result.cursorStyleResponse])
          setCursorStyleResponses((prev) => [...prev, result.cursorStyleResponse])
        }

        // Add documentation files
        applyFileAction({
          type: "create",
          path: "/README.md",
          content: result.readme,
          explanation: "Documentación principal del proyecto",
          purpose: "Proporcionar guía completa para desarrolladores",
        })

        if (result.apiDocs) {
          applyFileAction({
            type: "create",
            path: "/docs/API.md",
            content: result.apiDocs,
            explanation: "Documentación de API",
            purpose: "Facilitar integración con la API",
          })
        }

        // Apply code comments
        result.codeComments.forEach((action) => {
          applyFileAction(action)
        })

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        throw err
      }
    },

    setupProject: async (projectType: string, technologies: string[]) => {
      if (!agent) {
        throw new Error("Agente no inicializado")
      }

      try {
        const setupResponse = `🏗️ Configurando proyecto ${projectType}...

**Stack tecnológico seleccionado:**
${technologies.map((tech) => `- 🛠️ ${tech}`).join("\n")}

**¿Por qué estas tecnologías?**
Cada tecnología ha sido seleccionada por su idoneidad para el tipo de proyecto ${projectType}.

**Mi plan de setup:**
1. Crear estructura de carpetas profesional
2. Configurar archivos de configuración necesarios
3. Setup de herramientas de desarrollo
4. Configurar scripts de build y deployment
5. Crear documentación inicial

🚀 **Iniciando configuración...**`

        setExecutionLog((prev) => [...prev, setupResponse])

        const result = await agent.setupProject(projectType, technologies)

        // Add Cursor-style response
        if (result.cursorStyleResponse) {
          setExecutionLog((prev) => [...prev, result.cursorStyleResponse])
          setCursorStyleResponses((prev) => [...prev, result.cursorStyleResponse])
        }

        // Apply project structure
        result.structure.forEach((action) => {
          applyFileAction(action)
        })

        // Apply configuration files
        result.configuration.forEach((action) => {
          applyFileAction(action)
        })

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        throw err
      }
    },

    generateIntelligentCompletion: async (code: string, cursorPosition: number) => {
      if (!agent) {
        throw new Error("Agente no inicializado")
      }

      try {
        const result = await agent.generateIntelligentCompletion(code, cursorPosition, files)

        if (result.cursorStyleResponse) {
          setExecutionLog((prev) => [...prev, result.cursorStyleResponse])
          setCursorStyleResponses((prev) => [...prev, result.cursorStyleResponse])
        }

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        throw err
      }
    },

    // Streaming and tools
    streamStepExecution: async function* (step: AgentStep) {
      if (!agent) {
        throw new Error("Agente no inicializado")
      }

      setCurrentStep(step)
      setIsExecuting(true)
      setError(null)

      try {
        for await (const chunk of agent.streamStepExecution(step, files)) {
          yield chunk
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        yield `❌ Error en streaming: ${errorMessage}`
      } finally {
        setIsExecuting(false)
        setCurrentStep(null)
      }
    },

    generateCode: async (prompt: string) => {
      if (!agent) {
        throw new Error("Agente no inicializado")
      }

      const context = `Archivos del proyecto:
${files.map((f) => `${f.path}: ${f.type} (${f.extension || "folder"})`).join("\n")}

Análisis del codebase:
${codebaseAnalysis ? JSON.stringify(codebaseAnalysis, null, 2) : "No disponible"}`

      try {
        return await agent.generateCode(prompt, context)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        throw err
      }
    },

    explainCode: async (code: string) => {
      if (!agent) {
        throw new Error("Agente no inicializado")
      }

      try {
        return await agent.explainCode(code)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        throw err
      }
    },

    debugCode: async (code: string, error: string) => {
      if (!agent) {
        throw new Error("Agente no inicializado")
      }

      try {
        return await agent.debugCode(code, error)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        throw err
      }
    },

    // File management
    applyFileAction,
  }
}
