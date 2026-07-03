"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Award, Download, Share2, AlertCircle, BookOpen } from "lucide-react"
import Link from "next/link"

const courses = [
  { slug: "web", title: "Full-Stack Web Engineering", lessons: 6 },
  { slug: "system-design", title: "System Design", lessons: 8 },
  { slug: "rust", title: "Rust & Systems Programming", lessons: 10 },
  { slug: "discord", title: "Advanced Discord Development", lessons: 5 },
  { slug: "python", title: "Python & Data Science", lessons: 6 },
  { slug: "ai-ml", title: "AI/ML Engineering", lessons: 5 },
  { slug: "typescript", title: "TypeScript Mastery", lessons: 5 },
  { slug: "devops", title: "DevOps & Cloud Engineering", lessons: 6 },
  { slug: "databases", title: "Database Engineering", lessons: 5 },
  { slug: "react-patterns", title: "Advanced React Patterns", lessons: 5 },
  { slug: "cybersecurity", title: "Cybersecurity Fundamentals", lessons: 4 },
  { slug: "blockchain", title: "Blockchain & Web3", lessons: 4 },
  { slug: "mobile", title: "Mobile Engineering", lessons: 5 },
]

export default function CertificatesPage() {
  const [mounted, setMounted] = useState(false)
  const [completedCourses, setCompletedCourses] = useState<typeof courses>([])
  const [activeCert, setActiveCert] = useState<typeof courses[0] | null>(null)
  const [studentName, setStudentName] = useState("")
  
  const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const name = localStorage.getItem("opensyntax-student-name") || "Dedicated Student"
    setStudentName(name)

    const completed: typeof courses = []
    courses.forEach(course => {
      const storageKey = `opensyntax-progress-${course.slug}`
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const finished = JSON.parse(saved)
          if (Array.isArray(finished) && finished.length === course.lessons && course.lessons > 0) {
            completed.push(course)
          }
        }
      } catch { /* ignore */ }
    })
    
    setCompletedCourses(completed)
    if (completed.length > 0) {
      setActiveCert(completed[0])
    }
  }, [])

  const handleDownload = () => {
    // Basic implementation: would normally use html2canvas or render SVG to download
    alert("Certificate download API integration coming in v3.1!")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentName(e.target.value)
    localStorage.setItem("opensyntax-student-name", e.target.value)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pt-28 pb-32">
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
            <Award size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Your Certificates
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Verify your skills and showcase your accomplishments. Upon 100% completion of any OpenSyntax learning path, your cryptographic certificate will populate here.
          </p>
        </header>

        {mounted && completedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 mt-8 glass border-2 border-dashed border-border rounded-3xl">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">No certificates yet</h3>
            <p className="text-center text-muted-foreground text-sm max-w-md mb-6">
              You haven't completed any full courses yet. Head over to the course catalog and finish a path to earn your first certificate.
            </p>
            <Link href="/courses" className="px-6 py-3 bg-foreground text-background font-bold text-sm rounded-xl hover:scale-105 transition-transform">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar List */}
            <div className="lg:w-1/3 flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Unlocked Accomplishments
              </p>
              {completedCourses.map(course => (
                <button
                  key={course.slug}
                  onClick={() => setActiveCert(course)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                    activeCert?.slug === course.slug 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "glass hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeCert?.slug === course.slug ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>

                      <Award size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold block">{course.title}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Verified Completion</p>
                    </div>
                  </div>
                </button>
              ))}
              
              <div className="mt-6 p-4 glass border-amber-500/20 rounded-xl">
                 <div className="flex items-center gap-2 mb-2 text-amber-600">
                    <AlertCircle size={14} />
                    <p className="text-xs font-bold uppercase tracking-widest">Name Update</p>
                 </div>
                 <input 
                   type="text" 
                   value={studentName}
                   onChange={handleNameChange}
                   placeholder="Enter your full name"
                   className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                 />
                 <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                   Enter the exact name you want printed on your certificates. Updating this modifies all generated documents.
                 </p>
              </div>
            </div>

            {/* Certificate Renderer */}
            <div className="lg:w-2/3">
              {activeCert && (
                <motion.div
                  key={activeCert.slug}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-6"
                >
                  {/* The SVG Certificate Container */}
                  <div 
                    ref={certRef}
                    className="relative w-full aspect-[1.414/1] bg-white text-black shadow-2xl rounded-sm overflow-hidden border border-black/10 flex flex-col items-center justify-center p-12 text-center"
                    style={{ backgroundImage: "linear-gradient(135deg, #ffffff 0%, #f8f8fb 100%)" }}
                  >
                    {/* Decorative Border */}
                    <div className="absolute inset-4 border-[3px] border-[#111] pointer-events-none" />
                    <div className="absolute inset-5 border border-[#111]/20 pointer-events-none" />
                    
                    {/* Watermark Logo */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
                       <span className="font-mono font-black text-[250px] leading-none tracking-tighter">OS</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                      <div className="mb-8 font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 border-b border-black/10 pb-4">
                        Certificate of Completion
                      </div>
                      
                      <div className="mb-2 text-sm font-semibold tracking-wide text-black/60 uppercase">
                        This proudly certifies that
                      </div>
                      
                      <div className="text-4xl md:text-5xl font-black tracking-tight mb-8 text-[#111] capitalize w-full" style={{ fontFamily: "Georgia, serif" }}>
                        {studentName}
                      </div>

                      <div className="mb-4 text-sm font-medium text-black/70 max-w-md leading-relaxed">
                        has successfully completed all modules and lessons required to master the disciplines within the
                      </div>

                      <div className="text-2xl font-bold tracking-tight text-primary mb-12">
                        {activeCert.title} Track
                      </div>

                      <div className="flex items-end justify-between w-full px-8 mt-auto">
                         <div className="flex flex-col items-center">
                            <div className="w-40 border-b border-black/80 mb-2 h-10 flex items-end justify-center pb-1">
                               <span className="font-mono font-bold text-sm tracking-widest text-[#111]">OPENSYNTAX</span>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-black/50">Issuing Authority</span>
                         </div>
                         
                         {/* Achievement Seal */}
                         <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center relative shadow-lg bg-white">
                            <div className="absolute inset-1 border border-primary/30 rounded-full" />
                            <Award className="w-10 h-10 text-primary" />
                         </div>

                         <div className="flex flex-col items-center">
                            <div className="w-40 border-b border-black/80 mb-2 h-10 flex items-end justify-center pb-1">
                               <span className="font-medium text-sm text-[#111]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-black/50">Date of Issue</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 mt-2">
                    <button 
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-xl hover:bg-secondary font-bold text-sm transition-colors"
                    >
                      <Share2 size={16} /> Share Link
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold text-sm transition-colors shadow-md"
                    >
                      <Download size={16} /> Download PDF
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
