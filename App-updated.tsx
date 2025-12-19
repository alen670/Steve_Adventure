import React, { useState, useEffect } from 'react';
import { AdventureStat } from './types';
import { StatsBoard } from './components/StatsBoard';
import { Journal } from './components/Journal';
import { Button } from './components/Button';
import { Heart, Drumstick, Zap, Map, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

// Background images array - add your image filenames here
const BACKGROUND_IMAGES = [
  '/images/minecraft-background.jpg',
  '/images/minecraft-bg-1.jpg',
  '/images/minecraft-bg-2.jpg',
  '/images/minecraft-bg-3.jpg',
  '/images/minecraft-bg-4.jpg',
];

export default function App() {
  const [hearts, setHearts] = useState(8.5);
  const [displayHearts, setDisplayHearts] = useState(8.5);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [showChristmasModal, setShowChristmasModal] = useState(false);

  // Keyboard event listener for 'E' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        setIsInventoryOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isInventoryOpen) {
        setIsInventoryOpen(false);
      }
      if (e.key === 'Escape' && showChristmasModal) {
        setShowChristmasModal(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isInventoryOpen, showChristmasModal]);

  // Auto-rotate background images
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 10000); // Change every 10 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // Smooth animation for heart values
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setDisplayHearts((prev) => {
        const diff = hearts - prev;
        
        // Snap if close enough to avoid infinite loop
        if (Math.abs(diff) < 0.01) {
          return hearts;
        }
        
        // Linear interpolation for smooth easing (adjust 0.1 for speed)
        return prev + diff * 0.1;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    if (displayHearts !== hearts) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [hearts, displayHearts]);

  // Synthetic "Oof" / Damage sound effect
  const playDamageSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Simulate a retro "hit" sound: low pitch, sawtooth wave, quick decay
      osc.type = 'sawtooth';
      
      // Pitch drop from 120Hz to 40Hz mimics a heavy impact
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

      // Volume envelope: start loud, fade out quickly
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const initialStats: AdventureStat[] = [
    { name: '速度', value: 95, max: 100, color: '#3b82f6' }, // Blue for speed
    { name: '肾上腺素', value: 88, max: 100, color: '#ef4444' }, // Red
    { name: '模糊度', value: 92, max: 100, color: '#a855f7' }, // Purple
    { name: '狼的兴奋度', value: 100, max: 100, color: '#eab308' }, // Gold
  ];

  const handlePrevBg = () => {
    setCurrentBgIndex((prev) => (prev - 1 + BACKGROUND_IMAGES.length) % BACKGROUND_IMAGES.length);
    setIsAutoPlay(false);
  };

  const handleNextBg = () => {
    setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    setIsAutoPlay(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay((prev) => !prev);
  };

  return (
    <div className="min-h-screen text-stone-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Minecraft Landscape Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${BACKGROUND_IMAGES[currentBgIndex]})`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Background Controls */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
        {/* Navigation Buttons */}
        <div className="flex gap-2 bg-stone-800/90 backdrop-blur-md border-2 border-stone-600 p-2 rounded-lg shadow-xl">
          <button
            onClick={handlePrevBg}
            className="p-2 bg-green-600 hover:bg-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all text-white rounded"
            title="上一张背景"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={toggleAutoPlay}
            className="p-2 bg-yellow-600 hover:bg-yellow-500 border-b-4 border-yellow-800 active:border-b-0 active:translate-y-1 transition-all text-white rounded"
            title={isAutoPlay ? '暂停自动播放' : '开启自动播放'}
          >
            {isAutoPlay ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button
            onClick={handleNextBg}
            className="p-2 bg-green-600 hover:bg-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all text-white rounded"
            title="下一张背景"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Page Indicators */}
        <div className="flex gap-1 justify-center bg-stone-800/90 backdrop-blur-md border-2 border-stone-600 p-2 rounded-lg">
          {BACKGROUND_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentBgIndex(index);
                setIsAutoPlay(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBgIndex 
                  ? 'bg-green-500 w-4' 
                  : 'bg-stone-500 hover:bg-stone-400'
              }`}
              title={`背景 ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-stone-800/90 backdrop-blur-md border-b-4 border-black p-4 shadow-lg animate-slideDown">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-green-600 border-2 border-green-800 shadow-inner"></div>
             <h1 className="mc-font text-white text-xs md:text-sm tracking-widest text-shadow-sm">
               史蒂夫_现实版.EXE
             </h1>
          </div>
          <div className="flex gap-4 items-center">
             <div className="flex gap-1">
               {Array.from({ length: 10 }).map((_, i) => {
                 const fill = Math.max(0, Math.min(1, displayHearts - i));
                 
                 return (
                   <div key={i} className="relative w-4 h-4">
                     <Heart 
                       size={16} 
                       className="text-stone-800 fill-stone-700 absolute top-0 left-0" 
                     />
                     <div 
                       className="absolute top-0 left-0 overflow-hidden"
                       style={{ width: `${fill * 100}%` }}
                     >
                        <Heart 
                          size={16} 
                          className="text-red-600 fill-red-500 min-w-[16px] min-h-[16px]" 
                        />
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow z-10 p-4 md:p-8 max-w-6xl mx-auto w-full animate-fadeIn">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-12 animate-slideUp">
          
          {/* Image Container */}
          <div className="w-full md:w-1/2 relative group animate-scaleIn">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-200 animate-pulse"></div>
            <div className="relative border-8 border-white shadow-2xl bg-gray-200 overflow-hidden rounded-sm rotate-1 md:-rotate-2 hover:rotate-0 transition-transform duration-300">
               <img 
                 src="/images/steve-adventure.jpg" 
                 alt="史蒂夫和狼在奔跑"
                 className="w-full h-auto object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500 blur-[1px] hover:blur-0"
                 onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600?text=Steve+Running'; }}
               />
               <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm p-2 text-white mc-font text-[10px] border border-white/20">
                 视角：区块加载中...
               </div>
            </div>
          </div>

          {/* Intro Text */}
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="mc-font text-2xl md:text-4xl leading-relaxed text-shadow-lg">
              现实 <span className="text-green-500">解禁</span>
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed">
              当服务器崩溃，你在 4K 分辨率中醒来。
              没有工作台，没有重生点，只有我和我最好的朋友在逃离名为"责任"的可怕概念。
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-stone-800 p-3 border-2 border-stone-600 flex items-center gap-2">
                <Drumstick size={20} className="text-orange-500" />
                <span className="mc-font text-xs">饥饿值：85%</span>
              </div>
              <div className="bg-stone-800 p-3 border-2 border-stone-600 flex items-center gap-2">
                <Zap size={20} className="text-yellow-400" />
                <span className="mc-font text-xs">疾跑：开启</span>
              </div>
              <div className="bg-stone-800 p-3 border-2 border-stone-600 flex items-center gap-2">
                 <Map size={20} className="text-blue-400" />
                 <span className="mc-font text-xs">生物群系：郊区</span>
              </div>
            </div>

            <Button 
              onClick={() => {
                playDamageSound();
                setHearts(prev => Math.max(0, prev - 1.0));
              }} 
              variant="danger"
            >
               承受掉落伤害
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-slideUp" style={{ animationDelay: '0.2s' }}>
           <div className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
             <StatsBoard stats={initialStats} />
           </div>
           
           <div className="bg-stone-800/90 backdrop-blur-md border-4 border-stone-600 p-4 shadow-xl flex flex-col justify-center items-center text-center space-y-4 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="mc-font text-yellow-400 text-sm">物品栏</h3>
                <button
                  onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                  className="mc-font text-xs px-2 py-1 bg-green-600 text-white border-2 border-green-800 hover:bg-green-500 transition-colors"
                >
                  {isInventoryOpen ? '关闭' : '打开'} (E)
                </button>
              </div>
              
              {!isInventoryOpen ? (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: '🥩', label: '熟牛肉' },
                      { icon: '🗺️', label: '地图' },
                      { icon: '⛏️', label: '镐子' },
                      { icon: '🎅', label: '圣诞帽' }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className="w-12 h-12 bg-[#8b8b8b] border-2 border-[#373737] border-r-[#ffffff] border-b-[#ffffff] shadow-inner flex items-center justify-center hover:bg-[#a0a0a0] transition-all duration-200 cursor-pointer transform hover:scale-110 active:scale-95"
                        title={item.label}
                      >
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-stone-400 text-xs mt-2 italic">按 'E' 打开完整物品栏</p>
                </>
              ) : (
                <div className="w-full">
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {[
                      { icon: '🥩', label: '熟牛肉', count: 16 },
                      { icon: '🗺️', label: '地图', count: 1 },
                      { icon: '⛏️', label: '钻石镐', count: 1 },
                      { icon: '🎅', label: '圣诞帽', count: 1, special: true },
                      { icon: '🎁', label: '礼物', count: 3 },
                      { icon: '🪓', label: '斧头', count: 1 },
                      { icon: '⚔️', label: '剑', count: 1 },
                      { icon: '🛡️', label: '盾牌', count: 1 },
                      { icon: '🏹', label: '弓', count: 1 },
                      { icon: '🧪', label: '药水', count: 8 },
                      { icon: '🍞', label: '面包', count: 32 },
                      { icon: '🪵', label: '木头', count: 64 },
                      { icon: '⛏️', label: '石镐', count: 1 },
                      { icon: '🔦', label: '火把', count: 64 },
                      { icon: '📖', label: '书', count: 5 }
                    ].map((item, i) => (
                      <div 
                        key={i}
                        onClick={item.special ? () => setShowChristmasModal(true) : undefined}
                        className={`relative w-16 h-16 bg-[#8b8b8b] border-2 border-[#373737] border-r-[#ffffff] border-b-[#ffffff] shadow-inner flex flex-col items-center justify-center hover:bg-[#a0a0a0] transition-all duration-200 cursor-pointer transform hover:scale-110 active:scale-95 ${
                          item.special ? 'ring-2 ring-yellow-400 animate-pulse' : ''
                        }`}
                        title={item.label}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        {item.count && (
                          <span className="absolute bottom-1 right-1 mc-font text-[8px] text-white drop-shadow-md">
                            {item.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-stone-400 text-xs italic">点击圣诞帽查看惊喜 🎄</p>
                </div>
              )}
           </div>
        </div>

        {/* AI Journal Section */}
        <section className="mb-16 animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-8">
              <h2 className="mc-font text-2xl text-white mb-2">铭刻于星辰</h2>
              <p className="text-stone-400">本地日记：手动记录并按日期查看你的冒险日志（已移除远程接口）。</p>
            </div>
          <Journal />
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a]/90 backdrop-blur-md p-8 text-center border-t-4 border-green-900 z-10">
        <p className="mc-font text-[#555] text-xs">
          与 Mojang 无关。只是一个为了生存奔跑的粉丝。
        </p>
      </footer>

      {/* Christmas Modal */}
      {showChristmasModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowChristmasModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#c6b284] border-8 border-[#5e4b35] p-6 max-w-2xl w-full shadow-2xl animate-scaleIn">
            {/* Close Button */}
            <button
              onClick={() => setShowChristmasModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-red-600 hover:bg-red-500 text-white mc-font text-xs border-2 border-red-800 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
            
            <div className="bg-[#fcf3d1] p-8 text-center space-y-6">
              {/* Title */}
              <h2 className="mc-font text-2xl text-[#5e4b35] mb-4 animate-bounce">
                🎄 圣诞快乐！ 🎄
              </h2>
              
              {/* Steve Christmas Image */}
              <div className="relative border-4 border-[#5e4b35] shadow-xl bg-white overflow-hidden">
                <img 
                  src="/images/steve-christmas.jpg" 
                  alt="Steve的圣诞祝福"
                  className="w-full h-auto"
                  onError={(e) => { 
                    e.currentTarget.src = 'https://via.placeholder.com/600x400/8b4513/ffffff?text=Steve+Merry+Christmas!+%F0%9F%8E%85%F0%9F%8E%84'; 
                  }}
                />
              </div>
              
              {/* Message */}
              <div className="bg-[#e8d7c3] border-2 border-[#5e4b35] p-4">
                <p className="font-serif text-[#3e2b15] text-lg leading-relaxed italic">
                  "嘿！我是史蒂夫。<br/>
                  在这个方块化的圣诞节，<br/>
                  愿你的世界充满欢乐，<br/>
                  背包永远装满礼物！<br/>
                  🎁 Merry Blockmas! 🎁"
                </p>
              </div>
              
              {/* Action Button */}
              <Button 
                onClick={() => setShowChristmasModal(false)}
                className="mx-auto"
              >
                🎅 收下祝福
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
