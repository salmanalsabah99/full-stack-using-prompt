import React from 'react'

const mockProjects = [
  { name: "Calendar Redesign", progress: 70, status: "On Track" },
  { name: "Task Refactor", progress: 45, status: "Pending" },
  { name: "AI Roadmap Inference", progress: 20, status: "Blocked" },
]

export default function OrbitPriorityCard() {
  return (
    <div className="bg-red-50 rounded-xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] transition-all duration-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h2 className="text-lg font-semibold text-gray-900">Orbit Priority</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">Roadmaps generated by AI</p>
      
      {mockProjects.length === 0 ? (
        <p className="text-gray-500 text-sm">No active projects detected.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockProjects.map((project, idx) => (
            <div key={idx} className="p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {project.name}
                </h3>
                <span className="text-sm font-medium text-red-600">
                  {project.progress}%
                </span>
              </div>
              <div className="w-full bg-red-100 rounded-full h-2 mb-2">
                <div
                  className="bg-red-400 h-2 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${
                project.status === "On Track" ? "text-green-600" :
                project.status === "Pending" ? "text-yellow-600" :
                "text-red-600"
              }`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 