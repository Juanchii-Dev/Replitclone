"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FileText,
  FileCode,
  FilePlus,
  FolderPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  Copy,
} from "lucide-react"
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

export function FilesPage() {
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
            { id: "3", name: "Button.jsx", type: "file", extension: "jsx" },
            { id: "4", name: "Card.jsx", type: "file", extension: "jsx" },
          ],
        },
        { id: "5", name: "App.js", type: "file", extension: "js" },
        { id: "6", name: "index.js", type: "file", extension: "js" },
      ],
    },
    {
      id: "7",
      name: "public",
      type: "folder",
      expanded: false,
      children: [
        { id: "8", name: "index.html", type: "file", extension: "html" },
        { id: "9", name: "favicon.ico", type: "file", extension: "ico" },
      ],
    },
    { id: "10", name: "package.json", type: "file", extension: "json" },
    { id: "11", name: "README.md", type: "file", extension: "md" },
  ])

  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
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
    toast({
      title: "Archivo seleccionado",
      description: "Archivo abierto en el editor",
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
    return items
      .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((item) => (
        <div key={item.id} style={{ paddingLeft: `${level * 16}px` }}>
          <div
            className={`flex items-center py-1 px-2 rounded-md ${
              selectedFile === item.id ? "bg-[#1c2333]" : "hover:bg-[#1c2333]"
            } group`}
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
                  <DropdownMenuItem className="flex items-center cursor-pointer">
                    <Copy size={14} className="mr-2" />
                    <span>Duplicar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer">
                    <Edit size={14} className="mr-2" />
                    <span>Renombrar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer text-red-400 focus:text-red-400">
                    <Trash size={14} className="mr-2" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
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
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-[46px] border-b border-[#1c2333] flex items-center px-4 justify-between">
        <span className="text-sm font-medium">Explorador de Archivos</span>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-400 hover:text-white">
            <FilePlus size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-400 hover:text-white ml-1">
            <FolderPlus size={16} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-[#1c2333]">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2.5 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar archivos..."
            className="bg-[#1c2333] border-[#343a4a] text-white pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">{renderFileTree(files)}</div>
    </div>
  )
}
