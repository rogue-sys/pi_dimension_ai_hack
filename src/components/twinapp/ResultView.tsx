'use client'
import React, { useState } from 'react'
import { Send } from 'lucide-react'

export default function ResultView({ profile }: { profile: any }) {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState(profile.chatLog || [])

  const handleSend = () => {
    if (!message.trim()) return

    const newEntry = {
      role: 'user',
      text: message,
      ts: new Date().toISOString()
    }

    setChat([...chat, newEntry])
    setMessage('')
    // You can later hook this into /api/chat route
  }

  return (
    <div className="space-y-6">
      
      {/* TOP SECTION — PORTRAIT + INFO */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Portrait Card */}
        <div className="bg-gray-900/90 p-6 rounded-2xl">
          <img 
            src={profile.portrait} 
            alt="portrait" 
            className="w-full rounded" 
          />
          <h3 className="mt-4 text-xl">{profile.name}</h3>
          <p className="text-sm text-gray-400">{profile.archetype}</p>
        </div>

        {/* Backstory / Stats */}
        <div className="md:col-span-2 bg-gray-900/90 p-6 rounded-2xl space-y-4">
          <div>
            <h4 className="text-lg font-semibold">Backstory</h4>
            <p className="text-gray-300 whitespace-pre-line">
              {profile.backstory}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Location & Stats</h4>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {profile.locationStats}
            </pre>
          </div>
        </div>

      </div>

      {/* CHAT SECTION */}
      <div className="bg-gray-900/90 p-6 rounded-2xl">
        <h4 className="text-lg font-semibold mb-3">Chat with Your Doppelgänger</h4>

        {/* Chat messages */}
        <div className="h-64 overflow-y-auto bg-black/20 p-4 rounded-xl space-y-3 border border-gray-700">
          {chat.length === 0 && (
            <p className="text-gray-500 text-center">
              Start the conversation…
            </p>
          )}

          {chat.map((c: any, i: number) => (
            <div 
              key={i}
              className={`p-3 rounded-xl max-w-[80%] ${
                c.role === 'user'
                  ? 'bg-purple-700/60 ml-auto'
                  : 'bg-gray-700/60'
              }`}
            >
              <p className="text-sm text-gray-200 whitespace-pre-wrap">
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <div className="mt-4 flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something..."
            className="flex-1 p-3 rounded-xl bg-black/40 border border-gray-700 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-xl flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>

    </div>
  )
}
