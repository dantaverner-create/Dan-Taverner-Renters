import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Send, 
  Info, 
  ShieldCheck, 
  Home, 
  Scale, 
  ChevronRight,
  Loader2,
  X,
  Download
} from 'lucide-react';
import Markdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { gemini, BrandConfig } from './services/geminiService';
import { cn } from './utils/cn';

// --- Brand Configuration ---
const brandConfig: BrandConfig = {
  companyName: 'Symmonds',
  primaryColor: '#0055ff',
  phoneticName: 'SIM-monds',
  callbackTeam: 'Symmonds Lettings Team'
};

// --- Types ---
type UserPath = 'tenant' | 'landlord' | null;
type KeyChangesView = 'tenant' | 'landlord' | null;

interface Message {
  role: 'user' | 'model';
  text: string;
}

const KeyChangesPage = ({ type, onClose }: { type: KeyChangesView, onClose: () => void }) => {
  if (!type) return null;

  const content = {
    landlord: {
      title: "Key Changes for Landlords",
      subtitle: "Essential updates for property owners and managers.",
      changes: [
        {
          title: "Section 21 Abolition",
          desc: "The 'no-fault' eviction process is being completely removed. All evictions must now be based on specific legal grounds under Section 8.",
          icon: ShieldCheck
        },
        {
          title: "Periodic Tenancy System",
          desc: "Fixed-term tenancies are abolished. All tenancies become periodic from day one, giving tenants more flexibility while requiring landlords to use new possession grounds.",
          icon: Home
        },
        {
          title: "Rent Increase Limits",
          desc: "Rent can only be increased once per year using the Section 13 process. Tenants can challenge increases they believe are above market rate.",
          icon: Scale
        },
        {
          title: "Mandatory Pet Consideration",
          desc: "Landlords cannot unreasonably refuse a tenant's request to keep a pet. However, you can require the tenant to have pet insurance.",
          icon: MessageSquare
        },
        {
          title: "Bidding War Ban",
          desc: "It is now illegal to invite, encourage, or accept offers of rent that are higher than the advertised price for a property.",
          icon: Info
        },
        {
          title: "Decent Homes & EPC Standards",
          desc: "All private rentals must now meet the Decent Homes Standard. Additionally, properties must achieve a minimum EPC rating of C by 2030, with interim requirements currently in effect.",
          icon: ShieldCheck
        }
      ]
    },
    tenant: {
      title: "Key Changes for Tenants",
      subtitle: "New protections and rights for renters in England.",
      changes: [
        {
          title: "End of No-Fault Evictions",
          desc: "You can no longer be evicted without a valid reason. Landlords must prove a specific ground for possession in court.",
          icon: ShieldCheck
        },
        {
          title: "Right to Request Pets",
          desc: "You have a legal right to request a pet. Your landlord must respond within 28 days and cannot say no without a very good reason.",
          icon: MessageSquare
        },
        {
          title: "No More Bidding Wars",
          desc: "Landlords and agents are banned from accepting rent offers above the advertised price, making the process fairer for everyone.",
          icon: Scale
        },
        {
          title: "Decent Homes Standard",
          desc: "For the first time, the private rented sector must meet a minimum quality standard, ensuring homes are safe and healthy.",
          icon: Home
        },
        {
          title: "Awaab's Law Extension",
          desc: "Strict timeframes will be introduced for landlords to investigate and fix serious hazards like damp and mould.",
          icon: Info
        }
      ]
    }
  };

  const activeContent = content[type];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[110] bg-white overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-6 py-20">
        <button 
          onClick={onClose}
          className="fixed top-8 right-8 p-3 bg-slate-100 rounded-full hover:bg-brand-yellow transition-colors z-50"
        >
          <X className="w-6 h-6 text-brand-green" />
        </button>

        <div className="mb-16">
          <div className="inline-block px-4 py-1 rounded bg-brand-yellow text-brand-green text-xs font-bold uppercase tracking-widest mb-6">
            Official 2026 Guidance
          </div>
          <h2 className="text-5xl font-serif font-bold text-brand-green mb-6 leading-tight">
            {activeContent.title}
          </h2>
          <p className="text-xl text-slate-500 font-light max-w-2xl">
            {activeContent.subtitle}
          </p>
        </div>

        <div className="space-y-12">
          {activeContent.changes.map((change, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 items-start"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                <change.icon className="w-8 h-8 text-brand-green" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-brand-green mb-3">{change.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{change.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-brand-green rounded-3xl text-white text-center">
          <h3 className="text-2xl font-serif font-bold mb-4">Have specific questions?</h3>
          <p className="text-slate-300 mb-8">Our AI Advisor can give you tailored answers based on your situation.</p>
          <button 
            onClick={() => {
              onClose();
              setTimeout(() => document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }}
            className="bg-brand-yellow text-brand-green px-8 py-4 rounded font-bold uppercase tracking-widest text-sm hover:bg-white transition-all"
          >
            Talk to the Advisor
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const LeadCaptureForm = ({ onClose }: { onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notify: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-green/40 backdrop-blur-sm"
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-brand-yellow/20 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-brand-green transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-brand-yellow w-10 h-10" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-brand-green mb-4">Thank You!</h3>
            <p className="text-slate-600">Your request has been received. One of our experts will be in touch shortly.</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-brand-green mb-2">Schedule a Call</h3>
              <p className="text-slate-500 text-sm">Speak with our expert team about the 2026 Act.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-green uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-green uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green transition-all text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-green uppercase tracking-widest mb-2">Phone Number</label>
                <input 
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green transition-all text-sm"
                  placeholder="07123 456789"
                />
              </div>
              <div className="flex items-start gap-3 py-2">
                <input 
                  type="checkbox"
                  id="notify"
                  checked={formData.notify}
                  onChange={e => setFormData({...formData, notify: e.target.checked})}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-green focus:ring-brand-green"
                />
                <label htmlFor="notify" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                  Notify me when the official Government Tenant Information Sheet is released in March.
                </label>
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-yellow text-brand-green py-4 rounded font-bold uppercase tracking-widest text-sm hover:bg-brand-green hover:text-white transition-all shadow-lg mt-4"
              >
                Request Call Back
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
};

// --- Components ---

const PathSelection = ({ onSelect }: { onSelect: (path: UserPath) => void }) => (
  <section className="py-16 px-4 bg-white border-y border-slate-100">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-brand-green mb-4">Choose Your Path</h2>
        <p className="text-slate-500">Tailor your experience to get the most relevant guidance.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <button 
          onClick={() => onSelect('tenant')}
          className="group p-10 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-brand-yellow hover:bg-white transition-all text-left shadow-sm hover:shadow-xl"
        >
          <div className="w-14 h-14 bg-brand-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Home className="text-brand-yellow w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-brand-green mb-4">I am a Tenant</h3>
          <p className="text-slate-600 mb-6">Understand your new rights regarding evictions, rent increases, and pet requests.</p>
          <div className="flex items-center gap-2 text-brand-green font-bold uppercase tracking-widest text-xs">
            Explore Tenant Rights <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        <button 
          onClick={() => onSelect('landlord')}
          className="group p-10 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-brand-yellow hover:bg-white transition-all text-left shadow-sm hover:shadow-xl"
        >
          <div className="w-14 h-14 bg-brand-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Scale className="text-brand-yellow w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-brand-green mb-4">I am a Landlord</h3>
          <p className="text-slate-600 mb-6">Learn about the new periodic tenancy system and updated grounds for possession.</p>
          <div className="flex items-center gap-2 text-brand-green font-bold uppercase tracking-widest text-xs">
            View Landlord Guidance <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  </section>
);

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });
  const targetDate = new Date('2026-05-01T00:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000 * 60 * 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-brand-yellow text-brand-green py-4 px-4 text-center border-b border-brand-green/10 shadow-lg relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-white/20 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-brand-green rounded-full animate-pulse shadow-[0_0_10px_rgba(0,74,50,0.4)]" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-brand-green">
            Countdown to Implementation
          </span>
        </div>
        
        <div className="flex gap-8 items-center">
          <div className="flex flex-col items-center min-w-[70px]">
            <div className="bg-brand-green px-4 py-2 rounded-lg shadow-inner">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-white leading-none tracking-tighter">
                {timeLeft.days}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-green mt-2">Days</span>
          </div>
          
          <div className="text-brand-green/20 font-serif text-3xl">:</div>
          
          <div className="flex flex-col items-center min-w-[70px]">
            <div className="bg-brand-green px-4 py-2 rounded-lg shadow-inner">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-white leading-none tracking-tighter">
                {timeLeft.hours}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-green mt-2">Hours</span>
          </div>
        </div>

        <div className="hidden lg:block text-[10px] font-bold text-brand-green/60 uppercase tracking-widest max-w-[200px] text-left leading-tight">
          The Renters' Rights Act 2026 takes effect May 1st
        </div>
      </div>
    </div>
  );
};

const Header = ({ isAiTalking }: { isAiTalking: boolean }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
    <CountdownTimer />
    <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3 relative">
        <AnimatePresence>
          {isAiTalking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 -m-2 rounded-full border-2 border-brand-yellow shadow-[0_0_15px_rgba(249,214,22,0.6)]"
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            />
          )}
        </AnimatePresence>
        <img 
          src="/client-logo.png" 
          alt={`${brandConfig.companyName} Logo`} 
          className="h-[50px] w-auto object-contain relative z-10"
          referrerPolicy="no-referrer"
        />
        <AnimatePresence>
          {isAiTalking && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1 ml-2"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-brand-yellow rounded-full"
                  animate={{ height: [4, 12, 4] }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-green uppercase tracking-wider">
        <a href="#hero" className="hover:text-brand-yellow transition-colors">The Act</a>
        <a href="#chat" className="hover:text-brand-yellow transition-colors">Advisor</a>
        <a href="#resources" className="hover:text-brand-yellow transition-colors">Resources</a>
      </nav>
      <button 
        onClick={() => document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' })}
        className="bg-brand-yellow text-brand-green px-6 py-2 rounded font-bold text-sm hover:bg-brand-green hover:text-white transition-all shadow-sm uppercase tracking-wider"
      >
        Get Help
      </button>
    </div>
  </header>
);

const Hero = ({ onShowChanges }: { onShowChanges: (view: KeyChangesView) => void }) => (
  <section id="hero" className="pt-52 pb-24 px-4 bg-brand-green relative overflow-hidden">
    {/* Background Image Overlay Pattern */}
    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://picsum.photos/seed/estate/1920/1080')] bg-cover bg-center grayscale" />
    
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-yellow text-brand-green text-xs font-bold uppercase tracking-widest mb-8">
          <Info className="w-4 h-4" />
          New Renters Rights act, effective May 1st 2026
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1] mb-8 tracking-tight">
          Definitive answers for <span className="text-brand-yellow italic">landlords and tenants.</span>
        </h1>
        <p className="text-xl text-slate-100 mb-10 leading-relaxed max-w-xl font-light">
          The Renters' Rights Act 2026 is the biggest shake-up to the private rented sector in decades. 
          Understand your rights with expert guidance from {brandConfig.companyName}.
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-brand-yellow text-brand-green px-10 py-5 rounded font-bold hover:bg-white transition-all shadow-xl flex items-center gap-2 group uppercase tracking-widest text-sm"
          >
            Ask the Advisor
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3 px-8 py-5 rounded bg-white/10 border border-white/20 backdrop-blur-sm shadow-sm">
            <ShieldCheck className="text-brand-yellow w-6 h-6" />
            <span className="text-sm font-bold text-white uppercase tracking-widest">Official Guidance</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {[
          { 
            title: "Key Changes for Landlords", 
            desc: "Learn about the new periodic tenancy system and updated grounds for possession.",
            view: 'landlord' as const,
            icon: Scale
          },
          { 
            title: "Key Changes for Tenants", 
            desc: "Understand your new rights regarding evictions, rent increases, and pet requests.",
            view: 'tenant' as const,
            icon: Home
          }
        ].map((item, i) => (
          <motion.button 
            key={i}
            onClick={() => onShowChanges(item.view)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="p-10 bg-white/95 backdrop-blur-md rounded border-b-4 border-brand-yellow shadow-2xl hover:translate-y-[-4px] transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-6">
              <item.icon className="w-12 h-12 text-brand-green" />
              <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center group-hover:bg-brand-yellow transition-colors">
                <ChevronRight className="w-6 h-6 text-brand-green" />
              </div>
            </div>
            <h3 className="font-serif font-bold text-brand-green text-3xl mb-4">{item.title}</h3>
            <p className="text-lg text-slate-600 leading-relaxed">{item.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  </section>
);

const VoiceAdvisor = ({ onTalkingStateChange, onShowLeadForm }: { 
  onTalkingStateChange: (isTalking: boolean) => void,
  onShowLeadForm: () => void
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlaying = useRef(false);

  const startVoice = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const sessionPromise = gemini.connectLive(brandConfig, {
        onopen: () => {
          setIsConnected(true);
          setIsConnecting(false);
          sessionPromise.then(session => {
            startMic(session);
            // Trigger immediate introduction
            session.sendClientContent({
              turns: [{
                role: 'user',
                parts: [{ text: `Please introduce yourself exactly as follows: 'Hello! I’m your Renters’ Rights Act expert from ${brandConfig.phoneticName}. Whether you’re a tenant or a landlord, I’m here to help you navigate the changes coming on May 1st. How can I help you today?'` }]
              }],
              turnComplete: true
            });
          });
        },
        onmessage: async (message) => {
          // Handle tool calls
          if (message.toolCall) {
            for (const call of message.toolCall.functionCalls) {
              if (call.name === 'showLeadCaptureForm') {
                onShowLeadForm();
                // Send response back to model
                sessionRef.current?.sendToolResponse({
                  functionResponses: [{
                    name: 'showLeadCaptureForm',
                    response: { success: true },
                    id: call.id
                  }]
                });
              }
            }
          }

          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio) {
            const binaryString = atob(base64Audio);
            const bytes = new Int16Array(binaryString.length / 2);
            for (let i = 0; i < bytes.length; i++) {
              bytes[i] = (binaryString.charCodeAt(i * 2 + 1) << 8) | binaryString.charCodeAt(i * 2);
            }
            audioQueue.current.push(bytes);
            if (!isPlaying.current) playNext();
          }
          if (message.serverContent?.interrupted) {
            audioQueue.current = [];
            currentSourceRef.current?.stop();
            isPlaying.current = false;
            onTalkingStateChange(false);
          }
        },
        onerror: (err) => {
          console.error("Voice error:", err);
          setError("Failed to connect to voice advisor.");
          stopVoice();
        },
        onclose: () => {
          stopVoice();
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setError("Could not access microphone or connect.");
      setIsConnecting(false);
    }
  };

  const startMic = async (session: any) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        session.sendRealtimeInput({
          media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      setIsListening(true);
    } catch (err) {
      console.error("Mic error:", err);
      setError("Microphone access denied.");
      stopVoice();
    }
  };

  const playNext = async () => {
    if (audioQueue.current.length === 0 || !audioContextRef.current) {
      isPlaying.current = false;
      onTalkingStateChange(false);
      return;
    }

    isPlaying.current = true;
    onTalkingStateChange(true);
    const pcmData = audioQueue.current.shift()!;
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }

    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);
    const source = audioContextRef.current.createBufferSource();
    currentSourceRef.current = source;
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      if (currentSourceRef.current === source) {
        currentSourceRef.current = null;
      }
      playNext();
    };
    source.start();
  };

  const stopVoice = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    processorRef.current?.disconnect();
    currentSourceRef.current?.stop();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    sessionRef.current?.close();
    
    setIsConnected(false);
    setIsConnecting(false);
    setIsListening(false);
    audioQueue.current = [];
    isPlaying.current = false;
    onTalkingStateChange(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isConnected ? stopVoice : startVoice}
        disabled={isConnecting}
        className={cn(
          "relative flex items-center gap-3 px-10 py-5 rounded font-bold transition-all shadow-xl overflow-hidden uppercase tracking-widest text-sm min-w-[280px] justify-center",
          isConnected 
            ? "bg-red-600 text-white hover:bg-red-700" 
            : "bg-brand-yellow text-brand-green hover:bg-brand-green hover:text-white"
        )}
      >
        <div className="relative flex items-center justify-center">
          {isConnecting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isConnected ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <MicOff className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Mic className="w-5 h-5" />
            </motion.div>
          )}
        </div>

        <span className="relative z-10">
          {isConnecting ? "Connecting..." : isConnected ? "Listening..." : "Speak to an advisor"}
        </span>
        
        {isConnected && (
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-white/30"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
          />
        )}
      </button>

      {error && <p className="text-xs text-red-500 font-bold uppercase tracking-wider">{error}</p>}
      
      {isConnected && (
        <div className="flex items-center gap-3">
          <div className="flex gap-1 items-end h-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-brand-yellow rounded-full"
                animate={{ height: [4, 16, 4] }}
                transition={{ 
                  duration: 0.6, 
                  repeat: Infinity, 
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          <p className="text-xs text-brand-green font-bold uppercase tracking-widest animate-pulse">
            Live AI Connection Active
          </p>
        </div>
      )}
    </div>
  );
};

const ChatInterface = ({ userPath, onSelectPath, onTalkingStateChange, onShowLeadForm }: { 
  userPath: UserPath, 
  onSelectPath: (path: UserPath) => void,
  onTalkingStateChange: (isTalking: boolean) => void,
  onShowLeadForm: () => void
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hello! I'm your UK Renters' Rights Advisor from ${brandConfig.companyName}. How can I help you understand the 2026 Act today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tenantQuestions = [
    "How do I request a pet?",
    "What happens to my fixed-term contract on May 1st?",
    "How much notice do I need to give to move out?",
    "Can my landlord still use Section 21?"
  ];

  const landlordQuestions = [
    "How do I use Ground 1A to sell my property?",
    "What information sheet do I need to give existing tenants?",
    "How often can I increase the rent?",
    "What are the penalties for non-compliance?"
  ];

  const suggestedQuestions = userPath === 'tenant' ? tenantQuestions : userPath === 'landlord' ? landlordQuestions : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const messageToSend = textOverride || input.trim();
    if (!messageToSend || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await gemini.chat(messageToSend, brandConfig, history);
      
      if (response.functionCalls) {
        for (const call of response.functionCalls) {
          if (call.name === 'showLeadCaptureForm') {
            onShowLeadForm();
          }
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not connect to the advisor. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTranscript = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString('en-GB');
    
    doc.setFontSize(18);
    doc.setTextColor(0, 74, 50); // brand-green
    doc.text(brandConfig.companyName, 20, 20);
    
    doc.setFontSize(14);
    doc.text("Renters' Rights Advisor Transcript", 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${date}`, 20, 40);
    
    let y = 55;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - (margin * 2);

    messages.forEach((msg) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(msg.role === 'user' ? 0 : 0, msg.role === 'user' ? 0 : 74, msg.role === 'user' ? 0 : 50);
      const label = msg.role === 'user' ? 'You:' : 'Advisor:';
      doc.text(label, margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(msg.text, maxWidth);
      doc.text(lines, margin, y);
      y += (lines.length * 5) + 10;
    });

    // Add Disclaimer at the end
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    doc.setDrawColor(249, 214, 22); // brand-yellow
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    const disclaimer = "Disclaimer: This tool provides general information based on the UK Renters' Rights Act 2026 for educational purposes only. It is not legal advice and does not create a solicitor-client relationship. Laws can change; always verify specific details with official Gov.uk guidance or a qualified legal professional before taking action.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, maxWidth);
    doc.text(disclaimerLines, margin, y);

    doc.save(`${brandConfig.companyName}-Transcript-${new Date().getTime()}.pdf`);
  };

  return (
    <section id="chat" className="py-24 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-brand-green mb-6 tracking-tight">Expert Advisor</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-10 text-lg">
            Get instant answers to your questions about the new legislation. 
            Available via text or live voice.
          </p>
          <VoiceAdvisor onTalkingStateChange={onTalkingStateChange} onShowLeadForm={onShowLeadForm} />
        </div>

        <div className="bg-white rounded border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[700px]">
          {/* Chat Header */}
          <div className="px-10 py-6 bg-brand-green flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-yellow rounded flex items-center justify-center shadow-inner">
                <Scale className="text-brand-green w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-lg">Renters' Rights AI</h3>
                <p className="text-[10px] text-brand-yellow font-bold uppercase tracking-[0.2em]">{brandConfig.companyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse" />
              <span className="text-[10px] text-white font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95"
          >
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] p-6 rounded shadow-sm text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-brand-green text-white rounded-tr-none" 
                    : "bg-slate-50 border-l-4 border-brand-yellow text-slate-800 rounded-tl-none"
                )}>
                  <div className="markdown-body">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border-l-4 border-brand-yellow p-6 rounded rounded-tl-none shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-green" />
                </div>
              </div>
            )}
            
            {/* Suggested Questions */}
            <AnimatePresence>
              {suggestedQuestions.length > 0 && messages.length === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-2 pt-4"
                >
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-brand-green hover:border-brand-yellow hover:bg-slate-50 transition-all shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                  <button 
                    onClick={() => onSelectPath(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Reset Path
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={downloadTranscript}
                disabled={messages.length <= 1}
                className="flex items-center gap-2 text-[10px] font-bold text-brand-green uppercase tracking-widest hover:text-brand-yellow transition-colors disabled:opacity-30"
              >
                <Download className="w-3 h-3" />
                Download Transcript
              </button>
            </div>
            <div className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about evictions, pets, or bidding wars..."
                className="w-full pl-8 pr-20 py-5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green transition-all text-sm font-medium"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 p-4 bg-brand-green text-brand-yellow rounded hover:bg-brand-green/90 disabled:opacity-50 transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-6 uppercase tracking-widest font-bold">
              AI-generated advice. For critical legal matters, please consult our solicitors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-brand-green text-slate-300 py-20 px-4 border-t-8 border-brand-yellow">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
      <div className="col-span-2">
        <div className="flex items-center gap-3 mb-8">
          <img 
            src="/client-logo.png" 
            alt={`${brandConfig.companyName} Logo`} 
            className="h-[50px] w-auto object-contain brightness-0 invert"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="text-sm leading-relaxed max-w-md font-light">
          Established professionals providing expert guidance on the Renters' Rights Act 2026. 
          Our mission is to empower the property sector with clear, authoritative AI-assisted support.
        </p>
      </div>
      <div>
        <h4 className="text-white font-serif font-bold mb-6 text-lg">Quick Links</h4>
        <ul className="space-y-3 text-sm uppercase tracking-widest font-bold">
          <li><a href="#" className="hover:text-brand-yellow transition-colors">Home</a></li>
          <li><a href="#hero" className="hover:text-brand-yellow transition-colors">The Act</a></li>
          <li><a href="#chat" className="hover:text-brand-yellow transition-colors">Advisor</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-serif font-bold mb-6 text-lg">Legal</h4>
        <ul className="space-y-3 text-sm uppercase tracking-widest font-bold">
          <li><a href="#" className="hover:text-brand-yellow transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-brand-yellow transition-colors">Terms of Use</a></li>
          <li><a href="#" className="hover:text-brand-yellow transition-colors">Disclaimer</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10">
      <p className="text-[11px] leading-relaxed text-slate-400 max-w-4xl mx-auto text-center italic">
        Disclaimer: This tool provides general information based on the UK Renters' Rights Act 2026 for educational purposes only. It is not legal advice and does not create a solicitor-client relationship. Laws can change; always verify specific details with official Gov.uk guidance or a qualified legal professional before taking action.
      </p>
    </div>
    <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/10 text-center text-[10px] uppercase tracking-[0.3em] font-bold">
      &copy; 2026 {brandConfig.companyName} Renters' Rights Advisor.
    </div>
  </footer>
);

export default function App() {
  const [userPath, setUserPath] = useState<UserPath>(null);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [keyChangesView, setKeyChangesView] = useState<KeyChangesView>(null);

  const handlePathSelect = (path: UserPath) => {
    setUserPath(path);
    document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <style>{`
        :root {
          --color-brand-green: ${brandConfig.primaryColor};
        }
      `}</style>
      <Header isAiTalking={isAiTalking} />
      <main>
        <Hero onShowChanges={setKeyChangesView} />
        <PathSelection onSelect={handlePathSelect} />
        <ChatInterface 
          userPath={userPath} 
          onSelectPath={setUserPath} 
          onTalkingStateChange={setIsAiTalking}
          onShowLeadForm={() => setShowLeadForm(true)}
        />
      </main>
      <Footer />

      <AnimatePresence>
        {showLeadForm && (
          <LeadCaptureForm onClose={() => setShowLeadForm(false)} />
        )}
        {keyChangesView && (
          <KeyChangesPage type={keyChangesView} onClose={() => setKeyChangesView(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
