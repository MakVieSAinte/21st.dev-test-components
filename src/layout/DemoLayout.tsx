import { useState, useRef, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Sun, Moon, Copy, Check } from 'lucide-react';
import type { ComponentEntry } from '../registry';

interface DemoLayoutProps {
  components: ComponentEntry[];
}

const MIN_SIDEBAR = 200;
const MAX_SIDEBAR = 480;
const DEFAULT_SIDEBAR = 280;

export default function DemoLayout({ components }: DemoLayoutProps) {
  const [selectedId, setSelectedId] = useState(components[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [activeFile, setActiveFile] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        document.documentElement.classList.contains('dark');
    }
    return true;
  });
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(DEFAULT_SIDEBAR);

  const active = components.find(c => c.id === selectedId);

  // Sync theme with DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // When component changes, reset active file to first file
  useEffect(() => {
    if (active?.files) {
      setActiveFile(Object.keys(active.files)[0] ?? '');
    }
  }, [selectedId, active]);

  // Drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      const newWidth = Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, dragStartWidth.current + delta));
      setSidebarWidth(newWidth);
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleCopy = async () => {
    const content = active?.files[activeFile] ?? '';
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Component = active?.component;
  const fileNames = active ? Object.keys(active.files) : [];
  const currentCode = active?.files[activeFile] ?? '';

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 border-r border-border bg-card flex flex-col h-screen sticky top-0"
        style={{ width: sidebarWidth }}
      >
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-foreground/10 flex items-center justify-center">
              <span className="text-xs font-bold">21</span>
            </div>
            <h1 className="text-sm font-semibold tracking-tight">21st.dev</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Component Showcase</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Components
          </p>
          {components.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedId(c.id);
                setActiveTab('preview');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md mb-1 transition-colors text-sm ${
                selectedId === c.id
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'hover:bg-muted text-foreground/80 hover:text-foreground'
              }`}
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.description}</p>
            </button>
          ))}
        </nav>
      </aside>

      {/* Drag handle */}
      <div
        className="w-1 flex-shrink-0 cursor-col-resize hover:bg-blue-500/40 active:bg-blue-500/60 transition-colors group relative"
        onMouseDown={onMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-500/20" />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {active && (
          <>
            {/* Header */}
            <div className="border-b border-border px-6 py-4 flex items-start justify-between gap-4 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold">{active.name}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{active.description}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                {/* Preview / Code tabs */}
                <div className="flex rounded-md border border-border overflow-hidden">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-border ${
                      activeTab === 'code'
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    Code
                  </button>
                </div>

                {/* Theme toggle */}
                <button
                  onClick={() => setIsDark(d => !d)}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'preview' ? (
                <div className="p-8 min-h-full">
                  <div className="rounded-lg border border-border bg-muted/20 p-8 min-h-[400px] flex items-start justify-center">
                    {Component && <Component />}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* File tabs + copy button */}
                  <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-card flex-shrink-0">
                    <div className="flex gap-1">
                      {fileNames.map((fname) => (
                        <button
                          key={fname}
                          onClick={() => setActiveFile(fname)}
                          className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                            activeFile === fname
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          {fname}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border border-border hover:bg-muted transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Syntax highlighter */}
                  <div className="flex-1 overflow-auto">
                    <SyntaxHighlighter
                      language="tsx"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        minHeight: '100%',
                        fontSize: '13px',
                        lineHeight: '1.6',
                      }}
                      showLineNumbers
                      lineNumberStyle={{ opacity: 0.4, minWidth: '2.5em' }}
                    >
                      {currentCode}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
