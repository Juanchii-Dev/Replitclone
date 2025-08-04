"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save, Play, RefreshCw } from "lucide-react"

export function MultiFileEditor() {
  const [files, setFiles] = useState([
    {
      name: "index.js",
      content: `import express from 'express';
import { router } from './routes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
      language: "javascript",
    },
    {
      name: "routes.js",
      content: `import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from './controllers/userController';
import { authMiddleware } from './middleware/auth';

export const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, getUserById);
router.post('/users', authMiddleware, createUser);
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);`,
      language: "javascript",
    },
    {
      name: "userController.js",
      content: `import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    
    await user.save();
    
    res.status(201).json({ user: { id: user._id, name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    await user.save();
    
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.remove();
    
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};`,
      language: "javascript",
    },
  ])

  const [activeFile, setActiveFile] = useState("index.js")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const handleContentChange = (content: string) => {
    setFiles(files.map((file) => (file.name === activeFile ? { ...file, content } : file)))
  }

  const handleRun = () => {
    setIsRunning(true)
    setOutput("Iniciando servidor...\n")

    // Simular ejecución
    setTimeout(() => {
      setOutput((prev) => prev + "Compilando...\n")

      setTimeout(() => {
        setOutput((prev) => prev + "Servidor iniciado en puerto 3000\n")
        setIsRunning(false)
      }, 1000)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-[#0e1525] text-white">
      <div className="flex items-center justify-between p-2 border-b border-[#1c2333]">
        <h3 className="text-sm font-medium">Editor de múltiples archivos</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-transparent border-[#2b3245] text-white hover:bg-[#2b3245]"
          >
            <Save size={14} className="mr-1" />
            Guardar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white border-none"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? <RefreshCw size={14} className="mr-1 animate-spin" /> : <Play size={14} className="mr-1" />}
            Ejecutar
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Tabs
          defaultValue={activeFile}
          value={activeFile}
          onValueChange={setActiveFile}
          className="flex-1 flex flex-col"
        >
          <div className="border-b border-[#1c2333] overflow-x-auto">
            <TabsList className="bg-transparent h-10">
              {files.map((file) => (
                <TabsTrigger
                  key={file.name}
                  value={file.name}
                  className="data-[state=active]:bg-[#1c2333] data-[state=active]:shadow-none rounded-none border-r border-[#1c2333] px-4"
                >
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {files.map((file) => (
            <TabsContent key={file.name} value={file.name} className="flex-1 p-0 mt-0">
              <div className="h-full overflow-auto bg-[#0e1525] p-4">
                <pre className="font-mono text-sm">
                  <code>{file.content}</code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="h-1/3 min-h-[150px] border-t border-[#1c2333]">
          <div className="flex items-center justify-between p-2 bg-[#1c2333]">
            <span className="text-xs font-medium">Consola</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-400 hover:text-white"
              onClick={() => setOutput("")}
            >
              Limpiar
            </Button>
          </div>
          <div className="h-[calc(100%-32px)] overflow-auto p-2 bg-black font-mono text-xs">
            <pre className="text-gray-300">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
