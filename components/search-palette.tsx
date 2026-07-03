"use client"

import { useState, useEffect, useCallback, JSX } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, BookOpen, X, ArrowRight, Command } from "lucide-react"
import { searchIndex, type SearchLesson } from "@/lib/search-data"
import { cn } from "@/lib/utils"

interface SearchPaletteProps {
  open: boolean
  onClose: () => void
}

function highlight(text: string, query: string): JSX.Element {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/20 text-accent rounded px-0.5 font-semibold not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export function SearchPalette({ open, onClose }: SearchPaletteProps): JSX.Element {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(0)
  const router = useRouter()

  const results: SearchLesson[] = query.trim().length < 1
    ? searchIndex.slice(0, 8)
    : searchIndex.filter(
        (l) =>
          l.title.toLowerCase().includes(query.toLowerCase()) ||
          l.description.toLowerCase().includes(query.toLowerCase()) ||
          l.courseTitle.toLowerCase().includes(query.toLowerCase()) ||
          l.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)

  const navigate = useCallback((lesson: SearchLesson) => {
    router.push("/courses/" + lesson.courseSlug)
    onClose()
  }, [router, onClose])

  useEffect(() => { setSelected(0) }, [query])
  useEffect(() => {
    if (!open) { setQuery(""); setSelected(0) }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === "Enter" && results[selected]) navigate(results[selected])
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, results, selected, navigate, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

          {/* Palette */}
          <motion.div
            className="relative w-full max-w-xl glass rounded-2xl shadow-2xl overflow-hidden z-10"
            initial={{ scale: 0.95, y: -10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -10, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Search size={16} className="text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search lessons, topics, courses…"
                className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                  <BookOpen size={24} className="opacity-30" />
                  <p className="text-sm">No lessons found for <strong className="text-foreground">&ldquo;{query}&rdquo;</strong></p>
                </div>
              ) : (
                <>
                  {!query && <p className="px-4 py-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Recent Courses</p>}
                  {query && <p className="px-4 py-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">{results.length} results for &ldquo;{query}&rdquo;</p>}
                  {results.map((lesson, i) => (
                    <button
                      key={lesson.courseSlug + lesson.id}
                      onClick={() => navigate(lesson)}
                      onMouseEnter={() => setSelected(i)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group",
                        selected === i ? "bg-secondary" : "hover:bg-secondary/50"
                      )}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: lesson.accentColor + "22", border: "1px solid " + lesson.accentColor + "44" }}
                      >
                        <BookOpen size={13} style={{ color: lesson.accentColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {highlight(lesson.title, query)}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {highlight(lesson.courseTitle, query)} · {lesson.category}
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        className={cn(
                          "flex-shrink-0 text-muted-foreground/30 transition-all",
                          selected === i ? "text-muted-foreground translate-x-0 opacity-100" : "opacity-0"
                        )}
                      />
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border glass">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60"><kbd className="px-1 py-0.5 rounded bg-border/50 text-code-kw text-[9px] font-mono border border-border/30">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60"><kbd className="px-1 py-0.5 rounded bg-border/50 text-code-kw text-[9px] font-mono border border-border/30">↵</kbd> open</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60"><kbd className="px-1 py-0.5 rounded bg-border/50 text-code-kw text-[9px] font-mono border border-border/30">esc</kbd> close</span>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground/50">
                <Command size={10} /> K
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
