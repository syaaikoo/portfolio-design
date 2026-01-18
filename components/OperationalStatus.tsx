import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  ListTodo, 
  CheckSquare, 
  Square, 
  AlertTriangle,
  RotateCw,
  Sun,
  CloudRain,
  CloudLightning,
  Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './Card';

const TASKS = [
  { id: 1, text: "Splicing FO Core 12 @ Gedeg", status: "completed", time: "09:30" },
  { id: 2, text: "Config OLT Huawei (VLAN 100)", status: "completed", time: "11:15" },
  { id: 3, text: "Crimping RJ45 (50 Pcs)", status: "pending", time: "13:00" },
  { id: 4, text: "Maintenance Client @ Ngudi Kidul", status: "processing", time: "NOW" },
];

const OperationalStatus: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [weather, setWeather] = useState<{
    temp: number | null;
    humidity: number | null;
    wind: number | null;
    code: number;
    loading: boolean;
  }>({
    temp: null,
    humidity: null,
    wind: null,
    code: 0,
    loading: true
  });

  // 1. Handle Time (WIB - Asia/Jakarta)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Force Timezone to Asia/Jakarta (Mojokerto)
      const timeString = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setTime(timeString);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Real Weather Data (Open-Meteo API)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Koordinat Mojokerto: -7.4726, 112.4381
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-7.4726&longitude=112.4381&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FJakarta'
        );
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          wind: Math.round(data.current.wind_speed_10m),
          code: data.current.weather_code,
          loading: false
        });
      } catch (error) {
        console.error("Failed to fetch weather", error);
        // Keep loading false but data null to show placeholder/error state if needed
        setWeather(prev => ({ ...prev, loading: false }));
      }
    };

    fetchWeather();
    // Refresh weather every 15 minutes
    const weatherTimer = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(weatherTimer);
  }, []);

  // Helper to determine Weather Icon based on WMO Code
  const getWeatherIcon = (code: number) => {
    // Codes: https://open-meteo.com/en/docs
    if (code === 0 || code === 1) return <Sun size={80} className="text-yellow-500" />;
    if (code === 2 || code === 3) return <CloudSun size={80} className="text-neutral-400" />;
    if (code >= 45 && code <= 48) return <Cloud size={80} className="text-neutral-500" />;
    if (code >= 51 && code <= 67) return <CloudRain size={80} className="text-blue-400" />; // Drizzle/Rain
    if (code >= 80 && code <= 82) return <CloudRain size={80} className="text-blue-500" />; // Showers
    if (code >= 95) return <CloudLightning size={80} className="text-purple-500" />; // Thunderstorm
    return <CloudSun size={80} />; // Default
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* 1. Environment & Time Monitor */}
      <Card delay={0.35} className="flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           {getWeatherIcon(weather.code)}
        </div>
        
        <div className="flex justify-between items-start mb-4 z-10">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">Sector Environment</span>
            <div className="flex items-center gap-2">
               {weather.loading ? (
                 <div className="h-8 w-16 bg-neutral-800 animate-pulse rounded"></div>
               ) : (
                 <h3 className="text-2xl font-bold text-white">{weather.temp}°C</h3>
               )}
               <span className="text-xs text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">MOJOKERTO</span>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-mono text-neutral-500 block mb-1">LOCAL TIME (WIB)</span>
             <span className="text-xl font-mono text-white font-bold tracking-widest min-w-[100px] inline-block">
               {time || "--:--:--"}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-auto z-10">
           <div className="bg-neutral-950/50 p-2 rounded border border-neutral-800 flex flex-col items-center">
              <Droplets size={14} className="text-blue-400 mb-1" />
              <span className="text-[10px] text-neutral-400">HUMIDITY</span>
              <span className="text-xs font-bold text-white">
                {weather.loading ? "..." : `${weather.humidity}%`}
              </span>
           </div>
           <div className="bg-neutral-950/50 p-2 rounded border border-neutral-800 flex flex-col items-center">
              <Wind size={14} className="text-teal-400 mb-1" />
              <span className="text-[10px] text-neutral-400">WIND</span>
              <span className="text-xs font-bold text-white">
                {weather.loading ? "..." : `${weather.wind} km/h`}
              </span>
           </div>
           <div className="bg-neutral-950/50 p-2 rounded border border-neutral-800 flex flex-col items-center">
              <RotateCw size={14} className="text-orange-400 mb-1 animate-spin-slow" />
              <span className="text-[10px] text-neutral-400">SERVER</span>
              <span className="text-xs font-bold text-white">COOLING</span>
           </div>
        </div>
      </Card>

      {/* 2. Work Order / Task List */}
      <Card delay={0.4} className="min-h-[160px] flex flex-col">
         <div className="flex justify-between items-center mb-3 pb-2 border-b border-neutral-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
               <ListTodo size={16} className="text-yellow-500" />
               WORK ORDERS
            </h3>
            <span className="text-[9px] bg-yellow-900/20 text-yellow-500 px-2 py-0.5 rounded border border-yellow-900/50 animate-pulse">
               LIVE UPDATES
            </span>
         </div>

         <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
            {TASKS.map((task) => (
               <div key={task.id} className="flex items-start gap-2 group/task">
                  <div className="mt-0.5">
                     {task.status === 'completed' ? (
                        <CheckSquare size={14} className="text-green-500" />
                     ) : task.status === 'processing' ? (
                        <RotateCw size={14} className="text-blue-500 animate-spin" />
                     ) : (
                        <Square size={14} className="text-neutral-600" />
                     )}
                  </div>
                  <div className="flex-1">
                     <div className={`text-xs font-mono ${task.status === 'completed' ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
                        {task.text}
                     </div>
                     <div className="text-[9px] text-neutral-600 font-mono">
                        TS: {task.time}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </Card>
      
      {/* 3. System Alert Marquee (Full Width) */}
      <div className="md:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-lg p-2 flex items-center gap-3 overflow-hidden">
         <div className="shrink-0 flex items-center gap-1.5 px-2 border-r border-neutral-800">
            <AlertTriangle size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-500 tracking-wider">ALERT</span>
         </div>
         <div className="whitespace-nowrap overflow-hidden flex-1 relative">
            <motion.div 
               className="inline-block text-[10px] font-mono text-neutral-400"
               animate={{ x: ["100%", "-100%"] }}
               transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            >
               MONITORING SYSTEM ACTIVE /// WEATHER ALERT: {weather.loading ? "CHECKING SENSORS..." : weather.code > 50 ? "RAIN DETECTED IN SECTOR - CHECK OUTDOOR EQUIPMENT" : "CONDITIONS OPTIMAL FOR FIELD WORK"} /// FIBER CUT DETECTED AT SECTOR 4 (RESOLVED) /// PREPARING WEEKLY REPORT ///
            </motion.div>
         </div>
      </div>

    </div>
  );
};

export default OperationalStatus;