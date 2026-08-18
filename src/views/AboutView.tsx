import React from 'react';
import { KolamMotif } from '../components/common/KolamMotif';
import { useMatrimony } from '../context/MatrimonyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Heart,
  ShieldCheck,
  Crown,
  Users,
  Compass,
  Award,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Building,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AboutViewProps {
  setCurrentTab?: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setCurrentTab }) => {
  const { openRegistrationModal, openAssistedModal } = useMatrimony();
  const { t, language } = useLanguage();

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500/40">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-kolam-pattern" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            <KolamMotif size={16} color="#F3E5AB" />
            <span className="font-tamil">எங்கள் வரலாறு மற்றும் நோக்கம்</span>
            <span className="opacity-40">•</span>
            <span>Since 2018</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-brand text-amber-100 tracking-tight leading-tight">
            Preserving Heritage, Uniting Families
          </h1>

          <p className="text-base sm:text-xl text-amber-200/90 max-w-2xl mx-auto leading-relaxed">
            Kongu Nila Matrimony is the premier matrimonial institution dedicated to the Kongu Vellalar and Tamil community worldwide.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7A1C2E] dark:text-amber-400">
              <KolamMotif size={16} color="#7A1C2E" />
              <span>Our Sacred Mission</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-serif-brand text-stone-900 dark:text-amber-100 leading-tight">
              Rooted in Tradition, Powered by Modern Verification
            </h2>

            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-tamil">
              கொங்கு நாட்டின் பாரம்பரியம், நற்பண்புகள் மற்றும் குடும்ப மதிப்பீடுகளைப் போற்றிப் பாதுகாத்து, இன்றைய நவீன தலைமுறைக்கு ஏற்றவாறு நம்பிக்கையான வரன்களை இணைப்பதே எங்கள் தலையாய நோக்கம்.
            </p>

            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Founded by senior community elders and matrimonial counselors in Coimbatore, we identified that families needed a trusted space free from superficial dating platforms, spam profiles, and unverified data. Every profile on Kongu Nila undergoes rigorous Government ID verification, Kootam confirmation, and direct parental consent.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-300/50">
                <strong className="text-2xl font-bold text-[#7A1C2E] dark:text-amber-300 block">15,000+</strong>
                <span className="text-xs text-stone-600 dark:text-stone-400">Registered Kongu Profiles</span>
              </div>
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-300/50">
                <strong className="text-2xl font-bold text-rose-700 dark:text-rose-400 block">5,200+</strong>
                <span className="text-xs text-stone-600 dark:text-stone-400">Celebrated Vivahams</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80"
              alt="Traditional South Indian Kongu Vivaham"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3B0712]/90 via-transparent to-black/20" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#7A1C2E]/90 backdrop-blur-md rounded-2xl border border-amber-400/40 text-white">
              <p className="text-sm font-bold text-amber-100">"A bond blessed by heritage and pure values"</p>
              <p className="text-xs text-amber-200/80 font-tamil mt-1">கொங்கு பாரம்பரிய முறைப்படி திருமணம்</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gradient-to-b from-[#FAF7F2] via-amber-50/50 to-[#FAF7F2] dark:from-[#140C0E] dark:via-[#1A0F12] dark:to-[#140C0E] py-16 border-y border-[#EFE6DA] dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
              The Four Pillars of Our Trust
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-tamil">
              எங்கள் சேவையின் நான்கு தூண்கள்
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-amber-100">100% Verification</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-tamil">
                அனைத்து வரன்களும் ஆதார் மற்றும் தொலைபேசி மூலம் நேரில் சரிபார்க்கப்படுகின்றன.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-amber-100">Kootam Purity</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-tamil">
                கொங்கு மண்டலத்தின் 60+ கூட்டப் பிரிவுகள் மற்றும் கோத்திர முறைப்படி முறையான வழிகாட்டல்.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-amber-100">Family Dignity</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-tamil">
                பெற்றோர்கள் மற்றும் குடும்பத்தினரின் கண்ணியத்தைப் பாதுகாக்கும் தனிப்பட்ட பாதுகாப்பு.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-amber-100">VIP Relationship Mgmt</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-tamil">
                மூத்த திருமண ஆலோசகர்களின் நேரடி வழிகாட்டல் மற்றும் குடும்ப சந்திப்பு ஒருங்கிணைப்பு.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Centers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
            Our Regional Centers
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-tamil">
            கொங்கு மண்டலத்தின் முக்கிய நகரங்களில் நேரடி சேவை மையங்கள்
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#7A1C2E] dark:text-amber-400 font-bold text-lg">
              <Building className="w-5 h-5" /> Coimbatore (Head Office)
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              42/1, Race Course Road, Near Thomas Park, Coimbatore - 641018.
            </p>
            <p className="text-xs font-mono font-bold text-stone-800 dark:text-amber-200">
              Tel: 0422 4567890 / +91 98422 12345
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#7A1C2E] dark:text-amber-400 font-bold text-lg">
              <Building className="w-5 h-5" /> Erode Branch
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              112, Brough Road, Near Clock Tower, Erode - 638001.
            </p>
            <p className="text-xs font-mono font-bold text-stone-800 dark:text-amber-200">
              Tel: 0424 2223344 / +91 98422 12346
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#7A1C2E] dark:text-amber-400 font-bold text-lg">
              <Building className="w-5 h-5" /> Tiruppur Branch
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              88, Avinashi Road, Kumar Nagar, Tiruppur - 641603.
            </p>
            <p className="text-xs font-mono font-bold text-stone-800 dark:text-amber-200">
              Tel: 0421 2456789 / +91 98422 12347
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#7A1C2E] dark:text-amber-400 font-bold text-lg">
              <Building className="w-5 h-5" /> Salem Branch
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              65, Omalur Main Road, Fairlands, Salem - 636016.
            </p>
            <p className="text-xs font-mono font-bold text-stone-800 dark:text-amber-200">
              Tel: 0427 2334455 / +91 98422 12348
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#8B1E34] to-[#4A0A17] text-white p-8 sm:p-12 rounded-3xl border-2 border-amber-400/40 shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-brand text-amber-100">
            Begin Your Sacred Matrimonial Journey
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl mx-auto font-tamil">
            இன்றே இலவசமாக பதிவு செய்து உங்கள் குடும்பத்திற்கேற்ற உன்னதமான வரன்களைத் தேர்ந்தெடுங்கள்.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={openRegistrationModal}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 font-bold rounded-2xl text-sm shadow-xl hover:scale-105 transition"
            >
              Create Free Profile
            </button>
            <button
              onClick={openAssistedModal}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-2xl text-sm transition"
            >
              Talk to Senior Counselor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
