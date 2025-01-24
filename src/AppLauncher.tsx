import React from 'react';
import { useState } from "react"
import { motion } from "framer-motion"
import { AppWindow, Mail, Calendar, Settings, Music, Video, Image, FileText } from "lucide-react"

interface App {
  name: string
  icon: React.ReactNode
  color: string
}

const apps: App[] = [
  { name: "Mail", icon: <Mail size={24} />, color: "bg-blue-500" },
  { name: "Calendar", icon: <Calendar size={24} />, color: "bg-green-500" },
  { name: "Settings", icon: <Settings size={24} />, color: "bg-gray-500" },
  { name: "Music", icon: <Music size={24} />, color: "bg-purple-500" },
  { name: "Video", icon: <Video size={24} />, color: "bg-red-500" },
  { name: "Photos", icon: <Image size={24} />, color: "bg-yellow-500" },
  { name: "Documents", icon: <FileText size={24} />, color: "bg-indigo-500" },
  { name: "Apps", icon: <AppWindow size={24} />, color: "bg-pink-500" },
]

const AppLauncher = () => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8 select-none">App Launcher</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 min-h-[50vh]">
        {apps.map((app) => (
          <motion.div
            key={app.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedApp(app.name)}
            className={`${app.color} rounded-lg p-4 cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg`}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-white mb-2">{app.icon}</div>
              <span className="text-white text-sm font-medium select-none">{app.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedApp && <div className="mt-8 text-center text-white text-lg font-semibold">Launching: {selectedApp}</div>}
    </div>
  )
};

export default AppLauncher;