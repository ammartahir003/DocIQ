import { useState, useEffect, useRef } from "react"

const IconDoc = ({ size=15, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

const IconSearch = ({ size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const IconTable = ({ size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
)

const IconExport = ({ size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const IconCheck = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ---------- Signature element: the document stack ----------
function DocumentStack() {
  const [hovered, setHovered] = useState(false)
  const docs = [
    { name: "Vendor_Contract_2026.pdf", type: "Contract", color: "#818CF8" },
    { name: "Q3_Invoice_0042.pdf", type: "Invoice", color: "#34D399" },
    { name: "Lease_Agreement_Final.pdf", type: "Contract", color: "#818CF8" },
    { name: "Resume_Candidate_07.pdf", type: "Resume", color: "#FBBF24" },
  ]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {docs.map((doc, i) => {
        const baseOffset = i * 16
        const fanAngle = hovered ? (i - 1.5) * 12 : 0
        const fanX = hovered ? (i - 1.5) * 75 : 0
        const fanY = hovered ? Math.abs(i - 1.5) * 20 : 0
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '230px',
              height: '290px',
              background: '#121723e0',
              backdropFilter: 'blur(12px)',
              border: '1px solid #2D3348',
              borderRadius: '14px',
              boxShadow: hovered
                ? '0 28px 56px -12px rgba(99, 102, 241, 0.25)'
                : '0 8px 32px -8px rgba(0,0,0,0.5)',
              transform: `translateY(${-baseOffset + fanY}px) translateX(${fanX}px) rotate(${fanAngle}deg)`,
              transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.3s',
              padding: '22px',
              zIndex: 10 - i,
              cursor: 'pointer',
            }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'18px' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'7px', background: doc.color+'22', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IconDoc size={14} color={doc.color} />
              </div>
              <span style={{ fontSize:'11px', color: doc.color, fontWeight:'600', letterSpacing:'0.04em', textTransform:'uppercase' }}>{doc.type}</span>
            </div>
            <div style={{ fontSize:'13px', color:'#CBD5E1', fontWeight:'600', marginBottom:'16px', wordBreak:'break-word', lineHeight:'1.4' }}>{doc.name}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {[1, 0.85, 0.6].map((w, j) => (
                <div key={j} style={{ height:'6px', borderRadius:'3px', background:'#22293F', width: `${w*100}%` }} />
              ))}
            </div>
            <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px dashed #2D3348', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#64748b' }}>Status</span>
              <span style={{ fontSize: '10px', color: '#34D399', fontWeight: '600', background: 'rgba(52, 211, 153, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>Indexed</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AnimatedCounter({ end, prefix = '', suffix = '', duration = 1400 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = Date.now()
        const tick = () => {
          const progress = Math.min((Date.now() - startTime) / duration, 1)
          setCount(Math.floor(progress * end))
          if (progress < 1) requestAnimationFrame(tick)
        }
        tick()
      }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])

  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

// ---------- Real Process Visualization Component ----------
function ProcessFlow() {
  const [activeStage, setActiveStage] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(curr => (curr === 3 ? 1 : curr + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    {
      id: 1,
      title: "1. Unstructured Input",
      desc: "Drag-and-drop raw PDF documents, scanned receipts, messy invoices, or complex contracts.",
      details: ["Legal PDFs", "Invoices", "Resumes", "Leases"],
      color: "#818CF8",
    },
    {
      id: 2,
      title: "2. Intelligent Parsing",
      desc: "DocIQ parses the context, links paragraphs together, and builds structured entities.",
      details: ["Deep context extraction", "Table recovery", "Key-Value matching"],
      color: "#A5B4FC",
    },
    {
      id: 3,
      title: "3. Actionable Structured Data",
      desc: "Query the knowledge base, review cleanly aggregated tables, or export instantly to `.xlsx` files.",
      details: ["Excel sheets", "Unified context searches", "Structured APIs"],
      color: "#34D399",
    }
  ];

  return (
    <div style={{
      background: '#111625',
      borderRadius: '24px',
      border: '1px solid #2D3348',
      padding: '40px',
      marginTop: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#F8FAFC' }}>
        How DocIQ Processes Your Library
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '20px', alignItems: 'center' }} className="process-grid">
        {/* Stage 1 Block */}
        <div 
          onClick={() => setActiveStage(1)}
          style={{
            background: activeStage === 1 ? 'rgba(99, 102, 241, 0.08)' : 'rgba(26, 31, 46, 0.4)',
            border: activeStage === 1 ? '2px solid #6366F1' : '1px solid #2D3348',
            borderRadius: '16px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818CF8' }} />
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: activeStage === 1 ? '#818CF8' : '#CBD5E1', margin: 0 }}>Unstructured Input</h4>
          </div>
          <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
            Messy folders filled with random PDFs, multi-page agreements, and financial reports.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
            {stages[0].details.map((item, idx) => (
              <span key={idx} style={{ fontSize: '10px', color: '#CBD5E1', background: '#22293F', padding: '4px 8px', borderRadius: '6px' }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Dynamic Connected Core */}
        <div style={{ textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Animated Connecting Lines (Visual SVGs) */}
          <div style={{ width: '100%', height: '100px', position: 'relative', display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '15px 0' }}>
            <svg width="100%" height="80" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
              <defs>
                <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Path from left block to center */}
              <path d="M 0 40 Q 60 10 120 40 T 240 40" fill="none" stroke="url(#lineGrad1)" strokeWidth="2" strokeDasharray={activeStage === 2 ? "5, 5" : "none"} style={{ animation: activeStage === 2 ? 'dash 15s linear infinite' : 'none' }} />
              {/* Floating Pulse */}
              <circle r="5" fill="#818CF8">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 0 40 Q 60 10 120 40 T 240 40" />
              </circle>
            </svg>
            
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: activeStage === 2 ? 'rgba(99, 102, 241, 0.15)' : '#1E2433',
              border: `2px solid ${activeStage === 2 ? '#6366F1' : '#2D3348'}`,
              boxShadow: activeStage === 2 ? '0 0 24px rgba(99, 102, 241, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              transition: 'all 0.3s ease'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={activeStage === 2 ? '#818CF8' : '#64748b'} strokeWidth="1.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', margin: '10px 0 4px' }}>DocIQ Core</h4>
          <p style={{ fontSize: '11px', color: '#64748B', maxWidth: '180px' }}>
            Consolidating multi-file data structures into key vectors.
          </p>
        </div>

        {/* Stage 3 Block */}
        <div 
          onClick={() => setActiveStage(3)}
          style={{
            background: activeStage === 3 ? 'rgba(52, 211, 153, 0.08)' : 'rgba(26, 31, 46, 0.4)',
            border: activeStage === 3 ? '2px solid #34D399' : '1px solid #2D3348',
            borderRadius: '16px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399' }} />
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: activeStage === 3 ? '#34D399' : '#CBD5E1', margin: 0 }}>Actionable Output</h4>
          </div>
          <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
            Clean spreadsheet entries with every extracted value matching its corresponding file context.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
            {stages[2].details.map((item, idx) => (
              <span key={idx} style={{ fontSize: '10px', color: '#CBD5E1', background: '#22293F', padding: '4px 8px', borderRadius: '6px' }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(10, 14, 23, 0.6)', borderRadius: '12px', border: '1px solid #2D3348', textAlign: 'left' }}>
        <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#818CF8', marginBottom: '6px' }}>
          {stages[activeStage - 1].title}
        </h5>
        <p style={{ fontSize: '12.5px', color: '#CBD5E1', margin: 0, lineHeight: '1.5' }}>
          {stages[activeStage - 1].desc}
        </p>
      </div>
    </div>
  );
}

export default function Landing({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('finance')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const colors = {
    bg: '#0A0E17',
    surface: '#12172380',
    border: '#2D3348',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#64748b',
    accent: '#6366F1',
    accentLight: '#818CF8',
  }

  // Realistic Interactive Comparison Grid Component Mock up
  const mockTableData = {
    finance: [
      { doc: "Invoice_Dec_9901.pdf", status: "Indexed", netGst: "$1,450.00", autoRenewal: "N/A", risk: "Low" },
      { doc: "Ammar_Tahir_Q4_Stmt.pdf", status: "Indexed", netGst: "$14,290.00", autoRenewal: "N/A", risk: "Low" },
      { doc: "Utility_Bill_A4.pdf", status: "Indexed", netGst: "$120.45", autoRenewal: "N/A", risk: "Low" }
    ],
    legal: [
      { doc: "Vendor_Agmt_Amended.pdf", status: "Indexed", netGst: "N/A", autoRenewal: "Yes (60 days)", risk: "Medium" },
      { doc: "Service_Level_Agmt_2026.pdf", status: "Indexed", netGst: "N/A", autoRenewal: "No (Manual)", risk: "High" },
      { doc: "Office_Lease_v2.pdf", status: "Indexed", netGst: "N/A", autoRenewal: "Yes (90 days)", risk: "Medium" }
    ]
  };

  return (
    <div style={{ background: colors.bg, color: colors.text, fontFamily: 'Inter, sans-serif', minHeight: '100vh', width: '100%', overflowX: 'hidden', overflowY: 'auto', position: 'relative' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,14,23,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${colors.border}` : '1px solid transparent',
        transition: 'all 0.25s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: colors.accent, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconDoc size={14} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '16px' }}>DocIQ</span>
        </div>
        <button onClick={onGetStarted} style={{
          background: colors.text, color: colors.bg, border: 'none', borderRadius: '8px',
          padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '120px 32px 60px', position: 'relative', maxWidth: '1280px', margin: '0 auto',
      }}>
        {/* ambient grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4, zIndex: 0,
          backgroundImage: `linear-gradient(${colors.border} 1px, transparent 1px), linear-gradient(90deg, ${colors.border} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 70%)',
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 1 }} className="hero-grid">
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 12px',
              borderRadius: '20px', border: `1px solid ${colors.border}`, marginBottom: '24px',
              fontSize: '12px', color: colors.textSecondary, background: colors.surface,
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
              Built for people drowning in PDFs
            </div>

            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(36px, 5.5vw, 60px)', fontWeight: 700,
              lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 24px', color: colors.text, textAlign: 'left'
            }}>
              Your documents,<br />
              <span style={{ color: colors.accentLight }}>finally talking</span><br />
              to each other.
            </h1>

            <p style={{ fontSize: '17px', color: colors.textSecondary, lineHeight: 1.6, maxWidth: '480px', marginBottom: '36px', textAlign: 'left' }}>
              ChatGPT reads one PDF at a time. DocIQ remembers all of them — search across your entire library, pull structured data automatically, and export straight to Excel.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <button onClick={onGetStarted} style={{
                background: colors.accent, color: '#fff', border: 'none', borderRadius: '10px',
                padding: '13px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif',
                boxShadow: `0 8px 24px -8px ${colors.accent}80`,
              }}>
                Start for free <IconArrow />
              </button>
              <a href="#features" style={{
                color: colors.text, border: `1px solid ${colors.border}`, borderRadius: '10px',
                padding: '13px 24px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                display: 'flex', alignItems: 'center',
              }}>
                See how it works
              </a>
            </div>

            {/* High Fidelity Aligning Stats Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              width: '100%',
              maxWidth: '480px',
              paddingTop: '24px',
              borderTop: `1px solid ${colors.border}`,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: 700, color: colors.text, lineHeight: '1.2' }}>
                  <AnimatedCounter end={4} suffix="x" />
                </div>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px', textAlign: 'left' }}>faster manual review</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: 700, color: colors.text, lineHeight: '1.2' }}>
                  <AnimatedCounter end={0} prefix="$" />
                </div>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px', textAlign: 'left' }}>to start on free tier</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: 700, color: colors.text, lineHeight: '1.2' }}>
                  1 <span style={{ color: colors.accentLight, fontWeight: '700' }}>click</span>
                </div>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '4px', textAlign: 'left' }}>to export to Excel</div>
              </div>
            </div>
          </div>

          <DocumentStack />
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '13px', color: colors.accentLight, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
            What makes it different
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
            Three things ChatGPT can't do
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="feature-grid">
          {[
            {
              icon: <IconSearch size={20} color={colors.accentLight} />,
              title: "Search your whole library",
              desc: "Ask one question and get answers pulled from every document you've uploaded — not just the one you have open.",
            },
            {
              icon: <IconTable size={20} color="#34D399" />,
              title: "Structured data, automatically",
              desc: "Upload an invoice or contract and DocIQ extracts the fields that matter — vendor, dates, amounts — as clean structured data.",
            },
            {
              icon: <IconExport size={20} color="#FBBF24" />,
              title: "Export straight to Excel",
              desc: "Select any documents and download a spreadsheet with every extracted field as a row. No retyping, no copy-pasting.",
            },
          ].map((f, i) => (
            <div key={i} style={{
              background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px',
              padding: '28px', backdropFilter: 'blur(8px)', textAlign: 'left'
            }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px', background: '#1A1F2E',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '17px', fontWeight: 600, margin: '0 0 10px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Process Flow Insertion */}
        <ProcessFlow />
      </section>

      {/* Compare facts across hundreds of docs Section */}
      <section style={{ padding: '80px 32px', borderTop: `1px solid ${colors.border}`, background: 'rgba(10, 14, 23, 0.5)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '50px', alignItems: 'center' }} className="compare-grid">
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: '700', color: colors.text, marginBottom: '20px', lineHeight: '1.2' }}>
              Compare facts across hundreds of docs in seconds.
            </h2>
            <p style={{ fontSize: '15px', color: colors.textSecondary, lineHeight: '1.6', marginBottom: '32px' }}>
              Why review documents one by one? DocIQ's Multi-Doc interface allows you to define a set of data points once and apply them to your entire library. See inconsistencies and outliers instantly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconCheck size={12} color={colors.accentLight} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', margin: '0 0 4px' }}>Legal Briefs</h4>
                  <p style={{ fontSize: '13px', color: colors.textMuted, margin: 0 }}>Compare arguments and clauses across 100+ cases instantly.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconCheck size={12} color="#34D399" />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', margin: '0 0 4px' }}>Procurement & Invoices</h4>
                  <p style={{ fontSize: '13px', color: colors.textMuted, margin: 0 }}>Audit 500+ invoices for tax compliance or pricing drift.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconCheck size={12} color="#FBBF24" />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', margin: '0 0 4px' }}>Compliance</h4>
                  <p style={{ fontSize: '13px', color: colors.textMuted, margin: 0 }}>Verify regional policy adherence across nested corporate documents.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Document Compare Mock Card */}
          <div style={{ background: '#121723', borderRadius: '18px', border: `1px solid ${colors.border}`, padding: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7)', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setActiveTab('finance')}
                  style={{
                    background: activeTab === 'finance' ? colors.accent : 'transparent',
                    color: activeTab === 'finance' ? '#fff' : colors.textSecondary,
                    border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Finance Extract
                </button>
                <button 
                  onClick={() => setActiveTab('legal')}
                  style={{
                    background: activeTab === 'legal' ? colors.accent : 'transparent',
                    color: activeTab === 'legal' ? '#fff' : colors.textSecondary,
                    border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Lease & Legal
                </button>
              </div>
              <span style={{ fontSize: '11px', color: colors.textMuted }}>DocIQ Realtime Table</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <th style={{ textAlign: 'left', padding: '8px', color: colors.textMuted, fontWeight: '500' }}>Document Name</th>
                    <th style={{ textAlign: 'left', padding: '8px', color: colors.textMuted, fontWeight: '500' }}>Status</th>
                    {activeTab === 'finance' ? (
                      <th style={{ textAlign: 'left', padding: '8px', color: colors.textMuted, fontWeight: '500' }}>Net (incl. GST)</th>
                    ) : (
                      <th style={{ textAlign: 'left', padding: '8px', color: colors.textMuted, fontWeight: '500' }}>Auto-Renewal</th>
                    )}
                    <th style={{ textAlign: 'left', padding: '8px', color: colors.textMuted, fontWeight: '500' }}>Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTableData[activeTab].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: idx !== 2 ? '1px solid rgba(45, 51, 72, 0.4)' : 'none' }}>
                      <td style={{ padding: '10px 8px', color: '#F8FAFC', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconDoc size={12} color={activeTab === 'finance' ? "#34D399" : "#818CF8"} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{row.doc}</span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ color: '#34D399', fontSize: '11px', background: 'rgba(52, 211, 153, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', color: colors.textSecondary }}>
                        {activeTab === 'finance' ? row.netGst : row.autoRenewal}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{
                          color: row.risk === 'Low' ? '#34D399' : row.risk === 'Medium' ? '#FBBF24' : '#EF4444',
                          fontSize: '11px'
                        }}>
                          ● {row.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={onGetStarted} style={{ background: '#1E2433', color: colors.text, border: '1px solid #2D3348', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IconExport size={12} /> Export entire view to Excel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clear Use Cases Section */}
      <section style={{ padding: '100px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '13px', color: colors.accentLight, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Who uses DocIQ?
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
            Optimized for detail-heavy industries
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="feature-grid">
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px', textAlign: 'left' }}>
            <h4 style={{ color: colors.accentLight, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Finance & Auditing</h4>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>Automatic Invoice Reconciliation</h3>
            <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: '1.6', margin: 0 }}>
              Audit utility bills, line-item pricing deviations, VAT details, and payment terms across thousands of supplier PDFs in a single click.
            </p>
          </div>

          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px', textAlign: 'left' }}>
            <h4 style={{ color: '#34D399', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Legal & Operations</h4>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>Instant Contract Discovery</h3>
            <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: '1.6', margin: 0 }}>
              Find hidden auto-renewal clauses, liability limits, and termination dates across hundreds of active NDAs, vendor master services agreements, or commercial leases.
            </p>
          </div>

          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px', textAlign: 'left' }}>
            <h4 style={{ color: '#FBBF24', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Talent & HR</h4>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>Resume & Skill Matrix Analysis</h3>
            <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: '1.6', margin: 0 }}>
              Summarize candidate histories, filter for highly specialized technical skills, and export comparable parameters directly into structured spreadsheets.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 32px 120px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: `linear-gradient(135deg, ${colors.surface}, #161B2E)`,
          border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '56px 32px',
        }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: 700, margin: '0 0 14px' }}>
            Stop reading PDFs one at a time.
          </h2>
          <p style={{ fontSize: '15px', color: colors.textSecondary, margin: '0 0 28px' }}>
            Upload your first document and see what your library can tell you.
          </p>
          <button onClick={onGetStarted} style={{
            background: colors.accent, color: '#fff', border: 'none', borderRadius: '10px',
            padding: '14px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif',
          }}>
            Get started free <IconArrow />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${colors.border}`, padding: '28px 32px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', maxWidth: '1280px', margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', background: colors.accent, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconDoc size={10} color="#fff" />
          </div>
          <span style={{ fontSize: '13px', color: colors.textMuted }}>DocIQ — Document Intelligence</span>
        </div>
        <span style={{ fontSize: '12px', color: colors.textMuted }}>Built by Muhammad Ammar Tahir</span>
      </footer>

      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        body {
          overflow-y: auto !important;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-grid > div { alignItems: center !important; }
          .hero-grid h1, .hero-grid p { text-align: center !important; }
          .hero-grid div { justify-content: center !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .process-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 768px) {
          .feature-grid { grid-template-columns: 1fr !important; }
        }
        a:focus-visible, button:focus-visible {
          outline: 2px solid ${colors.accentLight};
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  )
}