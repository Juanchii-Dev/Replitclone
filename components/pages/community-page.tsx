"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, MessageCircle, Heart, Share, Eye, Calendar, TrendingUp } from "lucide-react"

export function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState<"trending" | "recent" | "following">("trending")

  const posts = [
    {
      id: 1,
      author: {
        name: "María García",
        username: "@maria_dev",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      title: "Cómo construí una app de chat en tiempo real con Socket.io",
      content:
        "Acabo de terminar mi proyecto de chat en tiempo real. Fue un desafío interesante trabajar con WebSockets...",
      tags: ["javascript", "socket.io", "react"],
      likes: 42,
      comments: 8,
      views: 156,
      timeAgo: "hace 2 horas",
      trending: true,
    },
    {
      id: 2,
      author: {
        name: "Carlos Ruiz",
        username: "@carlos_code",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      title: "Mi experiencia migrando de JavaScript a TypeScript",
      content: "Después de 6 meses usando TypeScript en producción, aquí están mis conclusiones...",
      tags: ["typescript", "javascript", "migration"],
      likes: 28,
      comments: 12,
      views: 89,
      timeAgo: "hace 4 horas",
      trending: false,
    },
    {
      id: 3,
      author: {
        name: "Ana López",
        username: "@ana_frontend",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      title: "Tutorial: Animaciones CSS que impresionan",
      content: "Las animaciones pueden hacer la diferencia en tu sitio web. Te muestro mis favoritas...",
      tags: ["css", "animations", "frontend"],
      likes: 67,
      comments: 15,
      views: 234,
      timeAgo: "hace 1 día",
      trending: true,
    },
    {
      id: 4,
      author: {
        name: "Diego Martín",
        username: "@diego_backend",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      title: "Optimizando APIs con Redis Cache",
      content: "Cómo mejoré el rendimiento de mi API en un 300% usando Redis como cache...",
      tags: ["redis", "api", "performance"],
      likes: 35,
      comments: 6,
      views: 112,
      timeAgo: "hace 2 días",
      trending: false,
    },
  ]

  const trendingTopics = [
    { name: "React 18", posts: 45 },
    { name: "TypeScript", posts: 32 },
    { name: "Next.js", posts: 28 },
    { name: "Node.js", posts: 24 },
    { name: "Python", posts: 19 },
  ]

  const suggestedUsers = [
    {
      name: "Elena Vega",
      username: "@elena_ui",
      bio: "UI/UX Designer & Frontend Developer",
      followers: 1200,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Roberto Silva",
      username: "@roberto_data",
      bio: "Data Scientist & ML Engineer",
      followers: 890,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Lucía Torres",
      username: "@lucia_mobile",
      bio: "Mobile App Developer (React Native)",
      followers: 756,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (selectedTab === "trending") {
      return matchesSearch && post.trending
    }
    return matchesSearch
  })

  return (
    <div className="flex-1 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-[46px] border-b border-[#1c2333] flex items-center px-4 justify-between">
          <span className="text-sm font-medium">Comunidad</span>
          <Button variant="outline" className="bg-[#6c63ff] hover:bg-[#5a52d3] text-white border-none h-8 px-4">
            Crear Post
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar posts, usuarios, temas..."
                className="bg-[#1c2333] border-[#343a4a] text-white pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-[#1c2333] p-1 rounded-md">
              <Button
                variant={selectedTab === "trending" ? "default" : "ghost"}
                className={`flex-1 h-8 ${
                  selectedTab === "trending"
                    ? "bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                    : "text-gray-300 hover:bg-[#343a4a]"
                }`}
                onClick={() => setSelectedTab("trending")}
              >
                <TrendingUp size={14} className="mr-2" />
                Trending
              </Button>
              <Button
                variant={selectedTab === "recent" ? "default" : "ghost"}
                className={`flex-1 h-8 ${
                  selectedTab === "recent"
                    ? "bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                    : "text-gray-300 hover:bg-[#343a4a]"
                }`}
                onClick={() => setSelectedTab("recent")}
              >
                <Calendar size={14} className="mr-2" />
                Recientes
              </Button>
              <Button
                variant={selectedTab === "following" ? "default" : "ghost"}
                className={`flex-1 h-8 ${
                  selectedTab === "following"
                    ? "bg-[#6c63ff] hover:bg-[#5a52d3] text-white"
                    : "text-gray-300 hover:bg-[#343a4a]"
                }`}
                onClick={() => setSelectedTab("following")}
              >
                <Users size={14} className="mr-2" />
                Siguiendo
              </Button>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-[#1c2333] border-[#2b3245] hover:border-[#6c63ff] cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-white">{post.author.name}</span>
                          <span className="text-sm text-gray-400">{post.author.username}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{post.timeAgo}</span>
                          {post.trending && (
                            <Badge className="bg-orange-600 text-white">
                              <TrendingUp size={12} className="mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-white mb-2">{post.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">{post.content}</p>
                        <div className="flex items-center space-x-2 mb-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-[#343a4a] text-gray-300">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 p-0">
                              <Heart size={16} className="mr-1" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 p-0">
                              <MessageCircle size={16} className="mr-1" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 p-0">
                              <Share size={16} className="mr-1" />
                              Compartir
                            </Button>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Eye size={12} className="mr-1" />
                            {post.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No se encontraron posts</h3>
                <p className="text-gray-400">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-[#1c2333] bg-[#151c2b] overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Trending Topics */}
          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#6c63ff]" />
                Temas Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={topic.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">#{topic.name}</p>
                    <p className="text-xs text-gray-400">{topic.posts} posts</p>
                  </div>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggested Users */}
          <Card className="bg-[#1c2333] border-[#2b3245]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#6c63ff]" />
                Usuarios Sugeridos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedUsers.map((user) => (
                <div key={user.username} className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.username}</p>
                    <p className="text-xs text-gray-500 mt-1">{user.bio}</p>
                    <p className="text-xs text-gray-500">{user.followers} seguidores</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent border-[#6c63ff] text-[#6c63ff] hover:bg-[#6c63ff] hover:text-white h-6 text-xs"
                    >
                      Seguir
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
