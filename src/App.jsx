import React, { useState } from 'react';
import { 
  Trophy, 
  ChevronRight, 
  X, 
  Zap,
  ExternalLink
} from 'lucide-react';
import Logo from './components/Logo';
import { siteConfig as config, withAlpha, gridFor } from './config/siteConfig';

const isExternal = (item) => /^https?:\/\//i.test(item.href || '');

export default function App() {
  const [activeModalData, setActiveModalData] = useState(null);

  const handleAction = (item) => {
    if (item.href) {
      if (isExternal(item)) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.href;
      }
    } else if (item.modalData) {
      setActiveModalData(item.modalData);
    }
  };

  const { logo, navLinks, cards, footer } = config;

  return (
    <div className="site-shell bg-surface text-ink flex flex-col selection:bg-accent selection:text-surface">
      
      {/* Top Header */}
      <header className="w-full bg-surface border-b border-slate-800/60 pt-4 pb-4 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4">

          {/* Left: empty, keeps the logo centred */}
          <div className="hidden md:block" />

          {/* Centre: logo, level with the navigation links */}
          <div className="flex justify-center">
            <Logo logo={logo} className="h-20 sm:h-24 lg:h-28" />
          </div>

          {/* Right: Customizable Navigation Links */}
          <nav className="flex flex-col items-center md:items-end justify-center space-y-1.5 text-right font-medium">
            {navLinks.map((item) => (
              <button 
                key={item.id || item.label}
                onClick={() => handleAction(item)}
                className="text-accent hover:text-accent-light hover:translate-x-[-2px] transition-all duration-200 text-sm sm:text-base tracking-wide flex items-center gap-1.5 cursor-pointer"
              >
                {item.label}
                {isExternal(item) && (
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Hero Title */}
        <div className="text-center pt-2 pb-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            {config.heading}
          </h1>
          {config.tagline && <p className="mt-2 text-sm sm:text-base text-slate-400">{config.tagline}</p>}
        </div>
      </header>

      {/* Cards: a grid that arranges itself from the number of cards (see gridFor and .cards) */}
      <main className="flex-1 min-h-0 w-full max-w-[1700px] mx-auto p-3 sm:p-4 lg:p-6">
        {cards.length === 0 ? (
          <div className="h-full min-h-[14rem] flex items-center justify-center text-center text-muted text-sm border border-dashed border-line rounded-md p-6">
            No cards configured. Set the CARDS (or STATS_URL) environment variable.
          </div>
        ) : (
          <div className="cards" data-count={cards.length} style={{ '--cols': gridFor(cards.length).cols, '--rows': gridFor(cards.length).rows }}>
            {cards.map((card) => (
              <div
                key={card.title}
                role="link"
                tabIndex={0}
                onClick={() => handleAction(card)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleAction(card)}
                style={{ '--card-border': withAlpha(card.color, 0.3), '--card-border-hover': withAlpha(card.color, 0.7) }}
                className="card-container group relative min-h-0 rounded-md overflow-hidden cursor-pointer border shadow-lg transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                {card.image && (
                  <img
                    src={card.image}
                    alt=""
                    className="card-zoom absolute inset-0 w-full h-full object-cover object-center"
                  />
                )}

                {/* Atmospheric overlays: the card colour over the photo, always dark enough for white text */}
                <div
                  className="absolute inset-0 mix-blend-multiply"
                  style={{ background: `linear-gradient(to right, ${withAlpha(card.color, 0.75)}, rgb(15 23 42 / 0.7))` }}
                />
                <div className="absolute inset-0 mix-blend-color" style={{ background: withAlpha(card.color, 0.2) }} />

                {/* Card Title and Hover Cue */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <span className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300">
                    {card.title}
                  </span>
                  {card.subtitle && (
                    <span className="mt-2 max-w-md text-sm text-white/85">{card.subtitle}</span>
                  )}
                  <span className="mt-2 text-xs sm:text-sm text-white/85 uppercase tracking-widest opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    Explore <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer info bar */}
      <footer className="w-full border-t border-slate-800/60 py-4 px-6 text-center text-xs sm:text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-[1600px] mx-auto gap-2">
        <p>{footer.text}</p>
        <p className="text-slate-500 text-xs">
          {footer.secondary}
        </p>
      </footer>

      {/* Dynamic Detail Modal */}
      {activeModalData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveModalData(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-panel border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-700/60 pb-4">
              <div>
                {activeModalData.badge && (
                  <span className="inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent/20 text-accent-light border border-accent/30 mb-2">
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
                      <div className="text-lg sm:text-xl font-bold text-accent">{s.val}</div>
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
                      {partner.logo && (
                        <div className="w-20 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-2 shadow">
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-white text-base">{partner.name}</h4>
                        <div className="text-xs text-accent font-medium">{partner.role}</div>
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
                      <Trophy className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
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
                      <Zap className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
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
                className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-surface font-semibold text-sm transition-colors shadow-lg cursor-pointer"
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
