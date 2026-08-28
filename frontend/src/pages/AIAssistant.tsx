import { useState, useMemo, useRef, useEffect } from 'react';
import { Sparkles, Send, TrendingUp, AlertTriangle, Package, Truck, Users, Wheat, Lightbulb, Bot } from 'lucide-react';
import { useAgriData } from '@/lib/hooks';
import { formatNumber, formatCurrency, formatWeight } from '@/lib/format';
import { ORDER_STATUS_META, DELIVERY_STATUS_META, HARVEST_STATUS_META } from '@/lib/status';
import { Skeleton } from '@/components/ui';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  insights?: Insight[];
}

interface Insight {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  color: string;
}

const SUGGESTED = [
  'Which crop had the highest production this season?',
  'Which deliveries are currently delayed?',
  'How much revenue have we earned so far?',
  'Which farmers have maize available to fulfil orders?',
  'What needs my attention today?',
];

export function AIAssistant() {
  const { data, loading } = useAgriData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const greeting = useMemo<Message | null>(() => {
    if (!data) return null;
    return {
      role: 'assistant',
      content: `Hi! I'm your AgriFlow assistant. I've analyzed your cooperative's data — you have ${data.farmers.length} farmers, ${data.orders.length} orders, and ${data.deliveries.length} deliveries. Ask me anything about your operations.`,
    };
  }, [data]);

  const analyze = (question: string): Message => {
    if (!data) return { role: 'assistant', content: 'I cannot access data right now.' };
    const q = question.toLowerCase();

    // Highest production crop
    if (q.includes('highest production') || q.includes('top crop') || q.includes('best crop') || q.includes('most produced')) {
      const byCrop = new Map<string, number>();
      data.harvests.forEach((h) => {
        const y = h.status === 'harvested' ? h.actual_yield_kg : h.expected_yield_kg;
        byCrop.set(h.crop?.name ?? '', (byCrop.get(h.crop?.name ?? '') ?? 0) + (y || 0));
      });
      const sorted = Array.from(byCrop.entries()).sort((a, b) => b[1] - a[1]);
      const top = sorted[0];
      return {
        role: 'assistant',
        content: `${top[0]} has the highest production this season with ${formatNumber(top[1])} kg total yield. Here's the full breakdown:`,
        insights: sorted.slice(0, 5).map(([label, value]) => ({ icon: Wheat, label, value: `${formatNumber(value)} kg`, color: 'text-brand-600' })),
      };
    }

    // Delayed deliveries
    if (q.includes('delay') || q.includes('late') || q.includes('behind schedule')) {
      const now = Date.now();
      const delayed = data.deliveries.filter((d) => d.status !== 'delivered' && d.estimated_delivery && new Date(d.estimated_delivery).getTime() < now);
      if (delayed.length === 0) {
        return { role: 'assistant', content: 'Good news — no deliveries are currently delayed. All active deliveries are on track.' };
      }
      return {
        role: 'assistant',
        content: `${delayed.length} delivery${delayed.length > 1 ? 's are' : ' is'} delayed past the estimated delivery time:`,
        insights: delayed.map((d) => ({
          icon: AlertTriangle,
          label: `${d.order?.crop?.name} → ${d.delivery_location ?? ''}`,
          value: `ETA was ${new Date(d.estimated_delivery!).toLocaleDateString()}`,
          color: 'text-red-500',
        })),
      };
    }

    // Revenue
    if (q.includes('revenue') || q.includes('earn') || q.includes('income') || q.includes('money')) {
      const delivered = data.orders.filter((o) => o.status === 'delivered');
      const revenue = delivered.reduce((s, o) => s + o.quantity_kg * o.unit_price, 0);
      const pipeline = data.orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).reduce((s, o) => s + o.quantity_kg * o.unit_price, 0);
      return {
        role: 'assistant',
        content: `You've earned ${formatCurrency(revenue)} from ${delivered.length} delivered orders. You have ${formatCurrency(pipeline)} in potential revenue from active orders.`,
        insights: [
          { icon: TrendingUp, label: 'Revenue Earned', value: formatCurrency(revenue), color: 'text-brand-600' },
          { icon: Package, label: 'Pipeline Value', value: formatCurrency(pipeline), color: 'text-sky-600' },
          { icon: Users, label: 'Active Buyers', value: `${new Set(data.orders.map((o) => o.buyer_id)).size}`, color: 'text-sun-600' },
        ],
      };
    }

    // Farmers with specific crop available
    if (q.includes('available') || q.includes('fulfil') || q.includes('fulfill') || q.includes('stock')) {
      const cropMatch = data.crops.find((c) => q.includes(c.name.toLowerCase()));
      if (cropMatch) {
        const available = data.harvests.filter((h) => h.crop_id === cropMatch.id && (h.status === 'harvested' || h.status === 'ready'));
        if (available.length === 0) {
          return { role: 'assistant', content: `No farmers currently have ${cropMatch.name} available. Check back after the next harvest.` };
        }
        return {
          role: 'assistant',
          content: `${available.length} farmer${available.length > 1 ? 's have' : ' has'} ${cropMatch.name} available:`,
          insights: available.map((h) => ({
            icon: Users,
            label: h.farmer?.name ?? '',
            value: `${formatNumber(h.status === 'harvested' ? h.actual_yield_kg : h.expected_yield_kg)} kg · ${HARVEST_STATUS_META[h.status].label}`,
            color: 'text-brand-600',
          })),
        };
      }
      // General stock
      const stock = data.harvests.filter((h) => h.status === 'harvested' || h.status === 'ready');
      return {
        role: 'assistant',
        content: `Here's the available stock across all crops:`,
        insights: stock.map((h) => ({
          icon: Package,
          label: `${h.crop?.name} — ${h.farmer?.name}`,
          value: `${formatNumber(h.status === 'harvested' ? h.actual_yield_kg : h.expected_yield_kg)} kg`,
          color: 'text-brand-600',
        })),
      };
    }

    // Attention / summary
    if (q.includes('attention') || q.includes('today') || q.includes('summary') || q.includes('overview') || q.includes('focus')) {
      const pending = data.orders.filter((o) => o.status === 'pending');
      const ready = data.harvests.filter((h) => h.status === 'ready');
      const inTransit = data.deliveries.filter((d) => d.status === 'in_transit');
      const now = Date.now();
      const delayed = data.deliveries.filter((d) => d.status !== 'delivered' && d.estimated_delivery && new Date(d.estimated_delivery).getTime() < now);
      const points: string[] = [];
      if (pending.length > 0) points.push(`${pending.length} order${pending.length > 1 ? 's' : ''} need confirmation`);
      if (ready.length > 0) points.push(`${ready.length} crop${ready.length > 1 ? 's are' : ' is'} ready for harvest`);
      if (inTransit.length > 0) points.push(`${inTransit.length} delivery${inTransit.length > 1 ? 'ies are' : ' is'} in transit`);
      if (delayed.length > 0) points.push(`${delayed.length} delayed delivery${delayed.length > 1 ? 'ies need' : 'y needs'} attention`);
      return {
        role: 'assistant',
        content: points.length > 0 ? `Here's what needs your attention:\n\n${points.map((p) => `• ${p}`).join('\n')}` : 'Everything looks good — no urgent items need your attention today.',
        insights: [
          { icon: AlertTriangle, label: 'Pending Orders', value: `${pending.length}`, color: 'text-sun-600' },
          { icon: Wheat, label: 'Ready to Harvest', value: `${ready.length}`, color: 'text-brand-600' },
          { icon: Truck, label: 'In Transit', value: `${inTransit.length}`, color: 'text-indigo-500' },
          ...(delayed.length > 0 ? [{ icon: AlertTriangle, label: 'Delayed', value: `${delayed.length}`, color: 'text-red-500' }] : []),
        ],
      };
    }

    // Default
    return {
      role: 'assistant',
      content: `I can help with questions about crop production, farmer availability, order status, deliveries, and revenue. Try one of the suggested questions, or ask about a specific crop, farmer, or order.`,
    };
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text };
    const response = analyze(text);
    setMessages((m) => [...m, userMsg, response]);
    setInput('');
  };

  if (loading || !greeting) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-sky-600 flex items-center justify-center shadow-sm">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-earth-900">AI Assistant</h1>
          <p className="text-earth-500 text-sm">Ask questions about your cooperative's operations</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="card flex flex-col" style={{ height: '60vh' }}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Greeting */}
          <ChatBubble msg={greeting} />

          {messages.map((msg, i) => (
            <ChatBubble key={i} msg={msg} />
          ))}
        </div>

        {/* Suggested questions */}
        {messages.length === 0 && (
          <div className="px-5 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-earth-400 mb-2">
              <Lightbulb size={14} /> Suggested questions
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-earth-50 text-earth-700 border border-earth-200 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-earth-100">
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Ask about production, orders, deliveries..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
            />
            <button onClick={() => send(input)} disabled={!input.trim()} className="btn-primary px-4">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isUser ? 'bg-earth-200' : 'bg-gradient-to-br from-brand-500 to-sky-600'}`}>
        {isUser ? <Users size={16} className="text-earth-600" /> : <Sparkles size={16} className="text-white" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div className={`rounded-2xl px-4 py-3 text-sm ${isUser ? 'bg-brand-600 text-white' : 'bg-earth-50 text-earth-800'}`}>
          {msg.content.split('\n').map((line, i) => <p key={i} className={line.startsWith('•') ? 'ml-2' : ''}>{line}</p>)}
        </div>
        {msg.insights && msg.insights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {msg.insights.map((ins, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-earth-200">
                <ins.icon size={18} className={ins.color} />
                <div className="min-w-0">
                  <div className="text-xs text-earth-500 font-medium truncate">{ins.label}</div>
                  <div className="text-sm font-bold text-earth-800 truncate">{ins.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
