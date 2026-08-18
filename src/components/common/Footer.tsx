import React from 'react';
import { KolamMotif } from './KolamMotif';
import { ShieldCheck, Heart, Phone, Mail, MapPin, Globe, CheckCircle2, Lock, Sparkles, Crown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-[#4A0A17] via-[#350610] to-[#22040A] text-amber-100/90 pt-14 pb-20 lg:pb-12 border-t-2 border-amber-500/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-amber-500/20 text-center">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-amber-950/40 border border-amber-400/30 backdrop-blur-md">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1.5" />
            <span className="text-xs font-bold text-amber-100">100% ID Verified</span>
            <span className="text-[10px] text-amber-200/70">Govt ID & Mobile screening</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-amber-950/40 border border-amber-400/30 backdrop-blur-md">
            <Lock className="w-6 h-6 text-amber-400 mb-1.5" />
            <span className="text-xs font-bold text-amber-100">Strict Privacy Controls</span>
            <span className="text-[10px] text-amber-200/70">Protected phone & photo access</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-amber-950/40 border border-amber-400/30 backdrop-blur-md">
            <KolamMotif size={24} color="#F3E5AB" className="mb-1.5" />
            <span className="text-xs font-bold text-amber-100">Kongu Heritage First</span>
            <span className="text-[10px] text-amber-200/70">60+ Kootam & Gothram purity</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-amber-950/40 border border-amber-400/30 backdrop-blur-md">
            <Heart className="w-6 h-6 fill-current text-rose-400 mb-1.5" />
            <span className="text-xs font-bold text-amber-100">5,200+ Happy Vivahams</span>
            <span className="text-[10px] text-amber-200/70">Celebrated unions since 2018</span>
          </div>
        </div>

        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A1C2E] to-[#22040A] flex items-center justify-center border border-amber-400/50 shadow-md">
                <KolamMotif size={22} color="#F3E5AB" />
              </div>
              <span className="text-xl font-bold font-serif-brand tracking-wide text-amber-200">
                KONGU NILA MATRIMONY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed font-tamil">
              கொங்கு மண்டலத்தின் பாரம்பரியம், கலாச்சாரம் மற்றும் நன்மதிப்பைப் போற்றும் நம்பகமான திருமண தளம். பல்லாயிரக்கணக்கான மணமக்கள் மற்றும் குடும்பங்களின் நன்மதிப்பைப் பெற்ற சேவை.
            </p>
            <div className="pt-2 space-y-2 text-xs text-amber-200/90">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Customer Care: +91 98422 12345 / 0422 4567890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@kongunilamatrimony.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Head Office: Race Course Road, Coimbatore - 641018, Tamil Nadu</span>
              </div>
            </div>
          </div>

          {/* Column 2: Explore Matches */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-3">
              Explore Matches
            </h4>
            <ul className="space-y-2 text-xs text-amber-100/75 font-medium">
              <li>
                <button onClick={() => setCurrentTab('search')} className="hover:text-amber-200 transition">
                  Search Brides (மணப்பெண்)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('search')} className="hover:text-amber-200 transition">
                  Search Grooms (மணமகன்)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('search')} className="hover:text-amber-200 transition">
                  Kongu Vellalar Profiles
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('search')} className="hover:text-amber-200 transition">
                  Doctors & Software Engineers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('search')} className="hover:text-amber-200 transition">
                  NRI Tamil Profiles (USA, UK, SG)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('horoscope')} className="hover:text-amber-200 transition">
                  10-Porutham Horoscope Match
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Plans & VIP Services */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-3">
              Plans & Services
            </h4>
            <ul className="space-y-2 text-xs text-amber-100/75 font-medium">
              <li>
                <button onClick={() => setCurrentTab('membership')} className="hover:text-amber-200 transition">
                  Membership Plans
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('membership')} className="hover:text-amber-200 transition">
                  Assisted Matrimony VIP
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('stories')} className="hover:text-amber-200 transition">
                  Celebrated Success Stories
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('safety')} className="hover:text-amber-200 transition">
                  Trust & Safety Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('contact')} className="hover:text-amber-200 transition">
                  Branch Helplines
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Kongu Branch Centers */}
          <div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-3">
              Branch Offices
            </h4>
            <ul className="space-y-2.5 text-xs text-amber-100/75 font-medium">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span><strong>Coimbatore:</strong> DB Road, RS Puram</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span><strong>Erode:</strong> Brough Road, Erode</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span><strong>Tiruppur:</strong> Avinashi Road, Tiruppur</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span><strong>Salem:</strong> Omalur Main Road, Salem</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-200/60">
          <p>© {new Date().getFullYear()} Kongu Nila Matrimony. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentTab('safety')} className="hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => setCurrentTab('safety')} className="hover:underline">
              Terms of Use
            </button>
            <button onClick={() => setCurrentTab('safety')} className="hover:underline">
              Safety Tips
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
