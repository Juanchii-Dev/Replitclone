import Link from "next/link"
import { Code, Home, Search, User } from "lucide-react"

export default function ExplorePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
            &gt;_
          </div>
          <h1 className="ml-2 font-bold text-lg">Explore</h1>
        </div>
        <button className="p-2">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Featured Templates</h2>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg border overflow-hidden">
                <div className={`h-24 ${template.color} flex items-center justify-center`}>
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{template.language}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Popular Projects</h2>
          <div className="grid gap-4">
            {popularProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${project.color}`}>
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{project.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{project.author}</span>
                      <span className="mx-1">•</span>
                      <span>{project.stars} stars</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t grid grid-cols-3 py-2">
        <Link href="/" className="flex flex-col items-center text-gray-500">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/explore" className="flex flex-col items-center text-blue-600">
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-gray-500">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  )
}

const templates = [
  {
    id: "1",
    name: "Python Flask",
    language: "Python",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "React App",
    language: "JavaScript",
    color: "bg-yellow-500",
  },
  {
    id: "3",
    name: "HTML Starter",
    language: "HTML/CSS",
    color: "bg-orange-500",
  },
  {
    id: "4",
    name: "Node.js API",
    language: "JavaScript",
    color: "bg-green-500",
  },
]

const popularProjects = [
  {
    id: "1",
    name: "AI Chat Bot",
    author: "@techguru",
    stars: 1245,
    description: "A simple AI chatbot built with Python and TensorFlow",
    color: "bg-purple-500",
  },
  {
    id: "2",
    name: "Weather Dashboard",
    author: "@webdev",
    stars: 876,
    description: "Real-time weather dashboard using React and OpenWeather API",
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "Snake Game",
    author: "@gamecoder",
    stars: 543,
    description: "Classic snake game built with JavaScript and HTML Canvas",
    color: "bg-green-500",
  },
]
