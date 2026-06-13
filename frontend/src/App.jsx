import { useState } from "react"
import axios from "axios"

export default function App() {
  const [file, setFile] = useState(null)
  const [docId, setDocId] = useState(null)
  const [summary, setSummary] = useState("")
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setSummary("")
    setMessages([])
    setDocId(null)

    const form = new FormData()
    form.append("file", file)

    try {
      const res = await axios.post("/api/documents/upload/", form)
      setDocId(res.data.id)
      setSummary(res.data.summary)
    } catch (e) {
      alert("Upload failed. Make sure Django is running.")
    } finally {
      setUploading(false)
    }
  }

  async function handleChat() {
    if (!question.trim() || !docId) return
    const q = question.trim()
    setQuestion("")
    setMessages(prev => [...prev, { role: "user", content: q }])
    setLoading(true)

    try {
      const res = await axios.post(`/api/documents/${docId}/chat/`, { question: q })
      setMessages(prev => [...prev, { role: "assistant", content: res.data.answer }])
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">DocIQ</h1>
          <p className="text-gray-500 mt-1 text-sm">Upload a PDF. Get a summary. Ask anything.</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF</label>
          <div className="flex gap-3">
            <input
              type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files[0])}
              className="flex-1 text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
            >
              {uploading ? "Analyzing..." : "Upload"}
            </button>
          </div>

          {file && (
            <p className="text-xs text-gray-400 mt-2">{file.name}</p>
          )}
        </div>

        {/* Summary Section */}
        {summary && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Summary</h2>
            <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {summary}
            </div>
          </div>
        )}

        {/* Chat Section */}
        {docId && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Ask anything about this document</h2>

            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No messages yet. Ask your first question.</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-400 px-4 py-2 rounded-xl text-sm">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleChat()}
                placeholder="Ask a question..."
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button
                onClick={handleChat}
                disabled={loading || !question.trim()}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}