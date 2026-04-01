import { Bot, Leaf, MapPinned, Search, SendHorizontal, TriangleAlert, FileText } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.png';
import AppFrame from '../components/AppFrame';

const suggestions = [
  'Summarize spread risk for Shimla Orchard Belt',
  'Draft a farmer alert for high-severity apple scab',
  'Explain the latest report recommendations in simple language',
];

const contextChips = ['Farm', 'Crop', 'Disease', 'Alerts', 'Reports'];

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        'Hello. I can help with farm summaries, spread analysis, report explanations, alert drafting, and next-step recommendations.',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);

  const handleSend = (content = draft) => {
    if (!content.trim()) return;
    setMessages((current) => [...current, { id: Date.now(), role: 'user', content }]);
    setDraft('');
    setThinking(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content:
            'LLM response placeholder: connect your backend to return farm-aware summaries, contact suggestions, spread analysis, and alert-ready messages.',
        },
      ]);
      setThinking(false);
    }, 1000);
  };

  return (
    <AppFrame title="AgriVision Assistant" subtitle="An LLM-ready agronomy co-pilot for farms, spread intelligence, alerts, and report workflows." withChat={false}>
      <div className="grid gap-6 xl:grid-cols-[0.36fr_1fr]">
        <div className="surface p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input className="field pl-11" placeholder="Search conversations" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              ['Spread review', 'Neighbourhood heatmap summary'],
              ['Farmer alert draft', 'Communication workflow'],
              ['Weekly report briefing', 'Executive crop summary'],
            ].map(([title, subtitle], index) => (
              <div key={title} className={`rounded-2xl px-4 py-4 ${index === 0 ? 'bg-moss-pale' : 'bg-beige'}`}>
                <p className="font-medium text-text-dark">{title}</p>
                <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-text-dark p-4 text-white">
            <p className="panel-label !text-white/55">Context access</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3"><Leaf className="h-4 w-4 text-[#cfe3d1]" /> Farm and crop context</div>
              <div className="flex items-center gap-3"><MapPinned className="h-4 w-4 text-[#cfe3d1]" /> Spread heatmap insights</div>
              <div className="flex items-center gap-3"><TriangleAlert className="h-4 w-4 text-[#cfe3d1]" /> Alert queue awareness</div>
              <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-[#cfe3d1]" /> Report explanation and drafting</div>
            </div>
          </div>
        </div>

        <div className="surface flex min-h-[72vh] flex-col overflow-hidden">
          <div className="border-b border-moss/10 px-6 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} alt="AgriVision logo" className="h-12 w-12 rounded-2xl bg-white p-1 object-contain shadow-sm" />
                <div>
                  <p className="font-medium text-text-dark">AgriVision AI</p>
                  <p className="text-sm text-text-muted">LLM-ready and context-aware</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {contextChips.map((chip) => (
                  <span key={chip} className="rounded-full bg-beige px-3 py-1 text-xs font-semibold text-text-mid">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b border-moss/10 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSend(item)}
                  className="rounded-full bg-moss-pale px-3 py-2 text-xs font-semibold text-moss transition hover:bg-beige"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-7 ${
                  message.role === 'assistant' ? 'bg-moss-pale text-text-dark' : 'ml-auto bg-moss text-white'
                }`}
              >
                {message.content}
              </div>
            ))}
            {thinking && (
              <div className="inline-flex items-center gap-1 rounded-3xl bg-moss-pale px-4 py-3 text-moss">
                <span className="h-2 w-2 animate-bounce rounded-full bg-moss [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-moss [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-moss" />
              </div>
            )}
          </div>

          <div className="border-t border-moss/10 px-6 py-4">
            <div className="flex gap-3">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                className="field"
                placeholder="Ask about a farm, alert, disease spread, report, or next action..."
              />
              <button onClick={() => handleSend()} className="rounded-full bg-moss px-5 text-white">
                <SendHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export default Chat;
