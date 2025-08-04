"use client"

import { useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FileText,
  FileCode,
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  Edit,
  Trash,
  Copy,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

type FileItem = {
  id: string
  name: string
  type: "file" | "folder"
  extension?: string
  children?: FileItem[]
  content?: string
  expanded?: boolean
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "src",
      type: "folder",
      expanded: true,
      children: [
        {
          id: "2",
          name: "components",
          type: "folder",
          expanded: false,
          children: [
            { id: "3", name: "Button.jsx", type: "file", extension: "jsx", content: "// Button component" },
            { id: "4", name: "Card.jsx", type: "file", extension: "jsx", content: "// Card component" },
          ],
        },
        { id: "5", name: "App.js", type: "file", extension: "js", content: "// Main App file" },
        { id: "6", name: "index.js", type: "file", extension: "js", content: "// Entry point" },
      ],
    },
    {
      id: "7",
      name: "public",
      type: "folder",
      expanded: false,
      children: [
        { id: "8", name: "index.html", type: "file", extension: "html", content: "<!DOCTYPE html>..." },
        { id: "9", name: "favicon.ico", type: "file", extension: "ico" },
      ],
    },
    {
      id: "10",
      name: "package.json",
      type: "file",
      extension: "json",
      content: '{\n  "name": "project",\n  "version": "1.0.0"\n}',
    },
    { id: "11", name: "README.md", type: "file", extension: "md", content: "# Project\n\nThis is a project readme." },
  ])

  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [parentFolderId, setParentFolderId] = useState<string | null>(null)
  const { toast } = useToast()

  const toggleFolder = (id: string) => {
    setFiles((prevFiles) => {
      const updateFiles = (items: FileItem[]): FileItem[] => {
        return items.map((item) => {
          if (item.id === id) {
            return { ...item, expanded: !item.expanded }
          }
          if (item.children) {
            return { ...item, children: updateFiles(item.children) }
          }
          return item
        })
      }
      return updateFiles(prevFiles)
    })
  }

  const selectFile = (id: string) => {
    setSelectedFile(id)

    // Find file content and show toast
    const findFile = (items: FileItem[]): FileItem | undefined => {
      for (const item of items) {
        if (item.id === id) return item
        if (item.children) {
          const found = findFile(item.children)
          if (found) return found
        }
      }
      return undefined
    }

    const flattenFiles = (items: FileItem[]): FileItem[] => {
      return items.reduce((acc: FileItem[], item) => {
        acc.push(item)
        if (item.children) {
          acc.push(...flattenFiles(item.children))
        }
        return acc
      }, [])
    }

    const allFiles = flattenFiles(files)
    const file = allFiles.find((f) => f.id === id)

    if (file && file.type === "file") {
      toast({
        title: `Abriendo ${file.name}`,
        description: "Archivo cargado en el editor",
      })
    }
  }

  const startCreatingFile = (parentId: string | null) => {
    setIsCreatingFile(true)
    setIsCreatingFolder(false)
    setNewItemName("")
    setParentFolderId(parentId)
  }

  const startCreatingFolder = (parentId: string | null) => {
    setIsCreatingFolder(true)
    setIsCreatingFile(false)
    setNewItemName("")
    setParentFolderId(parentId)
  }

  const createNewItem = () => {
    if (!newItemName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa un nombre para el nuevo elemento",
        variant: "destructive",
      })
      return
    }

    const newId = `new-${Date.now()}`
    const newItem: FileItem = isCreatingFile
      ? {
          id: newId,
          name: newItemName.includes(".") ? newItemName : `${newItemName}.js`,
          type: "file",
          extension: newItemName.split(".").pop() || "js",
          content: "",
        }
      : {
          id: newId,
          name: newItemName,
          type: "folder",
          expanded: true,
          children: [],
        }

    setFiles((prevFiles) => {
      const updateFiles = (items: FileItem[]): FileItem[] => {
        if (!parentFolderId) {
          return [...items, newItem]
        }

        return items.map((item) => {
          if (item.id === parentFolderId) {
            return {
              ...item,
              expanded: true,
              children: [...(item.children || []), newItem],
            }
          }
          if (item.children) {
            return { ...item, children: updateFiles(item.children) }
          }
          return item
        })
      }

      return updateFiles(prevFiles)
    })

    setIsCreatingFile(false)
    setIsCreatingFolder(false)
    setNewItemName("")

    toast({
      title: isCreatingFile ? "Archivo creado" : "Carpeta creada",
      description: `${isCreatingFile ? "Archivo" : "Carpeta"} "${newItemName}" creado exitosamente`,
    })
  }

  const deleteItem = (id: string) => {
    setFiles((prevFiles) => {
      const updateFiles = (items: FileItem[]): FileItem[] => {
        return items.filter((item) => {
          if (item.id === id) {
            return false
          }
          if (item.children) {
            item.children = updateFiles(item.children)
          }
          return true
        })
      }

      return updateFiles(prevFiles)
    })

    if (selectedFile === id) {
      setSelectedFile(null)
    }

    toast({
      title: "Elemento eliminado",
      description: "El elemento ha sido eliminado exitosamente",
    })
  }

  const duplicateItem = (id: string) => {
    setFiles((prevFiles) => {
      const findAndDuplicate = (items: FileItem[]): FileItem[] => {
        return items.flatMap((item) => {
          if (item.id === id) {
            const newId = `dup-${Date.now()}`
            const duplicatedItem = {
              ...item,
              id: newId,
              name: `${item.name.split(".")[0]} (copy)${item.extension ? `.${item.extension}` : ""}`,
              children: item.children ? [...item.children] : undefined,
            }
            return [item, duplicatedItem]
          }
          if (item.children) {
            const newChildren = findAndDuplicate(item.children).flat()
            if (newChildren.length !== item.children.length) {
              return { ...item, children: newChildren }
            }
          }
          return item
        })
      }

      return findAndDuplicate(prevFiles)
    })

    toast({
      title: "Elemento duplicado",
      description: "El elemento ha sido duplicado exitosamente",
    })
  }

  const renderFileIcon = (extension?: string) => {
    switch (extension) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <FileCode size={16} className="text-yellow-400" />
      case "md":
        return <FileText size={16} className="text-blue-400" />
      case "json":
        return <FileText size={16} className="text-green-400" />
      case "html":
        return <FileCode size={16} className="text-orange-400" />
      case "css":
        return <FileCode size={16} className="text-purple-400" />
      default:
        return <File size={16} className="text-gray-400" />
    }
  }

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center py-1 px-2 rounded-md ${selectedFile === item.id ? "bg-[#1c2333]" : "hover:bg-[#1c2333]"} group`}
        >
          {item.type === "folder" ? (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto mr-1 text-gray-400"
              onClick={() => toggleFolder(item.id)}
            >
              {item.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
          ) : (
            <span className="w-5"></span>
          )}

          <div
            className="flex items-center flex-1 cursor-pointer"
            onClick={() => (item.type === "folder" ? toggleFolder(item.id) : selectFile(item.id))}
          >
            {item.type === "folder" ? (
              <Folder size={16} className="text-gray-400 mr-2" />
            ) : (
              <span className="mr-2">{renderFileIcon(item.extension)}</span>
            )}
            <span className="text-sm text-gray-300">{item.name}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-400 hover:text-white">
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1c2333] border-[#343a4a] text-white">
                {item.type === "folder" && (
                  <>
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer"
                      onClick={() => startCreatingFile(item.id)}
                    >
                      <FilePlus size={14} className="mr-2" />
                      <span>Nuevo archivo</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer"
                      onClick={() => startCreatingFolder(item.id)}
                    >
                      <FolderPlus size={14} className="mr-2" />
                      <span>Nueva carpeta</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => duplicateItem(item.id)}>
                  <Copy size={14} className="mr-2" />
                  <span>Duplicar</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center cursor-pointer">
                  <Edit size={14} className="mr-2" />
                  <span>Renombrar</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center cursor-pointer text-red-400 focus:text-red-400"
                  onClick={() => deleteItem(item.id)}
                >
                  <Trash size={14} className="mr-2" />
                  <span>Eliminar</span>
                </DropdownMenuItem>
                {item.type === "file" && (
                  <DropdownMenuItem className="flex items-center cursor-pointer">
                    <Download size={14} className="mr-2" />
                    <span>Descargar</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {item.type === "folder" && item.expanded && item.children && (
          <div>{renderFileTree(item.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="h-full bg-[#0e1525] text-white flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-[#1c2333]">
        <span className="text-sm font-medium">Explorador</span>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-gray-400 hover:text-white"
            onClick={() => startCreatingFile(null)}
          >
            <FilePlus size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-gray-400 hover:text-white ml-1"
            onClick={() => startCreatingFolder(null)}
          >
            <FolderPlus size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {renderFileTree(files)}

        {(isCreatingFile || isCreatingFolder) && (
          <div className="mt-2 px-2">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder={isCreatingFile ? "Nombre del archivo" : "Nombre de la carpeta"}
                className="flex-1 bg-[#1c2333] border-[#343a4a] text-white text-sm h-8"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    createNewItem()
                  } else if (e.key === "Escape") {
                    setIsCreatingFile(false)
                    setIsCreatingFolder(false)
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 text-green-500 hover:text-green-400 p-1 h-8"
                onClick={createNewItem}
              >
                ✓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-400 p-1 h-8"
                onClick={() => {
                  setIsCreatingFile(false)
                  setIsCreatingFolder(false)
                }}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
