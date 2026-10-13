import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ChevronRight, 
  X, 
  Zap,
  ExternalLink
} from 'lucide-react';
import { siteConfig } from './config/siteConfig';

const API_CONFIG_URL = 'https://example.org/v1/config/robotics';

export default function App() {
  const [activeModalData, setActiveModalData] = useState(null);
  const [config, setConfig] = useState(siteConfig);

  useEffect(() => {
    let isMounted = true;
    fetch(API_CONFIG_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted && data && typeof data === 'object') {
          setConfig((prev) => ({
            ...prev,
            ...data,
            branding: { ...prev.branding, ...data.branding },
            gridSection: { ...prev.gridSection, ...data.gridSection },
            footer: { ...prev.footer, ...data.footer },
            navLinks: data.navLinks || prev.navLinks
          }));
        }
      })
      .catch((err) => {
        console.warn('Could not load remote config, using default:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = (item) => {
    if (item.actionType === 'link' && item.href) {
      if (item.href.startsWith('http') || item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.href;
      }
    } else if (item.modalData) {
      setActiveModalData(item.modalData);
    }
  };

  const branding = config.branding || siteConfig.branding;
  const navLinks = config.navLinks || siteConfig.navLinks;
  const gridSection = config.gridSection || siteConfig.gridSection;
  const footer = config.footer || siteConfig.footer;

  return (
    <div className="min-h-screen bg-[#111c2e] text-slate-100 flex flex-col selection:bg-[#cbb58c] selection:text-[#111c2e]">
      
      {/* Top Header */}
      <header className="w-full bg-[#111c2e] border-b border-slate-800/60 pt-4 pb-4 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          
          {/* Left: Logo */}
          <div className="flex items-center justify-center md:justify-start w-full md:w-1/3">
            {branding.logo.href ? (
              <a 
                href={branding.logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white px-4 py-2 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center hover:shadow-lg hover:scale-105"
              >
                <img 
                  src={branding.logo.src} 
                  alt={branding.logo.alt} 
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </a>
            ) : (
              <div className="bg-white px-4 py-2 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center">
                <img 
                  src={branding.logo.src} 
                  alt={branding.logo.alt} 
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
            )}
          </div>

          {/* Center spacer */}
          <div className="hidden md:block w-full md:w-1/3" />

          {/* Right: Customizable Navigation Links */}
          <nav className="w-full md:w-1/3 flex flex-col items-center md:items-end justify-center space-y-1.5 text-right font-medium">
            {navLinks.map((item) => (
              <button 
                key={item.id || item.label}
                onClick={() => handleAction(item)}
                className="text-[#cbb58c] hover:text-[#e8d7b8] hover:translate-x-[-2px] transition-all duration-200 text-sm sm:text-base tracking-wide flex items-center gap-1.5 cursor-pointer"
              >
                {item.label}
                {item.actionType === 'link' && (item.href?.startsWith('http') || item.external) && (
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Hero Title */}
        <div className="text-center pt-8 pb-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-white/95">
            {branding.welcomeHeading}
          </h1>
        </div>
      </header>

      {/* Main Interactive Grid Section */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 h-auto lg:h-[740px]">
          
          {/* Left Column: Stacked Customizable Cards */}
          <div className="flex flex-col gap-3 sm:gap-4 h-[550px] lg:h-full">
            {gridSection.leftCards.map((card) => (
              <div 
                key={card.id || card.title}
                onClick={() => handleAction(card)}
                className={`card-container group relative flex-1 rounded-sm sm:rounded-md overflow-hidden cursor-pointer border ${card.borderColor || 'border-slate-700/50'} shadow-lg transition-all duration-500`}
              >
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="card-zoom absolute inset-0 w-full h-full object-cover object-center"
                />
                
                {/* Atmospheric overlays */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.overlayGradient || 'from-slate-950/70 to-slate-950/70'} transition-colors duration-500 mix-blend-multiply`} />
                {card.tintColor && <div className={`absolute inset-0 ${card.tintColor} mix-blend-color`} />}
                
                {/* Card Title and Hover Cue */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300">
                    {card.title}
                  </span>
                  <span className="mt-2 text-xs sm:text-sm text-slate-200/85 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    Explore <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer info bar */}
      <footer className="w-full border-t border-slate-800/60 py-4 px-6 text-center text-xs sm:text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-[1600px] mx-auto gap-2">
        <p>{footer.copyrightText}</p>
        <p className="text-slate-500 text-xs">
          {footer.secondaryText}
        </p>
      </footer>

      {/* Dynamic Detail Modal */}
      {activeModalData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveModalData(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#142137] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-700/60 pb-4">
              <div>
                {activeModalData.badge && (
                  <span className="inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#cbb58c]/20 text-[#e8d7b8] border border-[#cbb58c]/30 mb-2">
                    {activeModalData.badge}
                  </span>
                )}
                <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                  {activeModalData.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalData(null)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {activeModalData.description && (
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  {activeModalData.description}
                </p>
              )}

              {/* Stats if available */}
              {activeModalData.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {activeModalData.stats.map((s, i) => (
                    <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                      <div className="text-lg sm:text-xl font-bold text-[#cbb58c]">{s.val}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Partners list if available */}
              {activeModalData.partners && (
                <div className="space-y-3 pt-2">
                  {activeModalData.partners.map((partner, i) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                      <div className="w-20 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-2 shadow">
                        <img 
                          src={partner.logo} 
                          alt={partner.name} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-base">{partner.name}</h4>
                        <div className="text-xs text-[#cbb58c] font-medium">{partner.role}</div>
                        <p className="text-xs text-slate-400 mt-1">{partner.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Highlights / Achievements */}
              {activeModalData.highlights && (
                <div className="space-y-2 pt-2">
                  {activeModalData.highlights.map((h, i) => (
                    <div key={i} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-[#cbb58c] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-white text-sm">{h.event}</div>
                        <div className="text-xs text-emerald-400 mt-0.5">{h.result}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bullet points / Features */}
              {(activeModalData.points || activeModalData.features || activeModalData.achievements) && (
                <ul className="space-y-2 pt-2">
                  {(activeModalData.points || activeModalData.features || activeModalData.achievements).map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Zap className="w-4 h-4 text-[#cbb58c] flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-700/60 pt-4 flex justify-end">
              <button 
                onClick={() => setActiveModalData(null)}
                className="px-5 py-2 rounded-xl bg-[#cbb58c] hover:bg-[#d8c59f] text-[#111c2e] font-semibold text-sm transition-colors shadow-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
