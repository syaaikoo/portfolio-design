import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Activity, 
  Thermometer, 
  Cpu, 
  Users, 
  HardDrive,
  Terminal
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: {
    id: string;
    name: string;
    status: string;
    type: string;
  } | null;
}

const generateRandomLog = () => {
  const actions = ['interface', 'firewall', 'dhcp', 'system', 'ppp'];
  const messages = [
    'connection established',
    'packet dropped: rule 4',
    'DHCP assigned',
    'link down',
    'link up (1Gbps)',
    'backup created',
    'login failure',
    'RX buffer full',
    'queue updated'
  ];
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  return `${timestamp} ${actions[Math.floor(Math.random() * actions.length)]}: ${messages[Math.floor(Math.random() * messages.length)]}`;
};

const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose, nodeData }) => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    cpu: 12,
    temp: 42,
    uptime: '14d 2h 12m',
    clients: 45
  });
  const [logs, setLogs] = useState<string[]>([
    "system check... ok",
    "loading modules... done",
    "[admin@Andromega] > interface print",
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Init Data
  useEffect(() => {
    const initialData = Array.from({ length: 30 }, (_, i) => ({
      name: i,
      rx: Math.floor(Math.random() * 20) + 5,
      tx: Math.floor(Math.random() * 10) + 2,
    }));
    setTrafficData(initialData);
  }, [nodeData]);

  // Scroll logs to bottom
  useEffect(() => {
    if (isOpen) {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  // Live Update Simulation
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTrafficData(prev => {
        const newData = [...prev.slice(1), {
          name: (prev[prev.length - 1]?.name || 0) + 1,
          rx: Math.max(0, Math.floor(Math.random() * 100) + (Math.random() > 0.8 ? 50 : 0)), 
          tx: Math.max(0, Math.floor(Math.random() * 50) + 5),
        }];
        return newData;
      });

      setStats(prev => ({
        ...prev,
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() > 0.5 ? 3 : -3))),
        temp: Math.min(80, Math.max(35, prev.temp + (Math.random() > 0.5 ? 1 : -1))),
        clients: Math.max(0, prev.clients + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0))
      }));

      if (Math.random() > 0.6) {
        setLogs(prev => {
          const newLogs = [...prev, generateRandomLog()];
          if (newLogs.length > 8) newLogs.shift(); // Reduce logs for mobile performance
          return newLogs;
        });
      }

    }, 800);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !nodeData) return null;

  // Gunakan Portal agar modal dirender di document.body, menghindari masalah z-index parent
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop with darker opacity */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal Container - Responsif */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-[95%] md:w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-xl shadow-[0_0_50px_rgba(0,255,100,0.1)] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-neutral-800 bg-neutral-950 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                 <div className="relative shrink-0">
                    <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${nodeData.status === 'MAINTENANCE' ? 'bg-yellow-500' : 'bg-green-500'} z-10 relative`} />
                    <div className={`absolute inset-0 w-full h-full rounded-full ${nodeData.status === 'MAINTENANCE' ? 'bg-yellow-500' : 'bg-green-500'} animate-ping opacity-75`} />
                 </div>
                 <div className="overflow-hidden">
                   <h3 className="font-bold text-white text-xs md:text-sm tracking-wider font-mono flex flex-wrap items-center gap-2 truncate">
                     {nodeData.name}
                     <span className="hidden md:inline text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">MikroTik RouterOS v7</span>
                   </h3>
                   <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">IP: 192.168.88.{Math.floor(Math.random() * 200) + 10} | UP: {stats.uptime}</p>
                 </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-colors shrink-0">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-3 md:p-5 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar bg-neutral-900/50">
              
              {/* Traffic Chart */}
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-[10px] md:text-xs font-mono text-neutral-400">
                    <span className="flex items-center gap-2">
                      <Activity size={12} className="text-white" /> 
                      TRAFFIC <span className="hidden md:inline">(ether1)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-white">LIVE</span>
                    </span>
                 </div>
                 <div className="h-32 md:h-40 w-full bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden relative shadow-inner">
                    {/* Retro Grid Background */}
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trafficData}>
                        <defs>
                          <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <YAxis hide domain={[0, 'auto']} />
                        <Area 
                          type="basis" 
                          dataKey="rx" 
                          stroke="#10b981" 
                          fillOpacity={1} 
                          fill="url(#colorRx)" 
                          strokeWidth={2}
                          isAnimationActive={false} 
                        />
                         <Area 
                          type="basis" 
                          dataKey="tx" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#colorTx)" 
                          strokeWidth={2}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    
                    {/* Overlay Stats */}
                    <div className="absolute top-2 right-2 flex flex-col items-end pointer-events-none bg-black/40 p-1 rounded backdrop-blur-sm">
                       <span className="text-[10px] font-mono font-bold text-emerald-500 drop-shadow-md">▼ {trafficData[trafficData.length-1]?.rx} M</span>
                       <span className="text-[10px] font-mono font-bold text-blue-500 drop-shadow-md">▲ {trafficData[trafficData.length-1]?.tx} M</span>
                    </div>
                 </div>
              </div>

              {/* Stats Grid - Responsif Grid */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                 <StatBox 
                   icon={<Cpu size={12} />} 
                   label="CPU" 
                   value={`${stats.cpu}%`} 
                   color={stats.cpu > 80 ? "text-red-500" : "text-white"} 
                   barValue={stats.cpu}
                   barColor={stats.cpu > 80 ? "bg-red-500" : "bg-white"}
                 />
                 <StatBox 
                   icon={<Thermometer size={12} />} 
                   label="TEMP" 
                   value={`${stats.temp}°C`} 
                   color={stats.temp > 60 ? "text-yellow-500" : "text-white"} 
                   barValue={(stats.temp / 90) * 100}
                   barColor={stats.temp > 60 ? "bg-yellow-500" : "bg-white"}
                 />
                 <StatBox 
                   icon={<HardDrive size={12} />} 
                   label="MEM" 
                   value="1.2 GB" 
                   color="text-white" 
                   barValue={50}
                 />
                 <StatBox 
                   icon={<Users size={12} />} 
                   label="USER" 
                   value={stats.clients} 
                   color="text-white" 
                   barValue={(stats.clients / 100) * 100}
                 />
              </div>

              {/* Terminal Log */}
              <div className="flex flex-col gap-1.5">
                 <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-neutral-400">
                   <Terminal size={12} />
                   <span>SYSTEM LOGS</span>
                 </div>
                 <div className="bg-black rounded-lg border border-neutral-800 p-2 md:p-3 font-mono text-[9px] md:text-[10px] h-24 md:h-32 overflow-y-auto custom-scrollbar flex flex-col shadow-inner">
                    {logs.map((log, idx) => (
                      <div key={idx} className="text-neutral-400 hover:text-white transition-colors border-b border-neutral-900/50 pb-0.5 mb-0.5 last:border-0 truncate">
                        <span className="text-neutral-600 mr-2">{idx + 1}</span>
                        {log}
                      </div>
                    ))}
                    <div ref={logEndRef} />
                    <div className="mt-1 animate-pulse text-green-500 font-bold">_</div>
                 </div>
              </div>

            </div>

            {/* Footer Status Bar */}
            <div className="bg-neutral-950 border-t border-neutral-800 p-2 px-4 flex justify-between items-center text-[9px] md:text-[10px] font-mono text-neutral-500">
               <span>MODE: DIAGNOSTIC</span>
               <span className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                 SECURE
               </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const StatBox = ({ icon, label, value, color, barValue = 0, barColor = "bg-white" }: any) => (
  <div className="bg-neutral-900 border border-neutral-800 p-2 md:p-3 rounded-lg flex flex-col justify-between h-16 md:h-20 shadow-sm relative overflow-hidden group">
     {/* Hover glow */}
     <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
     
     <div className="flex justify-between items-start z-10">
       <span className="text-[9px] md:text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 uppercase tracking-wider">{icon} {label}</span>
     </div>
     <div className="z-10">
        <span className={`text-sm md:text-lg font-bold font-mono ${color}`}>{value}</span>
        {barValue > 0 && (
          <div className="w-full h-1 bg-neutral-800 rounded-full mt-1 md:mt-1.5 overflow-hidden">
             <motion.div 
               className={`h-full ${barColor}`} 
               initial={{ width: 0 }}
               animate={{ width: `${barValue}%` }}
               transition={{ duration: 0.5 }}
             />
          </div>
        )}
     </div>
  </div>
);

export default NetworkModal;