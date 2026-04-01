import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronUp, SendHorizontal } from 'lucide-react';
import { useState } from 'react';
import { sendChatMessage } from '../services/api';
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
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!draft.trim()) return;

    const message = draft;
    setDraft('');
    setError('');
    setMessages((current) => [...current, { id: Date.now(), role: 'user', content: message }]);

    const sessionId = window.localStorage.getItem('agrivision_last_session_id');
    if (!sessionId) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Run analysis from Upload page first so chat can use disease context.',
        },
      ]);
      return;
    }

    try {
      const response = await sendChatMessage({ session_id: sessionId, message });
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.response,
        },
      ]);
    } catch {
      setError('Unable to reach backend chat API.');
    }
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
              {error && <p className="mb-2 text-xs text-rose-700">{error}</p>}
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
