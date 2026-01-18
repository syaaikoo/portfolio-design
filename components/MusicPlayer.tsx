import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, ShieldCheck, Play } from 'lucide-react';

const AUDIO_URL = "https://files.catbox.moe/s6sok6.m4a";

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPermission, setShowPermission] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(AUDIO_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4; // Volume 40% agar tidak kaget

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleAuthorize = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      setIsPlaying(true);
      setShowPermission(false);
    }
  };

  const handleDeny = () => {
    setShowPermission(false);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* Authorization Modal */}
      <AnimatePresence>
        {showPermission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-sm w-full bg-neutral-900 border border-neutral-700 p-6 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              {/* Decorative background line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-transparent to-green-500 opacity-50"></div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center mb-4 border border-neutral-700 shadow-inner">
                  <ShieldCheck className="text-green-500" size={28} />
                </div>
                
                <h2 className="text-lg font-bold text-white mb-2 font-mono tracking-tighter">AUDIO PROTOCOL REQ</h2>
                <p className="text-neutral-400 text-xs mb-6 font-mono leading-relaxed">
                  System requests permission to initialize background audio stream.<br/>
                  <span className="text-white font-bold bg-neutral-800 px-1 rounded mt-1 inline-block">Track: JUDAS - LADY GAGA</span>
                </p>
                
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={handleDeny}
                    className="flex-1 py-2.5 bg-transparent border border-neutral-700 text-neutral-400 font-mono text-xs hover:bg-neutral-800 rounded transition-colors"
                  >
                    DENY
                  </button>
                  <button 
                    onClick={handleAuthorize}
                    className="flex-1 py-2.5 bg-white text-black font-bold font-mono text-xs rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={12} fill="black" />
                    AUTHORIZE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Player UI (Bottom Right Widget) */}
      <AnimatePresence>
        {!showPermission && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-3 pr-4 rounded-full flex items-center gap-3 shadow-2xl group transition-all hover:border-neutral-600">
              
              {/* Spinning Disc / Visualizer */}
              <div className="relative">
                 <div className={`w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 overflow-hidden ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                    <div className="w-2 h-2 bg-neutral-900 rounded-full border border-neutral-600 z-10"></div>
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,#333_180deg,transparent_360deg)] opacity-50"></div>
                 </div>
                 {/* Equalizer Bars Overlay */}
                 {isPlaying && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end gap-[1px] h-4 w-full justify-center pointer-events-none opacity-80">
                       <motion.div animate={{ height: [2, 8, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-green-500" />
                       <motion.div animate={{ height: [6, 3, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-green-500" />
                       <motion.div animate={{ height: [3, 9, 2] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-green-500" />
                    </div>
                 )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col">
                <span className="text-[8px] font-mono text-neutral-500 leading-none mb-0.5 tracking-widest uppercase">Now Playing</span>
                <span className="text-[10px] font-bold text-white tracking-wide font-mono">JUDAS - LADY GAGA</span>
              </div>

              {/* Controls */}
              <div className="h-6 w-[1px] bg-neutral-800 mx-1"></div>
              
              <button 
                onClick={togglePlay}
                className="text-neutral-400 hover:text-white transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;