import { useState, useRef, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Sun, Moon, Copy, Check, GripVertical, Info } from 'lucide-react';
import type { ComponentEntry } from '../registry';

interface DemoLayoutProps {
  components: ComponentEntry[];
}

const MIN_SIDEBAR = 200;
const MAX_SIDEBAR = 480;
const DEFAULT_SIDEBAR = 280;
const MIN_PREVIEW = 320;

export default function DemoLayout({ components }: DemoLayoutProps) {
  const [selectedId, setSelectedId] = useState(components[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'info'>('preview');
  const [activeFile, setActiveFile] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        document.documentElement.classList.contains('dark');
    }
    return true;
  });

  // Sidebar resize
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR);
  const isSidebarDragging = useRef(false);
  const sidebarDragStartX = useRef(0);
  const sidebarDragStartWidth = useRef(DEFAULT_SIDEBAR);

  // Preview resize
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const isPreviewDragging = useRef(false);
  const previewDragStartX = useRef(0);
  const previewDragStartWidth = useRef(0);

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

  // Reset file + preview width when switching components
  useEffect(() => {
    if (active?.files) {
      setActiveFile(Object.keys(active.files)[0] ?? '');
    }
    setPreviewWidth(null);
  }, [selectedId, active]);

  // ── Sidebar drag ──
  const onSidebarMouseDown = useCallback((e: React.MouseEvent) => {
    isSidebarDragging.current = true;
    sidebarDragStartX.current = e.clientX;
    sidebarDragStartWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  // ── Preview drag ──
  const onPreviewMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isPreviewDragging.current = true;
    previewDragStartX.current = e.clientX;
    previewDragStartWidth.current =
      previewContainerRef.current?.offsetWidth ?? 800;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isSidebarDragging.current) {
        const delta = e.clientX - sidebarDragStartX.current;
        const newW = Math.min(
          MAX_SIDEBAR,
          Math.max(MIN_SIDEBAR, sidebarDragStartWidth.current + delta),
        );
        setSidebarWidth(newW);
      }
      if (isPreviewDragging.current) {
        const delta = e.clientX - previewDragStartX.current;
        const newW = Math.max(MIN_PREVIEW, previewDragStartWidth.current + delta);
        setPreviewWidth(newW);
      }
    };
    const onMouseUp = () => {
      if (isSidebarDragging.current) {
        isSidebarDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
      if (isPreviewDragging.current) {
        isPreviewDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
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
      {/* ── Sidebar ── */}
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

      {/* ── Sidebar drag handle ── */}
      <div
        className="w-1 flex-shrink-0 cursor-col-resize hover:bg-blue-500/40 active:bg-blue-500/60 transition-colors group relative"
        onMouseDown={onSidebarMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-500/20" />
      </div>

      {/* ── Main content ── */}
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
                {/* Tabs */}
                <div className="flex rounded-md border border-border overflow-hidden">
                  {(['preview', 'code', 'info'] as const).map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-sm font-medium transition-colors capitalize ${
                        i > 0 ? 'border-l border-border' : ''
                      } ${
                        activeTab === tab
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {tab === 'info' ? <Info size={14} /> : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
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
              {/* ── PREVIEW TAB ── */}
              {activeTab === 'preview' && (
                <div className="p-6 min-h-full">
                  {/* Width indicator */}
                  {previewWidth && (
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                        {previewWidth}px
                      </span>
                      <button
                        onClick={() => setPreviewWidth(null)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  )}

                  {/* Resizable preview container */}
                  <div className="flex items-start gap-1">
                    <div
                      ref={previewContainerRef}
                      className="rounded-lg border border-border bg-muted/20 min-h-[400px] overflow-auto"
                      style={{
                        width: previewWidth ? `${previewWidth}px` : '100%',
                        minWidth: `${MIN_PREVIEW}px`,
                        maxWidth: '100%',
                        flexShrink: 0,
                      }}
                    >
                      <div className="p-8 flex items-start justify-center">
                        {Component && <Component />}
                      </div>
                    </div>

                    {/* Drag handle for preview resize */}
                    <div
                      className="flex-shrink-0 flex flex-col items-center justify-center h-16 self-center cursor-ew-resize group px-0.5 mt-[200px]"
                      onMouseDown={onPreviewMouseDown}
                      title="Drag to resize preview"
                    >
                      <GripVertical
                        size={16}
                        className="text-border group-hover:text-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── CODE TAB ── */}
              {activeTab === 'code' && (
                <div className="flex flex-col h-full">
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

              {/* ── INFO TAB ── */}
              {activeTab === 'info' && (
                <div className="p-8 max-w-xl">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                    Component Info
                  </h3>

                  <div className="space-y-4 mb-8">
                    <InfoField label="Name" value={active.name} />
                    <InfoField label="Slug" value={active.id} mono />
                    <InfoField label="Description" value={active.description} />
                    <InfoField label="Component Type" value="registry:ui" mono />
                  </div>

                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Demos
                  </h3>

                  <ul className="space-y-2">
                    {fileNames.map((fname) => (
                      <li
                        key={fname}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-card"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                        <span className="text-sm font-mono text-foreground/80">{fname}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* ── Info field ── */
function InfoField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
      <span className="text-xs font-medium text-muted-foreground pt-0.5">{label}</span>
      <span
        className={`text-sm text-foreground break-words ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}
