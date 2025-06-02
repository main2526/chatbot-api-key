"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || "No response" }])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to the API" }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex py-4 items-center justify-between w-full">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">BootsDev</h1>
            <h1 className="text-xl font-semibold text-red-600">-X </h1>
            <h1 className="text-xl font-semibold text-gray-900 ml-2">AI</h1>
          </div>
          <a
            href="https://www.youtube.com/@BootsDev-X"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 animate-pulse"
            title="Follow me on YouTube!"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.1 5.5 12 5.5 12 5.5s-6.1 0-7.86.56A2.75 2.75 0 0 0 2.2 8.001 28.6 28.6 0 0 0 1.5 12a28.6 28.6 0 0 0 .7 3.999 2.75 2.75 0 0 0 1.94 1.94C5.9 18.5 12 18.5 12 18.5s6.1 0 7.86-.56a2.75 2.75 0 0 0 1.94-1.94A28.6 28.6 0 0 0 22.5 12a28.6 28.6 0 0 0-.7-3.999ZM10 15.5v-7l6 3.5-6 3.5Z" />
            </svg>
            YouTube
          </a>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-4">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">How can I help you today?</h2>
                <p className="text-gray-600 max-w-md">
                  I'm BootsDev-X AI, your intelligent assistant. You can ask me anything.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`border-b border-gray-100 ${message.role === "assistant" ? "bg-gray-50" : "bg-white"}`}
                >
                  <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === "assistant" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {message.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">{message.content}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="bg-gray-50 border-b border-gray-100">
                  <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                          <span className="text-sm">BootsDev-X is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full resize-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 pr-12 min-h-[52px] max-h-32"
              rows={1}
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              size="sm"
              className="absolute cursor-pointer right-2 bottom-2 h-8 w-8 p-0 bg-gray-900 hover:bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send, Shift + Enter for a new line
          </div>
        </div>
      </footer>
    </div>
  )
}
