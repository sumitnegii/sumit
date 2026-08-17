import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Send, Sparkles, RefreshCw } from "lucide-react";
import { chatWithBran } from "@/lib/branFn";
import type { Message } from "@/lib/branService";
import branPortrait from "@/assets/bran-portrait.png";

const SUGGESTED_QUESTIONS = [
  "Who is Sumit?",
  "Tell me about his experience.",
  "What has he built?",
  "What technologies does he use?",
];

const INITIAL_BRAN_MESSAGE = "The record is open.\n\nAsk what you wish to know of Sumit.";

export function BranOracle() {
  const reduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: INITIAL_BRAN_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isConsulting, setIsConsulting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [displayedStreamingText, setDisplayedStreamingText] = useState("");
  const [streamIndex, setStreamIndex] = useState<number | null>(null);
  const [errorState, setErrorState] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const streamingTimerRef = useRef<number | null>(null);

  // Auto scroll to bottom when new content arrives
  const scrollToBottom = useCallback(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedStreamingText, isConsulting, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 400);
    } else {
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Progressive token streaming simulation
  const streamText = useCallback((fullText: string, targetMsgIndex: number) => {
    setIsStreaming(true);
    setStreamIndex(targetMsgIndex);
    let charIdx = 0;
    setDisplayedStreamingText("");

    const speed = Math.max(12, Math.min(24, Math.floor(1400 / fullText.length)));

    const nextChar = () => {
      if (charIdx < fullText.length) {
        // Stream in chunks of 2-3 characters for natural ink writing feel
        const chunk = fullText.slice(charIdx, charIdx + 2);
        charIdx += chunk.length;
        setDisplayedStreamingText(fullText.slice(0, charIdx));
        streamingTimerRef.current = window.setTimeout(nextChar, speed);
      } else {
        setIsStreaming(false);
        setStreamIndex(null);
        setDisplayedStreamingText("");
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[targetMsgIndex]) {
            updated[targetMsgIndex] = { ...updated[targetMsgIndex], content: fullText };
          }
          return updated;
        });
      }
    };

    nextChar();
  }, []);

  useEffect(() => {
    return () => {
      if (streamingTimerRef.current) window.clearTimeout(streamingTimerRef.current);
    };
  }, []);

  const handleSend = async (queryText?: string) => {
    const text = (queryText || input).trim();
    if (!text || isConsulting || isStreaming) return;

    setInput("");
    setErrorState(false);
    setLastQuery(text);

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsConsulting(true);

    try {
      // Query server function
      const historyForServer = newMessages.slice(-6);
      const res = await chatWithBran({
        data: {
          message: text,
          history: historyForServer,
        },
      });

      setIsConsulting(false);
      const answer = res?.answer || "The record cannot be reached at this moment.";

      if (reduced) {
        setMessages((prev) => [...prev, { role: "model", content: answer }]);
      } else {
        const nextIdx = newMessages.length;
        setMessages((prev) => [...prev, { role: "model", content: "" }]);
        streamText(answer, nextIdx);
      }
    } catch {
      setIsConsulting(false);
      setErrorState(true);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "The record cannot be reached at this moment." },
      ]);
    }
  };

  return (
    <>
      {/* ── 1. Floating Seer Control (Relic Button) ── */}
      <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close Bran Oracle" : "Consult Bran, Keeper of the Record"}
          aria-expanded={isOpen}
          className="group relative flex cursor-pointer items-center gap-2.5 rounded-full border border-[color-mix(in_oklab,var(--gold)_32%,transparent)] bg-[oklch(0.09_0.005_60_/_0.92)] py-1.5 pr-4 pl-1.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.85),0_0_16px_-4px_rgba(226,182,104,0.22)] backdrop-blur-md transition-all duration-300 hover:border-gold hover:shadow-[0_0_24px_-4px_rgba(226,182,104,0.45)] focus-visible:ring-2 focus-visible:ring-gold"
        >
          {/* Subtle cyclical perimeter gleam */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full opacity-40 group-hover:opacity-80"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(226, 182, 104, 0.35) 0%, transparent 65%)",
            }}
          />

          {/* Bran Circular Portrait */}
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[color-mix(in_oklab,var(--gold)_45%,transparent)] bg-black/60 shadow-inner">
            <img
              src={branPortrait}
              alt=""
              width={64}
              height={64}
              className="h-full w-full object-cover grayscale-[20%] transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
            />
          </div>

          {/* Label */}
          <div className="text-left">
            <span className="block font-display text-[0.68rem] tracking-[0.28em] text-gold uppercase">
              BRAN
            </span>
            <span className="block font-mono text-[0.52rem] tracking-[0.16em] text-muted-foreground uppercase">
              THE CHRONICLER
            </span>
          </div>
        </button>
      </div>

      {/* ── 2. Ancient Record Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Bran Oracle — Keeper of the Record"
            aria-modal="true"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-20 z-50 mx-auto flex h-[580px] max-h-[82vh] w-auto max-w-[420px] flex-col overflow-hidden rounded-sm border border-[color-mix(in_oklab,var(--gold)_38%,transparent)] bg-[oklch(0.09_0.005_60_/_0.96)] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.95),0_0_32px_-8px_rgba(226,182,104,0.22)] backdrop-blur-xl sm:right-7 sm:left-auto sm:w-[410px]"
          >
            {/* Corner Relic Accent Details */}
            <div className="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-gold/60" />
            <div className="pointer-events-none absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-gold/60" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-gold/60" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-gold/60" />

            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-[color-mix(in_oklab,var(--gold)_20%,transparent)] px-4 py-3.5 bg-[oklch(0.08_0.005_60_/_0.8)]">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gold/50 bg-black">
                  <img
                    src={branPortrait}
                    alt="Bran"
                    width={72}
                    height={72}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm tracking-[0.24em] text-gold uppercase">
                      BRAN
                    </h3>
                    <span className="inline-flex items-center gap-1 font-mono text-[0.52rem] tracking-[0.14em] text-emerald-400/80 uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      RECORD OPEN
                    </span>
                  </div>
                  <p className="font-mono text-[0.56rem] tracking-[0.18em] text-muted-foreground uppercase">
                    THE KEEPER OF THE RECORD
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
                aria-label="Close Bran Oracle"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Messages Stream ── */}
            <div
              ref={chatScrollRef}
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 text-[0.84rem] leading-relaxed scrollbar-thin"
            >
              {messages.map((msg, i) => {
                const isUser = msg.role === "user";
                const isCurrentStreaming = isStreaming && streamIndex === i;
                const contentToDisplay = isCurrentStreaming
                  ? displayedStreamingText
                  : msg.content;

                return (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="mt-0.5 h-6 w-6 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-black">
                        <img
                          src={branPortrait}
                          alt=""
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className={`relative max-w-[84%] rounded-sm px-3.5 py-2.5 ${
                        isUser
                          ? "border border-[color-mix(in_oklab,var(--gold)_25%,transparent)] bg-[oklch(0.14_0.01_60_/_0.8)] text-parchment"
                          : "border border-[color-mix(in_oklab,var(--gold)_15%,transparent)] bg-[oklch(0.07_0.005_60_/_0.7)] text-parchment/95"
                      }`}
                    >
                      <p className="whitespace-pre-line text-[0.82rem] leading-relaxed">
                        {contentToDisplay}
                        {isCurrentStreaming && (
                          <span
                            aria-hidden
                            className="inline-block h-3.5 w-1 bg-gold align-middle ml-1 animate-pulse"
                          />
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Consulting State */}
              {isConsulting && (
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-black">
                    <img
                      src={branPortrait}
                      alt=""
                      width={48}
                      height={48}
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.24em] text-gold/80 uppercase">
                    <span>CONSULTING THE RECORD</span>
                    <motion.div
                      className="h-px w-8 bg-gradient-to-r from-gold/20 via-gold to-gold/20"
                      animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Error Retry Option */}
              {errorState && (
                <div className="flex justify-start pl-8">
                  <button
                    type="button"
                    onClick={() => handleSend(lastQuery)}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-gold/40 bg-gold/10 px-2.5 py-1 font-mono text-[0.62rem] tracking-wider text-gold uppercase transition-colors hover:bg-gold/20"
                  >
                    <RefreshCw className="h-3 w-3" /> TRY AGAIN
                  </button>
                </div>
              )}

              {/* Suggested Inquiries on Initial Greeting */}
              {messages.length === 1 && !isConsulting && (
                <div className="mt-4 space-y-2 pt-2">
                  <p className="font-mono text-[0.58rem] tracking-[0.22em] text-gold-dim uppercase">
                    SUGGESTED INQUIRIES
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="cursor-pointer rounded-sm border border-[color-mix(in_oklab,var(--gold)_28%,transparent)] bg-[oklch(0.12_0.008_60_/_0.8)] px-2.5 py-1.5 text-left font-display text-[0.65rem] tracking-wider text-parchment/90 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                      >
                        <Sparkles className="mr-1 inline-block h-2.5 w-2.5 text-gold/70" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Input Box ── */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="border-t border-[color-mix(in_oklab,var(--gold)_20%,transparent)] bg-[oklch(0.08_0.005_60_/_0.95)] p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire of Sumit's record..."
                  disabled={isConsulting || isStreaming}
                  className="flex-1 rounded-sm border border-[color-mix(in_oklab,var(--gold)_22%,transparent)] bg-[oklch(0.06_0.004_60_/_0.9)] px-3 py-2 text-[0.82rem] text-parchment placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isConsulting || isStreaming}
                  aria-label="Send Inquiry"
                  className="cursor-pointer rounded-sm border border-gold/40 bg-gold/15 p-2 text-gold transition-colors hover:bg-gold/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
