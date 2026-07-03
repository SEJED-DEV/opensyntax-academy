"use client"

import { useState, useEffect, useRef, useCallback, JSX } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, CheckCircle2, Circle, BookOpen, Menu, X, ArrowLeft, User, Star, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export type Lesson = {
  id: string
  title: string
  description: string
  content: string
  duration: string
  completed?: boolean
  quiz?: QuizQuestion[]
}

export type Module = {
  id: string
  title: string
  lessons: Lesson[]
}

interface LessonPlayerProps {
  title: string
  description: string
  category: string
  accentColor?: string
  modules: Module[]
  instructor?: string
  rating?: number
  reviewCount?: number
  lastUpdated?: string
}

function InteractiveQuiz({ quiz, accentColor }: { quiz: QuizQuestion[], accentColor: string }): JSX.Element {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState<Record<number, boolean>>({})

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (showResults[qIndex]) return
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }))
  }

  const checkAnswer = (qIndex: number) => {
    if (answers[qIndex] !== undefined) {
      setShowResults(prev => ({ ...prev, [qIndex]: true }))
    }
  }

  return (
    <div className="mt-16 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle size={20} style={{ color: accentColor }} />
        <h2 className="text-xl font-bold text-foreground">Knowledge Check</h2>
      </div>
      {quiz.map((q, qIdx) => {
        const hasAnswered = showResults[qIdx]
        const isCorrect = answers[qIdx] === q.correctIndex

        return (
          <div key={qIdx} className="glass rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all">
            <p className="text-sm font-semibold text-foreground mb-5 leading-relaxed">{qIdx + 1}. {q.question}</p>
            <div className="space-y-3 pl-1">
              {q.options.map((opt, oIdx) => {
                const isSelected = answers[qIdx] === oIdx
                let optionClass = "border-border hover:bg-secondary text-muted-foreground"
                let optionStyle: React.CSSProperties = {}

                if (isSelected && !hasAnswered) {
                  optionClass = "border-2 bg-accent/10 text-foreground"
                  optionStyle = { borderColor: accentColor }
                }

                if (hasAnswered) {
                  if (oIdx === q.correctIndex) {
                    optionClass = "border-code-num bg-code-num/10 text-code-num font-medium"
                  } else if (isSelected && !isCorrect) {
                    optionClass = "border-code-kw bg-code-kw/10 text-code-kw opacity-80"
                  } else {
                    optionClass = "border-border opacity-40 text-muted-foreground"
                  }
                  optionStyle = {}
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    disabled={hasAnswered}
                    style={optionStyle}
                    className={cn("w-full text-left px-5 py-3.5 rounded-xl border transition-all text-sm", optionClass)}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start justify-between gap-4">
              {!hasAnswered ? (
                <button
                  onClick={() => checkAnswer(qIdx)}
                  disabled={answers[qIdx] === undefined}
                  className="px-6 py-2.5 rounded-lg text-xs font-bold bg-secondary tracking-wide text-foreground hover:bg-muted-foreground/20 disabled:opacity-30 transition-colors uppercase"
                >
                  Verify Answer
                </button>
              ) : (
                <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className={cn(
                    "p-5 rounded-xl text-sm border",
                    isCorrect
                      ? "bg-code-num/10 border-code-num/20 text-code-num"
                      : "bg-code-kw/10 border-code-kw/20 text-code-kw"
                  )}>
                    <p className="mb-1.5 font-bold uppercase tracking-wide text-xs">
                      {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                    </p>
                    {q.explanation && (
                      <p className="opacity-90 font-normal leading-relaxed text-xs">{q.explanation}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function LessonPlayer({
  title, description, category, accentColor = "oklch(0.72 0.17 196)", modules,
  instructor = "Sarah Drasner", rating = 4.9, reviewCount = 1250, lastUpdated = "Mar 2026"
}: LessonPlayerProps): JSX.Element {
  const allLessons = modules.flatMap((m) => m.lessons)
  const [activeId, setActiveId] = useState(allLessons[0]?.id ?? "")
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const mainRef = useRef<HTMLElement>(null)

  const handleScroll = useCallback(() => {
    const el = mainRef.current
    if (!el) return
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight - el.clientHeight
    if (scrollHeight > 0) {
      setReadingProgress(Math.min((scrollTop / scrollHeight) * 100, 100))
    }
  }, [])

  const storageKey = "opensyntax-progress-" + title.toLowerCase().replace(/\s+/g, "-")

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setCompleted(new Set(JSON.parse(saved) as string[]))
      }
    } catch { /* ignore */ }
  }, [storageKey])

  const toggle = (id: string) => setCompleted((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    if (mounted) {
      try { localStorage.setItem(storageKey, JSON.stringify(Array.from(next))) } catch { /* ignore */ }
    }
    return next
  })

  const completedCount = mounted ? completed.size : 0
  const activeLesson = allLessons.find((l) => l.id === activeId)
  const activeIdx = allLessons.findIndex((l) => l.id === activeId)
  const progress = allLessons.length > 0 ? (completedCount / allLessons.length) * 100 : 0

  const gradientStyle = { width: progress + "%", background: "linear-gradient(90deg, " + accentColor + ", oklch(0.60 0.22 295))" }
  const accentBgStyle = { background: accentColor }
  const accentTextStyle = { color: accentColor }

  return (
    <div className="flex min-h-screen pt-[60px]">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background/95 lg:hidden mt-[60px]"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ───────────────── */}
      <aside className={cn(
        "flex-shrink-0 border-r border-border glass h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden transition-all duration-300 z-40 fixed lg:sticky top-[60px] left-0 rounded-r-2xl",
        sidebarOpen ? "w-[85vw] md:w-80 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0"
      )}>
        <div className="min-w-[85vw] md:min-w-80">
          {/* Sidebar Header */}
          <div className="px-5 py-5 border-b border-sidebar-border relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={13} style={accentTextStyle} aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={accentTextStyle}>{category}</span>
              </div>
              <p className="text-xs font-semibold text-foreground leading-snug mb-1">{title}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{description}</p>

              <div className="flex flex-col gap-1.5 mb-4 text-[10px] text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-medium">
                    <User className="w-3 h-3" /> {instructor}
                  </span>
                  <span className="flex items-center gap-1 glass rounded-full px-1.5 py-0.5 text-amber-500 font-bold">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {rating}
                    <span className="text-[9px] text-muted-foreground/60 font-medium">({reviewCount})</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Updated {lastUpdated}
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-muted-foreground mb-2">
                <span>Progress</span>
                <span className="text-foreground font-medium">{completedCount}/{allLessons.length} lessons</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={gradientStyle}
                  role="progressbar"
                  aria-valuenow={completedCount}
                  aria-valuemin={0}
                  aria-valuemax={allLessons.length}
                />
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl z-0" style={accentBgStyle} />
          </div>

          {/* Module navigation */}
          <div className="px-5 pt-3 pb-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Curriculum</div>
          <nav aria-label="Course modules">
            {modules.map((mod) => (
              <div key={mod.id} className="border-b border-sidebar-border last:border-b-0">
                <p className="px-5 py-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  {mod.title}
                </p>
                {mod.lessons.map((lesson) => {
                  const isActive = lesson.id === activeId
                  const isDone = completed.has(lesson.id)
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveId(lesson.id)}
                      className={cn(
                        "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors",
                        isActive
                          ? "bg-accent/8 border-l-2"
                          : "border-l-2 border-transparent hover:bg-secondary/50"
                      )}
                      style={isActive ? { borderLeftColor: accentColor } : {}}
                    >
                      <div className={cn("mt-0.5 flex-shrink-0 transition-colors", isDone ? "text-code-num" : "text-muted-foreground/40")}>
                        {isDone ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      </div>
                      <div className="min-w-0">
                        <p className={cn("text-xs leading-snug font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                          {lesson.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">{lesson.duration}</p>
                      </div>
                      {isActive && (
                        <ChevronRight size={12} className="ml-auto mt-0.5 flex-shrink-0" style={accentTextStyle} />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* ── MAIN ───────────────────── */}
      <main ref={mainRef} onScroll={handleScroll} className="flex-1 min-w-0 px-6 md:px-10 lg:px-16 py-8 max-w-3xl overflow-y-auto relative">
        {/* Reading Progress Bar */}
        <div className="fixed top-[60px] left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
          <div
            className="h-full transition-all duration-150 ease-out rounded-r-full"
            style={{ width: readingProgress + '%', background: `linear-gradient(90deg, ${accentColor}, oklch(0.60 0.22 295))` }}
          />
        </div>
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            className="w-8 h-8 flex items-center justify-center rounded-lg glass text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-hidden">
            <Link href="/" className="hover:text-foreground transition-colors shrink-0 flex items-center gap-1">
              <ArrowLeft size={11} />Courses
            </Link>
            <ChevronRight size={11} className="shrink-0" />
            <span className="text-foreground/80 truncate max-w-[200px]">{title}</span>
            {activeLesson && (
              <>
                <ChevronRight size={11} className="shrink-0" />
                <span className="text-foreground truncate max-w-[160px]">{activeLesson.title}</span>
              </>
            )}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          {activeLesson ? (
            <motion.article
              key={activeLesson.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {/* Lesson header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                    style={{
                      background: "color-mix(in oklch, " + accentColor + " 12%, transparent)",
                      color: accentColor,
                      borderColor: "color-mix(in oklch, " + accentColor + " 28%, transparent)"
                    }}
                  >
                    {category}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {activeLesson.duration} · Lesson {activeIdx + 1} of {allLessons.length}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" style={{ letterSpacing: "-0.04em" }}>
                  {activeLesson.title}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{activeLesson.description}</p>
              </div>

              <div className="h-px bg-border mb-8" />

              {/* Lesson body */}
              <div
                className="lesson-content text-muted-foreground text-sm"
                dangerouslySetInnerHTML={{ __html: activeLesson.content }}
              />

              {/* Interactive Quiz */}
              {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                <InteractiveQuiz quiz={activeLesson.quiz} accentColor={accentColor} />
              )}

              {/* Navigation footer */}
              <div className="mt-14 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {activeIdx > 0 && (
                    <button
                      onClick={() => setActiveId(allLessons[activeIdx - 1].id)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium glass hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronLeft size={13} />Prev
                    </button>
                  )}
                  <button
                    onClick={() => toggle(activeLesson.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all",
                      completed.has(activeLesson.id)
                        ? "glass text-muted-foreground hover:text-foreground"
                        : "text-white hover:opacity-90"
                    )}
                    style={completed.has(activeLesson.id) ? {} : accentBgStyle}
                  >
                    <CheckCircle2 size={14} />
                    {completed.has(activeLesson.id) ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                </div>

                {activeIdx < allLessons.length - 1 ? (
                  <button
                    onClick={() => { toggle(activeLesson.id); setActiveId(allLessons[activeIdx + 1].id) }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold glass hover:bg-secondary/50 text-foreground transition-colors"
                  >
                    Next Lesson <ChevronRight size={13} />
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, oklch(0.72 0.17 196), oklch(0.60 0.22 295))" }}
                  >
                    ✓ Course Complete — Browse More
                  </Link>
                )}
              </div>
            </motion.article>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-64 text-muted-foreground"
            >
              <div className="text-center">
                <BookOpen size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Select a lesson from the sidebar to begin</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
