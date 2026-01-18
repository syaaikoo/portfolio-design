import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Activity, 
  Thermometer, 
  Cpu, 
  Users, 
  Wifi, 
  HardDrive,
  Clock,
  Terminal,
  AlertCircle
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
    'DHCP assigned 192.168.88.' + Math.floor(Math.random() * 255),
    'link down',
    'link up (1Gbps)',
    'backup created',
    'login failure for user admin',
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
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Live Update Simulation
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // 1. Update Traffic Graph
      setTrafficData(prev => {
        const newData = [...prev.slice(1), {
          name: (prev[prev.length - 1]?.name || 0) + 1,
          rx: Math.max(0, Math.floor(Math.random() * 100) + (Math.random() > 0.8 ? 50 : 0)), // Random spikes
          tx: Math.max(0, Math.floor(Math.random() * 50) + 5),
        }];
        return newData;
      });

      // 2. Update Hardware Stats
      setStats(prev => ({
        ...prev,
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() > 0.5 ? 3 : -3))),
        temp: Math.min(80, Math.max(35, prev.temp + (Math.random() > 0.5 ? 1 : -1))),
        clients: Math.max(0, prev.clients + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0))
      }));

      // 3. Random Log Injection
      if (Math.random() > 0.6) {
        setLogs(prev => {
          const newLogs = [...prev, generateRandomLog()];
          if (newLogs.length > 15) newLogs.shift(); // Keep only last 15 logs
          return newLogs;
        });
      }

    }, 800); // Faster refresh rate for "live" feel

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!nodeData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${nodeData.status === 'MAINTENANCE' ? 'bg-yellow-500' : 'bg-green-500'} z-10 relative`} />
                    <div className={`absolute inset-0 w-full h-full rounded-full ${nodeData.status === 'MAINTENANCE' ? 'bg-yellow-500' : 'bg-green-500'} animate-ping opacity-75`} />
                 </div>
                 <div>
                   <h3 className="font-bold text-white text-sm tracking-wider font-mono flex items-center gap-2">
                     {nodeData.name}
                     <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">MikroTik RouterOS v7.1.2</span>
                   </h3>
                   <p className="text-[10px] text-neutral-500 font-mono mt-0.5">IP: 192.168.88.{Math.floor(Math.random() * 200) + 10} | UPTIME: {stats.uptime}</p>
                 </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Body (Scrollable if needed) */}
            <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar">
              
              {/* Traffic Chart */}
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                    <span className="flex items-center gap-2">
                      <Activity size={14} className="text-white" /> 
                      INTERFACE TRAFFIC <span className="text-neutral-600">(ether1-gateway)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-white">LIVE</span>
                    </span>
                 </div>
                 <div className="h-40 w-full bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden relative shadow-inner">
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
                          isAnimationActive={true}
                          animationDuration={500}
                        />
                         <Area 
                          type="basis" 
                          dataKey="tx" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#colorTx)" 
                          strokeWidth={2}
                          isAnimationActive={true}
                          animationDuration={500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    
                    {/* Overlay Stats */}
                    <div className="absolute top-2 right-2 flex flex-col items-end pointer-events-none">
                       <span className="text-[10px] font-mono font-bold text-emerald-500 drop-shadow-md">▼ {trafficData[trafficData.length-1]?.rx} Mbps</span>
                       <span className="text-[10px] font-mono font-bold text-blue-500 drop-shadow-md">▲ {trafficData[trafficData.length-1]?.tx} Mbps</span>
                    </div>
                 </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                 <StatBox 
                   icon={<Cpu size={14} />} 
                   label="CPU LOAD" 
                   value={`${stats.cpu}%`} 
                   color={stats.cpu > 80 ? "text-red-500" : "text-white"} 
                   barValue={stats.cpu}
                   barColor={stats.cpu > 80 ? "bg-red-500" : "bg-white"}
                 />
                 <StatBox 
                   icon={<Thermometer size={14} />} 
                   label="TEMPERATURE" 
                   value={`${stats.temp}°C`} 
                   color={stats.temp > 60 ? "text-yellow-500" : "text-white"} 
                   barValue={(stats.temp / 90) * 100}
                   barColor={stats.temp > 60 ? "bg-yellow-500" : "bg-white"}
                 />
                 <StatBox 
                   icon={<HardDrive size={14} />} 
                   label="MEMORY USAGE" 
                   value="1024 / 2048 MB" 
                   color="text-white" 
                   barValue={50}
                 />
                 <StatBox 
                   icon={<Users size={14} />} 
                   label="ACTIVE CLIENTS" 
                   value={stats.clients} 
                   color="text-white" 
                   barValue={(stats.clients / 100) * 100}
                 />
              </div>

              {/* Terminal Log */}
              <div className="flex flex-col gap-1.5">
                 <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                   <Terminal size={12} />
                   <span>SYSTEM LOGS</span>
                 </div>
                 <div className="bg-black rounded-lg border border-neutral-800 p-3 font-mono text-[10px] h-32 overflow-y-auto custom-scrollbar flex flex-col shadow-inner">
                    {logs.map((log, idx) => (
                      <div key={idx} className="text-neutral-400 hover:text-white transition-colors border-b border-neutral-900/50 pb-0.5 mb-0.5 last:border-0">
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
            <div className="bg-neutral-950 border-t border-neutral-800 p-2 px-4 flex justify-between items-center text-[10px] font-mono text-neutral-500">
               <span>MODE: DIAGNOSTIC</span>
               <span className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                 SECURE CONNECTION
               </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const StatBox = ({ icon, label, value, color, barValue = 0, barColor = "bg-white" }: any) => (
  <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg flex flex-col justify-between h-20 shadow-sm relative overflow-hidden group">
     {/* Hover glow */}
     <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
     
     <div className="flex justify-between items-start z-10">
       <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 uppercase tracking-wider">{icon} {label}</span>
     </div>
     <div className="z-10">
        <span className={`text-lg font-bold font-mono ${color}`}>{value}</span>
        {barValue > 0 && (
          <div className="w-full h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
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