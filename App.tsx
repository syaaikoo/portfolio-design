import React, { useState } from 'react';
import { 
  Wifi, 
  MapPin, 
  Wrench, 
  Activity, 
  Globe, 
  Server, 
  Terminal, 
  User,
  CheckCircle2,
  Construction,
  Router,
  CreditCard,
  ArrowUpRight,
  Download,
  FileCode,
  ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillChart from './components/SkillChart';
import NetworkMap from './components/NetworkMap';
import Card from './components/Card';
import MusicPlayer from './components/MusicPlayer'; // Added Import
import { INTERN_DATA, COMPANY_DATA, SKILLS_DATA } from './constants';
// @ts-ignore
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadId = async () => {
    setIsGenerating(true);
    
    // Simulate encryption delay
    setTimeout(async () => {
      const element = document.getElementById('digital-id-card');
      if (element) {
        try {
          const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            backgroundColor: '#000000',
            logging: false
          });
          
          const image = canvas.toDataURL("image/png");
          const link = document.createElement('a');
          link.href = image;
          link.download = `ID-CARD-${INTERN_DATA.idNumber}.png`;
          link.click();
        } catch (error) {
          console.error("Export failed", error);
        }
      }
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-neutral-950 text-neutral-200 selection:bg-white selection:text-black">
      
      {/* Background Music Player */}
      <MusicPlayer />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* GENERATING OVERLAY */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center backdrop-blur-md"
          >
            <div className="w-64 space-y-4">
               <div className="flex justify-between text-xs font-mono text-green-500 mb-1">
                 <span>ENCRYPTING DATA</span>
                 <span className="animate-pulse">...</span>
               </div>
               <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-green-500"
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 1.8, ease: "easeInOut" }}
                 />
               </div>
               <div className="text-[10px] text-neutral-500 font-mono text-center">
                 GENERATING SECURE CREDENTIALS (PNG)
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono mb-4 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            SYSTEM ONLINE
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-2">
            INTERNSHIP <span className="text-neutral-500">STATUS</span>
          </h1>
          <p className="text-neutral-500 font-mono text-sm md:text-base">
            ID: {INTERN_DATA.idNumber} | LOC: MOJOKERTO
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Identity & Skills */}
          <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* Identity Card */}
            <Card delay={0.1} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-b from-neutral-200 to-neutral-600 p-[2px] mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden relative group">
                   <img 
                    src="https://files.catbox.moe/ckf1b3.jpg" 
                    alt="Fa'al Aditya Purnama" 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                   />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">{INTERN_DATA.name}</h2>
              <p className="text-neutral-400 mb-4">{INTERN_DATA.role}</p>
              
              <div className="flex gap-2 w-full justify-center mb-6">
                 <div className="px-4 py-1.5 rounded-md bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <Activity size={12} />
                    {INTERN_DATA.status}
                 </div>
              </div>

              <div className="w-full border-t border-neutral-800 pt-4 mt-auto">
                 <div className="flex justify-between text-xs font-mono text-neutral-500 mb-3">
                    <span>JOINED</span>
                    <span>{INTERN_DATA.startDate}</span>
                 </div>
                 
                 {/* Export Button */}
                 <button 
                  onClick={handleDownloadId}
                  className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all border border-neutral-700 hover:border-neutral-500"
                 >
                   <Download size={12} />
                   EXPORT ID CARD
                 </button>
              </div>
            </Card>

            {/* Income / Financial Log */}
            <Card delay={0.15}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <div className="p-1.5 bg-neutral-800 rounded">
                    <CreditCard size={14} className="text-white" />
                  </div>
                  <span className="text-sm">FINANCIAL LOG</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-900/30">
                  <span>VERIFIED</span>
                  <CheckCircle2 size={10} />
                </div>
              </div>
              
              <div className="flex items-baseline gap-1 mb-1">
                 <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                   {INTERN_DATA.monthlyIncome}
                 </span>
                 <span className="text-[10px] text-neutral-500 font-mono">/MO</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                 <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                 <span>NET ALLOWANCE</span>
              </div>

              {/* Fake Transaction Breakdown */}
              <div className="space-y-2 border-t border-neutral-800 pt-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">Base Stipend</span>
                    <span className="font-mono text-neutral-300">80%</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">Transport</span>
                    <span className="font-mono text-neutral-300">20%</span>
                 </div>
                 <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mt-1">
                    <div className="w-[80%] h-full bg-neutral-500 inline-block"></div>
                    <div className="w-[20%] h-full bg-neutral-600 inline-block"></div>
                 </div>
              </div>
            </Card>

            {/* Skill Stats */}
            <Card delay={0.2}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Terminal size={16} /> SKILL METRICS
                </h3>
              </div>
              <SkillChart data={SKILLS_DATA} />
              <div className="grid grid-cols-2 gap-2 mt-4">
                {SKILLS_DATA.slice(0, 4).map((skill, i) => (
                  <div key={i} className="flex justify-between items-center text-xs border border-neutral-800 p-2 rounded bg-neutral-900/30">
                    <span className="text-neutral-400">{skill.subject}</span>
                    <span className="font-mono text-white">{skill.A}%</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Right Column: Company Info & Operations */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Company Header */}
            <Card delay={0.3} className="border-l-4 border-l-white">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <Server size={20} className="text-neutral-400" />
                    {COMPANY_DATA.name}
                  </h2>
                  <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
                    {COMPANY_DATA.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-w-[140px]">
                  {COMPANY_DATA.locations.map((loc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-500">
                      <MapPin size={10} className="text-white" />
                      {loc}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Network Interactive Map */}
            <Card delay={0.4} className="p-0 border-none bg-transparent !overflow-visible">
               <NetworkMap />
            </Card>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {COMPANY_DATA.services.map((service, idx) => {
                 let Icon = Wifi;
                 if (service.icon === 'wrench') Icon = Wrench;
                 if (service.icon === 'install') Icon = Router;

                 return (
                  <Card key={service.id} delay={0.5 + (idx * 0.1)} className="hover:bg-neutral-800/50 transition-colors cursor-default group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 group-hover:border-white transition-colors">
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="w-2 h-2 rounded-full bg-neutral-800 group-hover:bg-white transition-colors"></div>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-1">{service.title}</h3>
                    <p className="text-xs text-neutral-500 leading-normal">
                      {service.description}
                    </p>
                  </Card>
                 );
               })}
                
               {/* Quick Stat / Action Box */}
               <Card delay={0.8} className="flex flex-col justify-center bg-white text-black border-none min-h-[140px]">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={24} className="text-black" />
                    <span className="font-bold text-sm">SYSTEM OPTIMIZED</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-4">
                    All network nodes in Mojokerto area are currently operating within normal parameters.
                  </p>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-black"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold mt-1">
                    <span>UPTIME</span>
                    <span>99.9%</span>
                  </div>
               </Card>
            </div>

            {/* Footer / Credits */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1, duration: 1 }}
               className="mt-auto pt-6 border-t border-neutral-900 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600 font-mono"
            >
              <span>© 2024 PT ANDROMEGA SYSTEM</span>
              <span className="mt-2 md:mt-0">SECURE CONNECTION ESTABLISHED</span>
            </motion.div>

          </div>
        </div>
      </main>

      {/* HIDDEN ID CARD TEMPLATE FOR EXPORT */}
      <div 
        id="digital-id-card" 
        className="fixed top-0 left-0 -z-50 w-[400px] bg-white text-black p-6 font-mono"
        style={{ transform: 'translateX(-9999px)' }}
      >
        {/* Card Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tighter">ANDROMEGA</h1>
            <span className="text-[10px] tracking-widest uppercase">Network Infrastructure</span>
          </div>
          <ScanLine size={32} />
        </div>

        {/* Photo & Main Info */}
        <div className="flex gap-4 mb-6">
          <div className="w-24 h-32 bg-neutral-200 border border-black grayscale">
             <img src="https://files.catbox.moe/ckf1b3.jpg" className="w-full h-full object-cover filter grayscale contrast-125" />
          </div>
          <div className="flex flex-col justify-between py-1">
            <div>
              <span className="text-[10px] text-neutral-500 block mb-0.5">NAME</span>
              <span className="font-bold text-lg leading-none uppercase block mb-3">{INTERN_DATA.name}</span>
              
              <span className="text-[10px] text-neutral-500 block mb-0.5">ROLE</span>
              <span className="font-bold text-sm leading-none uppercase block">{INTERN_DATA.role}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block mb-0.5">ID NUMBER</span>
              <span className="font-bold text-sm bg-black text-white px-1 inline-block">{INTERN_DATA.idNumber}</span>
            </div>
          </div>
        </div>

        {/* Footer Codes */}
        <div className="border-t-2 border-black pt-4 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-wider mb-1">Authorization Level 1</span>
            <div className="flex gap-1">
              {[1,2,3,4].map(i => <div key={i} className="w-4 h-1 bg-black"></div>)}
            </div>
          </div>
          <div className="text-right">
             <div className="w-24 h-8 bg-black/10 mb-1 flex items-center justify-center">
                {/* Fake Barcode */}
                <div className="w-full h-4 flex justify-between px-2">
                   {Array.from({length: 20}).map((_,i) => (
                     <div key={i} className="w-[1px] bg-black h-full" style={{opacity: Math.random() > 0.5 ? 1 : 0}}></div>
                   ))}
                </div>
             </div>
             <span className="text-[8px] font-bold">VALID: 2024-2025</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;