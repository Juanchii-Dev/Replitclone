"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Save, Settings } from "lucide-react"

export default function ReplPage({ params }: { params: { id: string } }) {
  const [code, setCode] = useState(`# Python Example
print("Hello, Replit!")

# Define a function
def greet(name):
    return f"Hello, {name}!"

# Call the function
message = greet("User")
print(message)

# Simple loop
for i in range(5):
    print(f"Count: {i}")
`)

  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = () => {
    setIsRunning(true)
    setOutput("")

    // Simulate code execution
    setTimeout(() => {
      setOutput(`Hello, Replit!
Hello, User!
Count: 0
Count: 1
Count: 2
Count: 3
Count: 4
`)
      setIsRunning(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-medium">Python Project</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-1">
            <Save className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-1">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <textarea
            className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 focus:outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* Output Console */}
        <div className="h-1/3 bg-black text-white p-4 font-mono text-sm overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400">Console</div>
            {isRunning && <div className="text-green-400 text-xs">Running...</div>}
          </div>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </div>

      {/* Run Button */}
      <div className="bg-gray-900 p-3 flex justify-center">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="bg-green-600 text-white px-6 py-2 rounded-md flex items-center disabled:bg-green-800"
        >
          <Play className="w-4 h-4 mr-2" />
          Run
        </button>
      </div>
    </div>
  )
}
