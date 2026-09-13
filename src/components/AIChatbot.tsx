import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  Check,
  ChefHat,
  GripHorizontal,
} from "lucide-react";
import {
  sendToGemini,
  getActiveApiKey,
  type ChatMessage,
} from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STARTER_PROMPTS = [
  {
    icon: "🍳",
    title: "Pantry Surprise",
    prompt: "What can I make with eggs, tomatoes, garlic, and cheese?",
  },
  {
    icon: "⏱️",
    title: "Quick 15-Min Dinner",
    prompt: "Suggest a delicious and healthy 15-minute dinner recipe.",
  },
  {
    icon: "🔄",
    title: "Baking Substitute",
    prompt: "What is the best kitchen substitute for buttermilk in pancakes?",
  },
  {
    icon: "🥗",
    title: "High-Protein Plan",
    prompt: "Suggest 3 easy high-protein dinner ideas for busy weeknights.",
  },
];

export function AIChatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "model",
      text: "👋 Hi there! I'm **Chef Hub**, your personal culinary AI assistant.\n\nAsk me for custom recipes, ingredient substitutions, meal prep strategies, or cooking tips!",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // SSR hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!mounted) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputMessage("");
    setIsLoading(true);

    const activeKey = getActiveApiKey();
    if (!activeKey) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: "model",
            text: "The culinary assistant is currently taking a short break. Please check back shortly!",
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 600);
      return;
    }

    try {
      const response = await sendToGemini(newHistory);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: response.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Error communicating with AI assistant:", err);

      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "I'm having a little trouble connecting to the kitchen right now. Please try again in a moment.",
        timestamp: new Date(),
        error: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "model",
        text: "🧹 Conversation cleared! How can Chef Hub assist your cooking today?",
        timestamp: new Date(),
      },
    ]);
  };

  // Simple Markdown-style formatter (handles headers, bold, bullets, numbered lists, linebreaks)
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Header 3 or 2
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-semibold text-foreground text-sm mt-3 mb-1 font-display">
            {renderInlineMarkdown(line.replace(/^###\s+/, ""))}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-bold text-foreground text-base mt-3 mb-1 font-display">
            {renderInlineMarkdown(line.replace(/^##\s+/, ""))}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2 key={idx} className="font-bold text-foreground text-lg mt-3 mb-1 font-display">
            {renderInlineMarkdown(line.replace(/^#\s+/, ""))}
          </h2>
        );
      }
      // Bullet list item
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-1">
            <span className="text-primary mt-1 text-xs">•</span>
            <span className="flex-1 text-xs leading-relaxed">
              {renderInlineMarkdown(line.trim().replace(/^[\*\-]\s+/, ""))}
            </span>
          </div>
        );
      }
      // Numbered list item
      const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-1">
            <span className="font-semibold text-primary text-xs shrink-0">{numberedMatch[1]}.</span>
            <span className="flex-1 text-xs leading-relaxed">
              {renderInlineMarkdown(numberedMatch[2] ?? "")}
            </span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Regular paragraph line
      return (
        <p key={idx} className="text-xs leading-relaxed my-0.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Inline formatting: **bold**, *italic*, `code`
  const renderInlineMarkdown = (content: string) => {
    // Match bold **text**
    const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1 py-0.5 text-[11px] rounded bg-muted/80 font-mono text-primary"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating & Moving Draggable AI Chatbot Button */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.15}
        whileDrag={{ scale: 1.1, cursor: "grabbing" }}
        className="fixed bottom-6 right-6 z-50 select-none"
        style={{ touchAction: "none" }}
      >
        {/* Subtle Ambient Floating Animation (only when not open) */}
        <motion.div
          animate={
            !isOpen
              ? {
                  y: [0, -7, 0],
                  transition: {
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
              : {}
          }
          className="relative group"
        >
          {/* Glowing pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/60 to-amber-500/60 blur-sm opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse pointer-events-none" />

          {/* Main Floating Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "relative flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 active:scale-95 cursor-grab active:cursor-grabbing border-2",
              isOpen
                ? "w-14 h-14 bg-card text-foreground border-primary shadow-primary/20"
                : "w-16 h-16 bg-primary text-primary-foreground border-primary-foreground/20 hover:scale-105 shadow-xl"
            )}
            title="Drag anywhere or click to chat with RecipeHub AI"
            aria-label="Toggle RecipeHub AI Chatbot"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground transition-transform duration-200 hover:rotate-90" />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <ChefHat className="w-7 h-7 text-primary-foreground" />
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: "6s" }} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 text-primary-foreground/90">
                  Chef AI
                </span>
              </div>
            )}

            {/* Online / Active status badge */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-900" />
            </span>
          </button>

          {/* Hover hint badge */}
          {!isOpen && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/95 text-foreground text-xs font-medium shadow-lg border border-border/80 whitespace-nowrap backdrop-blur-md pointer-events-none transition-all">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Ask Chef Hub</span>
              <span className="text-[10px] text-muted-foreground ml-1">· Draggable</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Floating Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={cn(
              "fixed z-50 flex flex-col bg-card/98 backdrop-blur-xl border border-border shadow-2xl rounded-3xl overflow-hidden transition-all duration-200",
              isExpanded
                ? "inset-4 md:inset-auto md:bottom-24 md:right-8 md:w-[680px] md:h-[720px] max-h-[92vh]"
                : "bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh]"
            )}
          >
            {/* Chatbot Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-gradient-to-r from-primary/10 via-background/40 to-accent/10 select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-md relative">
                  <ChefHat className="w-5 h-5" />
                  <Sparkles className="w-3 h-3 text-amber-300 absolute -bottom-0.5 -right-0.5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground">Chef Hub</h3>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Culinary AI Assistant
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1">
                {/* Clear Chat Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={handleClearChat}
                  title="Clear Conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                {/* Expand/Collapse Window */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex w-8 h-8 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                  title="Close Chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Scroll Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-muted-foreground/20">
              {messages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-start gap-2.5",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <ChefHat className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "relative group max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs",
                        isUser
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : msg.error
                          ? "bg-destructive/10 border border-destructive/20 text-destructive rounded-tl-sm"
                          : "bg-muted/70 dark:bg-muted/40 border border-border/80 text-foreground rounded-tl-sm"
                      )}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      ) : (
                        <div className="space-y-1">{renderFormattedText(msg.text)}</div>
                      )}

                      {/* Footer info: time & copy button */}
                      <div
                        className={cn(
                          "mt-1.5 flex items-center justify-between gap-3 text-[10px]",
                          isUser ? "text-primary-foreground/75" : "text-muted-foreground"
                        )}
                      >
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {!isUser && !msg.error && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-background/50 flex items-center gap-1"
                            title="Copy message"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-[9px] text-emerald-500">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="text-[9px]">Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator while waiting for response */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div className="bg-muted/70 border border-border/80 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <motion.div
                      animate={{ scale: [0.6, 1, 0.6] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                    <motion.div
                      animate={{ scale: [0.6, 1, 0.6] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-primary/80"
                    />
                    <motion.div
                      animate={{ scale: [0.6, 1, 0.6] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 rounded-full bg-primary/60"
                    />
                    <span className="text-[11px] text-muted-foreground ml-1.5 font-medium">
                      Chef Hub is cooking up a response...
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Starter Prompt Recommendations (shown if conversation is new) */}
              {messages.length <= 2 && !isLoading && (
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Quick Culinary Suggestions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STARTER_PROMPTS.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(item.prompt)}
                        className="text-left p-2.5 rounded-xl border border-border/70 hover:border-primary/50 bg-background/50 hover:bg-primary/5 transition-all text-xs group"
                      >
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>{item.icon}</span>
                          <span className="group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {item.prompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-border/70 bg-background/80 backdrop-blur-sm">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-end gap-2 bg-muted/50 rounded-2xl border border-border/80 p-1.5 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all"
              >
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask for recipe ideas, ingredients, substitutions..."
                  rows={1}
                  className="w-full resize-none bg-transparent px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none max-h-24 min-h-[36px]"
                  style={{ overflowY: inputMessage.length > 80 ? "auto" : "hidden" }}
                />

                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-8 h-8 rounded-xl shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>

              <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GripHorizontal className="w-3 h-3 text-muted-foreground/60" />
                  Press <kbd className="px-1 py-0.2 rounded bg-muted border text-[9px]">Enter</kbd> to send
                </span>
                <span>Chef Hub Assistant</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
