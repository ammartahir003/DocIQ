import { useState, useEffect, useRef } from "react"
import axios from "axios"

const api = (token) => ({ headers: { Authorization: `Bearer ${token}` } })

// ---------- THEME ----------
const themes = {
  light: {
    bg: '#F8F9FA', sidebarBg: '#fff', cardBg: '#fff', border: '#E2E8F0',
    text: '#0F172A', textSecondary: '#475569', textMuted: '#94a3b8', textFaint: '#CBD5E1',
    hover: '#F8FAFC', activeBg: '#EEF2FF', activeText: '#4F46E5',
    inputBg: '#F8F9FA', userBubble: '#0F172A', userText: '#fff',
    assistantBubble: '#fff', assistantText: '#374151',
    summaryBorder: '#C7D2FE', summaryBg: '#FAFBFF',
    accent: '#6366F1', accentLight: '#E0E7FF', accentDark: '#4338CA',
    danger: '#EF4444', errorBg: '#FFF1F2', errorBorder: '#FECDD3', errorText: '#BE123C',
    logoBg: '#0F172A', shadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  dark: {
    bg: '#0B0F19', sidebarBg: '#11151F', cardBg: '#161B26', border: '#232938',
    text: '#F1F5F9', textSecondary: '#CBD5E1', textMuted: '#64748b', textFaint: '#3F4759',
    hover: '#1B2130', activeBg: '#1E2236', activeText: '#A5B4FC',
    inputBg: '#0B0F19', userBubble: '#6366F1', userText: '#fff',
    assistantBubble: '#161B26', assistantText: '#E2E8F0',
    summaryBorder: '#3730A3', summaryBg: '#161B2E',
    accent: '#818CF8', accentLight: '#1E2236', accentDark: '#A5B4FC',
    danger: '#F87171', errorBg: '#2D1518', errorBorder: '#5B2329', errorText: '#FCA5A5',
    logoBg: '#6366F1', shadow: '0 1px 3px rgba(0,0,0,0.3)'
  }
}

const IconDoc = ({ size=15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const IconSparkle = ({ color="#6366F1", size=14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/>
    <path d="M5 3L5.5 5L7 5.5L5.5 6L5 8L4.5 6L3 5.5L4.5 5L5 3Z"/>
  </svg>
)
const IconSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
const IconChevron = ({ up }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up?'rotate(180deg)':'none', transition:'transform 0.2s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const IconTable = ({ color="currentColor" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
)

function prettyLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function FieldValue({ value, t }) {
  if (value === null || value === undefined || value === '') {
    return <span style={{ color: t.textFaint, fontStyle:'italic' }}>—</span>
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={{ color: t.textFaint, fontStyle:'italic' }}>—</span>
    if (typeof value[0] === 'object' && value[0] !== null) {
      const cols = Object.keys(value[0])
      return (
        <div style={{ overflowX:'auto', marginTop:'4px' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead>
              <tr>
                {cols.map(c => (
                  <th key={c} style={{ textAlign:'left', padding:'5px 8px', color:t.textMuted, fontWeight:'600', borderBottom:`1px solid ${t.border}`, whiteSpace:'nowrap' }}>{prettyLabel(c)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.map((row,i) => (
                <tr key={i}>
                  {cols.map(c => (
                    <td key={c} style={{ padding:'5px 8px', color:t.textSecondary, borderBottom:`1px solid ${t.border}` }}>{row[c] ?? '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    return (
      <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginTop:'2px' }}>
        {value.map((v,i) => (
          <span key={i} style={{ fontSize:'12px', background:t.hover, color:t.textSecondary, padding:'3px 9px', borderRadius:'5px' }}>{String(v)}</span>
        ))}
      </div>
    )
  }
  return <span style={{ color: t.text }}>{String(value)}</span>
}

function ExtractedDataPanel({ data, t, open, onToggle }) {
  if (!data || !data.fields || Object.keys(data.fields).length === 0) return null
  const entries = Object.entries(data.fields).filter(([,v]) => v !== null && v !== undefined && v !== '')
  if (entries.length === 0) return null

  const typeLabel = data.document_type ? prettyLabel(data.document_type) : 'Document'
  const simpleFields = entries.filter(([,v]) => !Array.isArray(v))
  const arrayFields = entries.filter(([,v]) => Array.isArray(v))

  return (
    <div style={{ borderBottom:`1px solid ${t.border}`, background:t.sidebarBg, flexShrink:0 }}>
      <button onClick={onToggle}
        style={{ width:'100%', padding:'10px 20px', display:'flex', alignItems:'center', gap:'8px', background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
        <IconTable color={t.accent} />
        <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'13px', color:t.text, flex:1, textAlign:'left' }}>
          Extracted Data <span style={{ color:t.textMuted, fontWeight:'400' }}>· {typeLabel}</span>
        </span>
        <span style={{ color:t.textMuted, transition:'transform 0.25s' }}><IconChevron up={open} /></span>
      </button>
      <div style={{
        maxHeight: open ? '420px' : '0px',
        opacity: open ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease',
      }}>
        <div style={{ padding:'0 20px 14px', overflowY: open ? 'auto' : 'hidden', maxHeight:'400px' }}>
          <div style={{ border:`1px solid ${t.border}`, borderRadius:'10px', padding:'14px 16px', background:t.cardBg }}>
            {simpleFields.length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 16px', marginBottom: arrayFields.length ? '14px' : 0 }}>
                {simpleFields.map(([key, value]) => (
                  <div key={key}>
                    <div style={{ fontSize:'11px', color:t.textMuted, fontWeight:'600', marginBottom:'2px', letterSpacing:'0.03em' }}>{prettyLabel(key)}</div>
                    <div style={{ fontSize:'13px' }}><FieldValue value={value} t={t} /></div>
                  </div>
                ))}
              </div>
            )}
            {arrayFields.map(([key, value]) => (
              <div key={key} style={{ marginTop:'10px' }}>
                <div style={{ fontSize:'11px', color:t.textMuted, fontWeight:'600', marginBottom:'4px', letterSpacing:'0.03em' }}>{prettyLabel(key)}</div>
                <FieldValue value={value} t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

function LoginScreen({ onLogin, theme, toggleTheme }) {
  const t = themes[theme]
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('login')

  async function handleSubmit() {
    if (!username || !password) return
    setLoading(true); setError('')
    try {
      if (mode === 'register') await axios.post('/api/accounts/register/', { username, password })
      const res = await axios.post('/api/accounts/login/', { username, password })
      localStorage.setItem('token', res.data.access)
      onLogin(res.data.access)
    } catch { setError(mode === 'login' ? 'Invalid username or password.' : 'Registration failed. Username may already exist.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', width:'100vw', position:'fixed', top:0, left:0, background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', padding:'16px', boxSizing:'border-box', transition:'background 0.2s' }}>
      <button onClick={toggleTheme} style={{ position:'absolute', top:'20px', right:'20px', width:'36px', height:'36px', borderRadius:'8px', border:`1px solid ${t.border}`, background:t.cardBg, color:t.textSecondary, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {theme==='light' ? <IconMoon /> : <IconSun />}
      </button>
      <div style={{ background:t.cardBg, borderRadius:'16px', padding:'40px', width:'100%', maxWidth:'400px', border:`1px solid ${t.border}`, boxShadow:t.shadow, boxSizing:'border-box' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'28px' }}>
          <div style={{ width:'52px', height:'52px', background:t.logoBg, borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'22px', fontWeight:'700', color:t.text, margin:0 }}>DocIQ</h1>
          <p style={{ color:t.textMuted, fontSize:'13px', margin:'4px 0 0' }}>Upload. Summarize. Ask anything.</p>
        </div>
        {error && <div style={{ background:t.errorBg, border:`1px solid ${t.errorBorder}`, borderRadius:'8px', padding:'10px 14px', marginBottom:'14px', color:t.errorText, fontSize:'13px' }}>{error}</div>}
        <div style={{ marginBottom:'12px' }}>
          <label style={{ fontSize:'12px', fontWeight:'600', color:t.textSecondary, display:'block', marginBottom:'6px' }}>Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder="your_username"
            style={{ width:'100%', padding:'10px 12px', border:`1px solid ${t.border}`, borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif', color:t.text, background:t.bg }}
            onFocus={e=>e.target.style.borderColor=t.accent} onBlur={e=>e.target.style.borderColor=t.border} />
        </div>
        <div style={{ marginBottom:'20px' }}>
          <label style={{ fontSize:'12px', fontWeight:'600', color:t.textSecondary, display:'block', marginBottom:'6px' }}>Password</label>
          <div style={{ position:'relative' }}>
            <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder="••••••••"
              style={{ width:'100%', padding:'10px 40px 10px 12px', border:`1px solid ${t.border}`, borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif', color:t.text, background:t.bg }}
              onFocus={e=>e.target.style.borderColor=t.accent} onBlur={e=>e.target.style.borderColor=t.border} />
            <button onClick={()=>setShowPass(p=>!p)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:t.textMuted, padding:0 }}>
              {showPass
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading||!username||!password}
          style={{ width:'100%', padding:'11px', background:t.logoBg, color:'white', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'600', cursor:'pointer', marginBottom:'10px', fontFamily:'Inter,sans-serif', opacity:loading?0.7:1 }}>
          {loading ? 'Please wait...' : mode==='login' ? 'Sign In' : 'Create Account'}
        </button>
        <button onClick={()=>{setMode(m=>m==='login'?'register':'login');setError('')}}
          style={{ width:'100%', padding:'11px', background:t.cardBg, color:t.text, border:`1px solid ${t.border}`, borderRadius:'8px', fontSize:'14px', fontWeight:'600', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
          {mode==='login' ? 'Create Account' : 'Back to Sign In'}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const t = themes[theme]
  const [token, setToken] = useState(localStorage.getItem('token')||'')
  const [docs, setDocs] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [messages, setMessages] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [extractedOpen, setExtractedOpen] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [searching, setSearching] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const fileRef = useRef()
  const chatEndRef = useRef()
  const inputRef = useRef()

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  useEffect(()=>{ if(token) fetchDocs() },[token])
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:'smooth'}) },[messages])
  useEffect(()=>{ if(messages.length >= 2) setExtractedOpen(false) },[messages.length])

  async function fetchDocs() {
    try { const res = await axios.get('/api/documents/', api(token)); setDocs(res.data) }
    catch { logout() }
  }

  async function loadChatHistory(docId) {
    setLoadingHistory(true)
    try {
      const res = await axios.get(`/api/documents/${docId}/messages/`, api(token))
      setMessages(res.data.map(m => ({ role: m.role, content: m.content })))
    } catch { setMessages([]) }
    finally { setLoadingHistory(false) }
  }

  async function handleUpload(f) {
    if(!f) return
    setUploading(true)
    const form = new FormData(); form.append('file', f)
    try {
      const res = await axios.post('/api/documents/upload/', form, api(token))
      const newDoc = res.data
      setDocs(prev=>[newDoc,...prev])
      setSearchMode(false)
      setSelectedDoc(newDoc); setMessages([]); setExtractedOpen(true)
      setTimeout(()=>inputRef.current?.focus(),100)
    } catch { alert('Upload failed') }
    finally { setUploading(false) }
  }

  async function handleDelete(docId, e) {
    e.stopPropagation()
    await axios.delete(`/api/documents/${docId}/delete/`, api(token))
    setDocs(prev=>prev.filter(d=>d.id!==docId))
    if(selectedDoc?.id===docId){ setSelectedDoc(null); setMessages([]) }
  }

  function openDoc(doc) {
    setSearchMode(false)
    setSelectedDoc(doc); setExtractedOpen(true)
    loadChatHistory(doc.id)
    setTimeout(()=>inputRef.current?.focus(),100)
  }

  async function handleChat() {
    if(!question.trim()||!selectedDoc||loading) return
    const q = question.trim(); setQuestion('')
    setMessages(prev=>[...prev,{role:'user',content:q}])
    setLoading(true)
    try {
      const res = await axios.post(`/api/documents/${selectedDoc.id}/chat/`,{question:q},api(token))
      setMessages(prev=>[...prev,{role:'assistant',content:res.data.answer}])
    } catch { setMessages(prev=>[...prev,{role:'assistant',content:'Something went wrong. Try again.'}]) }
    finally { setLoading(false) }
  }

  function logout() { localStorage.removeItem('token'); setToken(''); setDocs([]); setSelectedDoc(null) }

  function openSearch() {
    setSelectedDoc(null)
    setSearchMode(true)
    setSearchResult(null)
    setSearchQuery('')
  }

  async function handleSearch() {
    if (!searchQuery.trim() || searching) return
    const q = searchQuery.trim()
    setSearching(true)
    setSearchResult(null)
    try {
      const res = await axios.post('/api/documents/search/', { question: q }, api(token))
      setSearchResult({ question: q, answer: res.data.answer, sources: res.data.sources || [] })
    } catch {
      setSearchResult({ question: q, answer: 'Something went wrong. Try again.', sources: [] })
    } finally {
      setSearching(false)
    }
  }

  function toggleSelect(docId, e) {
    e.stopPropagation()
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(docId)) next.delete(docId)
      else next.add(docId)
      return next
    })
  }

  function toggleSelectMode() {
    setSelectMode(m => !m)
    setSelectedIds(new Set())
  }

  function selectAll() {
    if (selectedIds.size === docs.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(docs.map(d => d.id)))
  }

  async function handleExport() {
    if (docs.length === 0) return
    const idsToExport = selectMode && selectedIds.size > 0 ? Array.from(selectedIds) : null
    if (selectMode && selectedIds.size === 0) { alert('Select at least one document.'); return }
    setExporting(true)
    try {
      const url = idsToExport
        ? `/api/documents/export/?ids=${idsToExport.join(',')}`
        : '/api/documents/export/'
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute('download', 'dociq_export.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
      setSelectMode(false)
      setSelectedIds(new Set())
    } catch {
      alert('Export failed. Try again.')
    } finally {
      setExporting(false)
    }
  }

  function onDrop(e) {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if(f?.type==='application/pdf') handleUpload(f)
  }

  if(!token) return <LoginScreen onLogin={setToken} theme={theme} toggleTheme={toggleTheme} />

  return (
    <div style={{ display:'flex', height:'100vh', width:'100vw', fontFamily:'Inter,sans-serif', background:t.bg, overflow:'hidden', position:'fixed', top:0, left:0, transition:'background 0.2s' }}>
      {/* Sidebar */}
      <div style={{ width:'240px', minWidth:'240px', background:t.sidebarBg, borderRight:`1px solid ${t.border}`, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', transition:'background 0.2s' }}>
        <div style={{ padding:'18px 16px 14px', borderBottom:`1px solid ${t.border}`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'30px', height:'30px', background:t.logoBg, borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'14px', color:t.text }}>DocIQ</div>
              <div style={{ fontSize:'10px', color:t.textMuted }}>Document Intelligence</div>
            </div>
          </div>
          <button onClick={toggleTheme} title="Toggle theme"
            style={{ width:'28px', height:'28px', borderRadius:'6px', border:`1px solid ${t.border}`, background:'transparent', color:t.textSecondary, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {theme==='light' ? <IconMoon /> : <IconSun />}
          </button>
        </div>

        <div style={{ padding:'10px', flexShrink:0 }}>
          <div onClick={()=>fileRef.current.click()} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={onDrop}
            style={{ border:`1.5px dashed ${dragOver?t.accent:t.textFaint}`, borderRadius:'10px', padding:'14px 10px', display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer', background:dragOver?t.activeBg:'transparent', gap:'5px', transition:'all 0.15s' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dragOver?t.accent:t.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <span style={{ fontSize:'12px', color: dragOver?t.accent:t.textSecondary, fontWeight:'500' }}>{uploading?'Analyzing...':'Upload PDF'}</span>
            <span style={{ fontSize:'10px', color:t.textMuted }}>or drag and drop</span>
          </div>
          <input ref={fileRef} type="file" accept=".pdf" style={{ display:'none' }} onChange={e=>{ const f=e.target.files[0]; if(f) handleUpload(f); e.target.value='' }} />
        </div>

        <div style={{ padding:'0 10px 8px' }}>
          <button onClick={openSearch} disabled={docs.length===0}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:'8px', padding:'8px 10px', borderRadius:'8px', border:'none', cursor: docs.length===0?'default':'pointer',
              background: searchMode ? t.activeBg : 'transparent', color: searchMode ? t.activeText : t.textSecondary, fontSize:'12px', fontWeight:'500', fontFamily:'Inter,sans-serif', opacity: docs.length===0?0.5:1 }}
            onMouseEnter={e=>{ if(!searchMode && docs.length>0) e.currentTarget.style.background=t.hover }}
            onMouseLeave={e=>{ if(!searchMode) e.currentTarget.style.background='transparent' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search All Documents
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'0 8px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 8px 6px' }}>
            <span style={{ fontSize:'10px', fontWeight:'600', color:t.textMuted, letterSpacing:'0.07em', textTransform:'uppercase' }}>Documents</span>
            {docs.length > 0 && (
              <button onClick={toggleSelectMode}
                style={{ background:'none', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'600', color: selectMode ? t.accent : t.textMuted, fontFamily:'Inter,sans-serif' }}>
                {selectMode ? 'Cancel' : 'Select'}
              </button>
            )}
          </div>
          {selectMode && docs.length > 0 && (
            <div onClick={selectAll} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'5px 8px', cursor:'pointer', marginBottom:'2px' }}>
              <div style={{
                width:'15px', height:'15px', borderRadius:'4px', border:`1.5px solid ${selectedIds.size===docs.length ? t.accent : t.border}`,
                background: selectedIds.size===docs.length ? t.accent : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
              }}>
                {selectedIds.size===docs.length && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
              <span style={{ fontSize:'12px', color:t.textMuted, fontWeight:'500' }}>
                {selectedIds.size===docs.length ? 'Deselect all' : 'Select all'}
              </span>
            </div>
          )}
          {docs.length===0 && <div style={{ padding:'8px', fontSize:'12px', color:t.textFaint, textAlign:'center' }}>No documents yet</div>}
          {docs.map(doc=>(
            <div key={doc.id} onClick={()=> selectMode ? toggleSelect(doc.id, {stopPropagation:()=>{}}) : openDoc(doc)}
              style={{ display:'flex', alignItems:'center', gap:'7px', padding:'7px 8px', borderRadius:'7px', cursor:'pointer', background:selectedDoc?.id===doc.id && !selectMode ?t.activeBg:'transparent', marginBottom:'1px', transition:'background 0.1s' }}
              onMouseEnter={e=>{ if(selectedDoc?.id!==doc.id || selectMode) e.currentTarget.style.background=t.hover }}
              onMouseLeave={e=>{ if(selectedDoc?.id!==doc.id || selectMode) e.currentTarget.style.background='transparent' }}>
              {selectMode ? (
                <div onClick={e=>toggleSelect(doc.id,e)} style={{
                  width:'15px', height:'15px', borderRadius:'4px', border:`1.5px solid ${selectedIds.has(doc.id) ? t.accent : t.border}`,
                  background: selectedIds.has(doc.id) ? t.accent : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
                }}>
                  {selectedIds.has(doc.id) && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </div>
              ) : (
                <span style={{ color:selectedDoc?.id===doc.id?t.accent:t.textMuted, flexShrink:0 }}><IconDoc /></span>
              )}
              <span style={{ fontSize:'12px', color:selectedDoc?.id===doc.id && !selectMode?t.activeText:t.textSecondary, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:selectedDoc?.id===doc.id && !selectMode?'500':'400' }}>{doc.filename}</span>
              {!selectMode && (
                <button onClick={e=>handleDelete(doc.id,e)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:t.textFaint, padding:'0 2px', fontSize:'14px', lineHeight:1, flexShrink:0 }}
                  onMouseEnter={e=>e.target.style.color=t.danger} onMouseLeave={e=>e.target.style.color=t.textFaint}>×</button>
              )}
            </div>
          ))}
        </div>

        <div style={{ padding:'8px 12px', borderTop:`1px solid ${t.border}`, flexShrink:0 }}>
          <button onClick={handleExport} disabled={exporting || docs.length===0}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', background:t.hover, border:`1px solid ${t.border}`, borderRadius:'8px', cursor: docs.length===0 ? 'default' : 'pointer', color:t.textSecondary, fontSize:'12px', fontWeight:'500', padding:'8px 0', fontFamily:'Inter,sans-serif', opacity: docs.length===0 ? 0.5 : 1, transition:'background 0.15s' }}
            onMouseEnter={e=>{ if(docs.length>0) e.currentTarget.style.background=t.activeBg }}
            onMouseLeave={e=>e.currentTarget.style.background=t.hover}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {exporting ? 'Exporting...' : selectMode && selectedIds.size > 0 ? `Export ${selectedIds.size} Selected` : 'Export to Excel'}
          </button>
        </div>

        <div style={{ padding:'12px 16px', borderTop:`1px solid ${t.border}`, flexShrink:0 }}>
          <button onClick={logout}
            style={{ display:'flex', alignItems:'center', gap:'8px', background:'none', border:'none', cursor:'pointer', color:t.textMuted, fontSize:'13px', padding:'4px 0', fontFamily:'Inter,sans-serif' }}
            onMouseEnter={e=>e.currentTarget.style.color=t.text} onMouseLeave={e=>e.currentTarget.style.color=t.textMuted}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        {searchMode ? (
          <>
            <div style={{ padding:'13px 20px', borderBottom:`1px solid ${t.border}`, background:t.sidebarBg, display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
              <span style={{ color:t.accent }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'14px', color:t.text }}>Search All Documents</span>
              <span style={{ fontSize:'11px', color:t.textMuted, marginLeft:'4px' }}>· searching {docs.length} document{docs.length!==1?'s':''}</span>
            </div>

            <div style={{ flex:1, overflowY:'auto', padding:'24px 24px', display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:'100%', maxWidth:'640px' }}>
                {!searchResult && !searching && (
                  <div style={{ textAlign:'center', paddingTop:'40px' }}>
                    <div style={{ width:'52px', height:'52px', background:t.activeBg, borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </div>
                    <p style={{ color:t.textSecondary, fontSize:'14px', margin:'0 0 4px', fontWeight:'500' }}>Ask anything across your library</p>
                    <p style={{ color:t.textMuted, fontSize:'13px', margin:0 }}>e.g. "Which contracts mention auto-renewal?" or "What's the total of all invoices?"</p>
                  </div>
                )}

                {searching && (
                  <div style={{ display:'flex', gap:'8px', alignItems:'flex-start', marginTop:'8px' }}>
                    <div style={{ width:'26px', height:'26px', background:t.logoBg, borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <IconSparkle color="#fff" />
                    </div>
                    <div style={{ background:t.assistantBubble, border:`1px solid ${t.border}`, borderRadius:'10px', padding:'10px 14px', fontSize:'13px', color:t.textMuted }}>Searching across your documents...</div>
                  </div>
                )}

                {searchResult && !searching && (
                  <div>
                    <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'14px' }}>
                      <div style={{ maxWidth:'80%', padding:'10px 14px', borderRadius:'10px', fontSize:'13px', lineHeight:'1.6', background:t.userBubble, color:t.userText }}>
                        {searchResult.question}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
                      <div style={{ width:'26px', height:'26px', background:t.logoBg, borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px' }}>
                        <IconSparkle color="#fff" />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ background:t.assistantBubble, border:`1px solid ${t.border}`, borderRadius:'10px', padding:'12px 14px', fontSize:'13px', lineHeight:'1.6', color:t.assistantText, boxShadow:t.shadow }}>
                          {searchResult.answer}
                        </div>
                        {searchResult.sources.length > 0 && (
                          <div style={{ marginTop:'10px' }}>
                            <div style={{ fontSize:'11px', color:t.textMuted, fontWeight:'600', marginBottom:'6px', letterSpacing:'0.03em', textTransform:'uppercase' }}>Sources</div>
                            <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                              {searchResult.sources.map(src => {
                                const doc = docs.find(d => d.id === src.id)
                                return (
                                  <button key={src.id} onClick={()=> doc && openDoc(doc)}
                                    style={{ display:'flex', alignItems:'center', gap:'7px', padding:'7px 10px', borderRadius:'7px', border:`1px solid ${t.border}`, background:t.cardBg, cursor:'pointer', textAlign:'left', fontFamily:'Inter,sans-serif' }}
                                    onMouseEnter={e=>e.currentTarget.style.background=t.hover}
                                    onMouseLeave={e=>e.currentTarget.style.background=t.cardBg}>
                                    <span style={{ color:t.accent, flexShrink:0 }}><IconDoc /></span>
                                    <span style={{ fontSize:'12px', color:t.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{src.filename}</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding:'12px 20px', borderTop:`1px solid ${t.border}`, background:t.sidebarBg, flexShrink:0, display:'flex', justifyContent:'center' }}>
              <div style={{ display:'flex', gap:'8px', alignItems:'center', background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'10px', padding:'5px 5px 5px 14px', width:'100%', maxWidth:'640px' }}>
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()}
                  placeholder="Search across all your documents..."
                  style={{ flex:1, border:'none', background:'transparent', fontSize:'13px', outline:'none', color:t.text, fontFamily:'Inter,sans-serif' }} />
                <button onClick={handleSearch} disabled={searching||!searchQuery.trim()}
                  style={{ width:'32px', height:'32px', background:searchQuery.trim()?t.accent:t.border, border:'none', borderRadius:'7px', cursor:searchQuery.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', color:searchQuery.trim()?'white':t.textMuted, transition:'all 0.15s', flexShrink:0 }}>
                  <IconSend />
                </button>
              </div>
            </div>
          </>
        ) : !selectedDoc ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'12px' }}>
            <div style={{ width:'52px', height:'52px', background:t.hover, borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p style={{ color:t.textMuted, fontSize:'14px', margin:0 }}>Upload a PDF to get started</p>
          </div>
        ) : (
          <>
            <div style={{ padding:'13px 20px', borderBottom:`1px solid ${t.border}`, background:t.sidebarBg, display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
              <span style={{ color:t.textMuted }}><IconDoc /></span>
              <span style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'600', fontSize:'14px', color:t.text, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selectedDoc.filename}</span>
            </div>

            <ExtractedDataPanel data={selectedDoc.extracted_data} t={t} open={extractedOpen} onToggle={()=>setExtractedOpen(o=>!o)} />

            <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:'14px' }}>
              {loadingHistory && (
                <div style={{ textAlign:'center', color:t.textFaint, fontSize:'13px', paddingTop:'20px' }}>Loading conversation...</div>
              )}
              {!loadingHistory && messages.length===0 && (
                <div style={{ textAlign:'center', color:t.textFaint, fontSize:'13px', paddingTop:'20px' }}>Ask DocIQ about this document...</div>
              )}
              {!loadingHistory && messages.map((m,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', gap:'8px', alignItems:'flex-start' }}>
                  {m.role==='assistant' && (
                    <div style={{ width:'26px', height:'26px', background:t.logoBg, borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px' }}>
                      <IconSparkle color="#fff" />
                    </div>
                  )}
                  <div style={{
                    maxWidth:'65%', padding:'10px 14px', borderRadius:'10px', fontSize:'13px', lineHeight:'1.6',
                    background:m.role==='user'?t.userBubble:t.assistantBubble,
                    color:m.role==='user'?t.userText:t.assistantText,
                    border:m.role==='assistant'?`1px solid ${t.border}`:'none',
                    boxShadow:m.role==='assistant'?t.shadow:'none'
                  }}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
                  <div style={{ width:'26px', height:'26px', background:t.logoBg, borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <IconSparkle color="#fff" />
                  </div>
                  <div style={{ background:t.assistantBubble, border:`1px solid ${t.border}`, borderRadius:'10px', padding:'10px 14px', fontSize:'13px', color:t.textMuted }}>Thinking...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding:'12px 20px', borderTop:`1px solid ${t.border}`, background:t.sidebarBg, flexShrink:0 }}>
              <div style={{ display:'flex', gap:'8px', alignItems:'center', background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'10px', padding:'5px 5px 5px 14px' }}>
                <input ref={inputRef} value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleChat()}
                  placeholder="Ask DocIQ about this document..."
                  style={{ flex:1, border:'none', background:'transparent', fontSize:'13px', outline:'none', color:t.text, fontFamily:'Inter,sans-serif' }} />
                <button onClick={handleChat} disabled={loading||!question.trim()}
                  style={{ width:'32px', height:'32px', background:question.trim()?t.accent:t.border, border:'none', borderRadius:'7px', cursor:question.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', color:question.trim()?'white':t.textMuted, transition:'all 0.15s', flexShrink:0 }}>
                  <IconSend />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}