import { motion } from 'framer-motion';
import { useState } from 'react';
import ChatWidget from '../components/ChatWidget';
import SectionHeading from '../components/ui/SectionHeading';
import { chatbotSeed } from '../services/mockData';

function ChatbotPage() {
  const [messages, setMessages] = useState(chatbotSeed);

  const handleSend = (content) => {
    const userMessage = { id: `msg-${Date.now()}`, role: 'user', content };
    const assistantReply = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content:
        'This response is mocked for now. Connect your LLM backend endpoint to return disease advice, report summaries, or treatment suggestions.',
    };

    setMessages((current) => [...current, userMessage, assistantReply]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-40">
      <SectionHeading
        eyebrow="Assistant"
        title="AgriVision chatbot"
        description="This conversational UI is built for future LLM integration and already supports a floating, collapsible experience."
      />

      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold text-slate-900">Use cases</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            'Summarize recent disease patterns across uploaded fields',
            'Explain AI report recommendations in simpler language',
            'Guide next treatment actions after a high-severity detection',
          ].map((item) => (
            <div key={item} className="rounded-3xl bg-earth-50 p-4 text-sm leading-6 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>

      <ChatWidget messages={messages} onSend={handleSend} />
    </motion.div>
  );
}

export default ChatbotPage;
