import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronUp, SendHorizontal } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello. I can summarize farm alerts, spread patterns, reports, and next-step recommendations.',
    },
  ]);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: 'user', content: draft },
      {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'This is an LLM-ready placeholder. Connect your backend to return farm-aware agronomy guidance.',
      },
    ]);
    setDraft('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[300px]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="surface mb-3 overflow-hidden"
          >
            <div className="bg-moss px-4 py-3 text-white">
              <p className="font-medium">AgriVision Assistant</p>
              <p className="mt-1 text-xs text-white/70">Farms, alerts, spread, reports</p>
            </div>
            <div className="max-h-72 space-y-3 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    message.role === 'assistant'
                      ? 'bg-moss-pale text-text-dark'
                      : 'ml-auto bg-moss text-white'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
            <div className="border-t border-moss/10 p-3">
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                  className="field"
                  placeholder="Ask AgriVision..."
                />
                <Button className="px-4" onClick={handleSend}>
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button className="ml-auto flex" onClick={() => setOpen((value) => !value)}>
        <Bot className="h-4 w-4" />
        {open ? 'Close' : 'Chat'}
        <ChevronUp className={`h-4 w-4 transition ${open ? '' : 'rotate-180'}`} />
      </Button>
    </div>
  );
}

export default ChatWidget;
