import Link from "next/link"
import { Code, Home, Search, Settings, User } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
            &gt;_
          </div>
          <h1 className="ml-2 font-bold text-lg">Profile</h1>
        </div>
        <button className="p-2">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Profile Header */}
        <div className="bg-white p-6 flex flex-col items-center border-b">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="mt-3 text-xl font-bold">User123</h2>
          <p className="text-gray-500">@user123</p>
          <p className="mt-2 text-sm text-center text-gray-600">Coding enthusiast | Python & JavaScript developer</p>
          <div className="mt-4 flex space-x-6">
            <div className="text-center">
              <div className="font-bold">42</div>
              <div className="text-xs text-gray-500">Repls</div>
            </div>
            <div className="text-center">
              <div className="font-bold">128</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold">56</div>
              <div className="text-xs text-gray-500">Following</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="flex">
            <button className="flex-1 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">My Repls</button>
            <button className="flex-1 py-3 text-gray-500">Liked</button>
          </div>
        </div>

        {/* Projects List */}
        <div className="p-4">
          <div className="grid gap-4">
            {userProjects.map((project) => (
              <Link
                key={project.id}
                href={`/repl/${project.id}`}
                className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${project.color}`}>
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.language}</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">Last edited {project.lastEdited}</div>
              </Link>
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
        <Link href="/explore" className="flex flex-col items-center text-gray-500">
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-blue-600">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  )
}

const userProjects = [
  {
    id: "1",
    name: "Personal Blog",
    language: "HTML/CSS/JS",
    lastEdited: "1 hour ago",
    color: "bg-orange-500",
  },
  {
    id: "2",
    name: "Data Analysis",
    language: "Python",
    lastEdited: "yesterday",
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "Todo App",
    language: "React",
    lastEdited: "3 days ago",
    color: "bg-yellow-500",
  },
  {
    id: "4",
    name: "API Project",
    language: "Node.js",
    lastEdited: "last week",
    color: "bg-green-500",
  },
]
