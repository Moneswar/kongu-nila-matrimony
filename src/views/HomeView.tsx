import React, { useState } from 'react';
import { QuickSearchWidget } from '../components/search/QuickSearchWidget';
import { ProfileCard } from '../components/profile/ProfileCard';
import { KolamMotif } from '../components/common/KolamMotif';
import { useMatrimony } from '../context/MatrimonyContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { horoscopeService } from '../services/horoscopeService';
import { mockStories } from '../data/mockStories';
import {
  Heart,
  ShieldCheck,
  Crown,
  Compass,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  EyeOff,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
  MapPin,
  Lock,
  UserCheck,
  SlidersHorizontal,
  Search,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
  PhoneCall,
  Globe,
  Star,
  Shield,
  Activity,
  Flame,
  Award,
  Zap
} from 'lucide-react';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  onQuickSearch: (filters: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentTab, onQuickSearch }) => {
  const { profiles, openRegistrationModal, openAssistedModal, openLoginModal } = useMatrimony();
  const { isAuthenticated, currentUser } = useAuth();
  const { language } = useLanguage();

  // Horoscope widget state
  const [brideStar, setBrideStar] = useState('Rohini');
  const [groomStar, setGroomStar] = useState('Swathi');
  const [horoscopeResult, setHoroscopeResult] = useState(() =>
    horoscopeService.calculate10Poruthams('Rohini', 'Swathi')
  );

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCheckHoroscope = (e: React.FormEvent) => {
    e.preventDefault();
    const result = horoscopeService.calculate10Poruthams(brideStar, groomStar);
    setHoroscopeResult(result);
  };

  // Show top featured profiles on desktop
  const featuredProfiles = profiles.slice(0, 4);

  const faqs = [
    {
      q: 'How does Kongu Nila Matrimony verify profile authenticity?',
      qTa: 'கொங்கு நிலா மேட்ரிமோனி வரன்களின் உண்மைத்தன்மையை எவ்வாறு சரிபார்க்கிறது?',
      a: 'Every registered profile undergoes mandatory Government Photo ID verification (Aadhaar, Passport, or Driving License), mobile OTP confirmation, and verification of Kongu ancestral roots (Kootam & Native Place) by our dedicated verification team before becoming visible to members.',
      aTa: 'பதிவு செய்யப்படும் அனைத்து வரன்களும் அரசு புகைப்பட அடையாள அட்டை (ஆதார்/ஓட்டுநர் உரிமம்), மொபைல் எண் மற்றும் கொங்கு பூர்வீக கூட்டம் சரிபார்க்கப்பட்ட பின்னரே தளத்தில் வெளியிடப்படுகின்றன.'
    },
    {
      q: 'How is Kootam / Gothram matching handled in our platform?',
      qTa: 'கூட்டம் மற்றும் கோத்திர பொருத்தம் எவ்வாறு செயல்படுத்தப்படுகிறது?',
      a: 'In the Kongu Vellalar tradition, candidates belonging to the same Kootam are considered brothers and sisters (Dayadi lineage) and cannot marry. Our platform filters matches automatically to ensure complete Kootam exogamy and parental peace of mind.',
      aTa: 'ஒரே கூட்டம்/கோத்திரத்தைச் சேர்ந்தவர்கள் தாயாதி முறை என்பதால், எங்கள் தேடல் அமைப்பு ஒரே கூட்டத்தைச் சேர்ந்த வரன்களை தானாகவே தவிர்த்து, முறையான வரன்களை மட்டுமே பரிந்துரைக்கிறது.'
    },
    {
      q: 'Can parents manage a matrimonial profile on behalf of their son or daughter?',
      qTa: 'பெற்றோர்கள் தங்கள் மகன் அல்லது மகளுக்காக வரன் பதிவை நிர்வகிக்க முடியுமா?',
      a: 'Yes, absolutely. Over 65% of profiles on Kongu Nila are lovingly managed by parents or elder family members. You can select "Profile Created by: Parent" during registration to receive direct calls from prospective families.',
      aTa: 'நிச்சயமாக. எங்கள் தளத்தில் 65% க்கும் மேற்பட்ட வரன்கள் பெற்றோர்களால் நிர்வகிக்கப்படுகின்றன. "பெற்றோரால் உருவாக்கப்பட்டது" என்பதைத் தேர்ந்தெடுத்து வரன் பார்க்கலாம்.'
    },
    {
      q: 'How does the 10-Porutham Vedic Horoscope engine work?',
      qTa: '10 பொருத்தம் ஜாதகக் கணக்கீடு எவ்வாறு செயல்படுகிறது?',
      a: 'Our horoscope engine evaluates traditional South Indian astrological parameters: Dina, Gana, Mahendra, Stree Dheerga, Yoni, Rasi, Rasi Adhipathi, Vasya, Rajju, and Vedha. Rajju compatibility is strictly flagged to ensure auspicious marriage harmony.',
      aTa: 'தின, கண, மாகேந்திர, ஸ்திரீ தீர்க்க, யோனி, ராசி, ராசி அதிபதி, வசிய, ரஜ்ஜு மற்றும் வேதை ஆகிய பத்து பொருத்தங்களையும் பாரம்பரிய ஜோதிட விதிப்படி துல்லியமாக கணக்கிடுகிறது.'
    },
    {
      q: 'What privacy controls are available for my family’s photos and phone numbers?',
      qTa: 'புகைப்படங்கள் மற்றும் தொலைபேசி எண்களுக்கு என்னென்ன பாதுகாப்பு வசதிகள் உள்ளன?',
      a: 'You can set photos to "Visible to All Verified Members", "Visible on Request", or "Visible Only after Mutual Interest Acceptance". Phone numbers are never exposed to unregistered visitors or casual searchers.',
      aTa: 'புகைப்படங்களை "சரிபார்க்கப்பட்ட உறுப்பினர்களுக்கு மட்டும்" அல்லது "விருப்பம் ஏற்றுக் கொண்ட பின் மட்டும்" என உங்கள் விருப்பப்படி முழுமையாகப் பாதுகாக்கலாம்.'
    },
    {
      q: 'What is included in the Assisted VIP Matrimony service?',
      qTa: 'அசிஸ்டெட் விஐபி (Assisted VIP) சேவை என்றால் என்ன?',
      a: 'Under the Assisted VIP tier, a Senior Relationship Manager from Coimbatore, Erode, Tiruppur, or Salem personally shortlists compatible matches, consults our astrologers for horoscope harmony, contacts prospective parents, and arranges formal family meetings.',
      aTa: 'எங்களின் மூத்த திருமண ஆலோசகர் ஒருவர் உங்கள் குடும்பத்திற்கென பிரத்யேகமாக நியமிக்கப்பட்டு, வரன்களைத் தேர்ந்தெடுத்து, ஜாதகம் பார்த்து, குடும்ப சந்திப்பை நேர்த்தியாக ஒருங்கிணைப்பார்.'
    }
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-16 sm:space-y-24 pb-20">
      {/* ================================================== */}
      {/* 1. HERO SECTION */}
      {/* ================================================== */}
      <section
        id="home-hero-section"
        className="relative overflow-hidden bg-gradient-to-b from-[#7A1C2E] via-[#550E1C] to-[#2D060D] text-white pt-10 pb-20 sm:pt-14 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400/40"
      >
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-kolam-pattern" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-10">
          {/* Top Banner Tagline Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-md">
              <KolamMotif size={16} color="#F3E5AB" />
              <span className="font-tamil">கொங்கு மற்றும் தமிழ் மக்களின் நம்பிக்கைக்குரிய திருமண தளம்</span>
              <span className="opacity-40">•</span>
              <span>Trusted Family Matrimony</span>
            </div>
          </div>

          {/* Hero Content & Matrimonial Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Headline, Description & Dynamic CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 font-serif-brand">
                  Kongu Nila Matrimony
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold font-serif-brand tracking-tight text-amber-100 leading-[1.2]">
                  Find a Meaningful Match with Kongu Nila Matrimony
                </h1>
                <p className="text-base sm:text-lg text-amber-200/90 font-medium leading-relaxed max-w-2xl">
                  A trusted matrimonial platform designed to help individuals and families discover suitable matches across Kongu Nadu and Tamil communities worldwide.
                </p>
                <p className="text-xs sm:text-sm text-amber-200/75 font-tamil pt-1">
                  பாரம்பரியமும் நவீனமும் இணைந்த கொங்கு வேளாளர் மற்றும் தமிழ் குடும்பங்களின் நம்பிக்கைக்குரிய தளம்.
                </p>
              </div>

              {/* Authentication-Aware Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {isAuthenticated ? (
                  <>
                    <button
                      id="hero-dashboard-btn"
                      onClick={() => setCurrentTab('dashboard')}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 border border-amber-200 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-stone-950" />
                      <span>Go to Dashboard</span>
                    </button>

                    <button
                      id="hero-matches-btn"
                      onClick={() => setCurrentTab('matches')}
                      className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-amber-300/40 text-amber-100 font-bold text-sm rounded-2xl backdrop-blur-md hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-current text-rose-400" />
                      <span>Explore Matches</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="hero-create-profile-btn"
                      onClick={openRegistrationModal}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 border border-amber-200 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-current text-rose-600" />
                      <span>Create Your Profile</span>
                    </button>

                    <button
                      id="hero-browse-profiles-btn"
                      onClick={() => setCurrentTab('search')}
                      className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-amber-300/40 text-amber-100 font-bold text-sm rounded-2xl backdrop-blur-md hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-amber-300" />
                      <span>Browse Profiles</span>
                    </button>
                  </>
                )}
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-amber-200/85">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>ID & Mobile Verified Profiles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Strict Photo & Contact Privacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>10-Porutham Horoscope Compatibility</span>
                </div>
              </div>
            </div>

            {/* Right: Elegant Matrimonial Couple Visual */}
            <div className="lg:col-span-5 relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-gradient-to-b from-amber-900/30 to-amber-950/60 p-2">
                <div className="relative aspect-4/5 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
                    alt="Traditional Tamil Wedding Vivaham Couple"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3B0712]/90 via-transparent to-black/20" />

                  {/* Floating Vivaham Tag */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#7A1C2E]/90 border border-amber-400/50 backdrop-blur-md rounded-xl p-3 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-amber-100">Karthikeyan & Deepa</p>
                        <p className="text-[10px] text-amber-200/80 font-tamil">கோவை • கொங்கு வேளாளர் திருமணம்</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold">
                        Kongu Vivaham
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-amber-950/80 p-1.5 rounded-full border border-amber-400/40">
                  <KolamMotif size={20} color="#F3E5AB" />
                </div>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* 2. QUICK SEARCH WIDGET */}
          {/* ================================================== */}
          <div id="hero-quick-search-section" className="pt-4 max-w-5xl mx-auto text-left">
            <QuickSearchWidget
              onSearch={filters => {
                onQuickSearch(filters);
                setCurrentTab('search');
              }}
              onOpenAdvanced={() => setCurrentTab('search')}
            />
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 3. TRUST & VERIFICATION METRICS */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#1A0D10] text-stone-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/30">
          {/* Card 1: ID Verified */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <strong className="text-lg sm:text-xl font-bold text-amber-200 block font-serif-brand">
                Verified Profiles
              </strong>
              <span className="text-xs text-stone-300 font-medium">Government ID & mobile screening</span>
            </div>
          </div>

          {/* Card 2: Strict Privacy Controls */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <strong className="text-lg sm:text-xl font-bold text-amber-200 block font-serif-brand">
                Privacy Focused
              </strong>
              <span className="text-xs text-stone-300 font-medium">Protected phone & photo access</span>
            </div>
          </div>

          {/* Card 3: Kongu Community Focus */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
              <KolamMotif size={24} color="#F3E5AB" />
            </div>
            <div>
              <strong className="text-lg sm:text-xl font-bold text-amber-200 block font-serif-brand">
                Kongu Heritage
              </strong>
              <span className="text-xs text-stone-300 font-medium">60+ Kootam & Gothram purity</span>
            </div>
          </div>

          {/* Card 4: Meaningful Alliances */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/40">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <strong className="text-lg sm:text-xl font-bold text-amber-200 block font-serif-brand">
                Trusted Matrimony
              </strong>
              <span className="text-xs text-stone-300 font-medium">Family-managed sacred unions</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 4. HOW IT WORKS (4 SIMPLE STEPS) */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7A1C2E] dark:text-amber-400">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
            How Kongu Nila Matrimony Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-tamil">
            உங்கள் வரன் தேடலை எளிமையாகவும் பாதுகாப்பாகவும் தொடங்கும் முறை
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 bg-white dark:bg-[#1A0F12] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 relative hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 font-bold flex items-center justify-center text-lg font-serif-brand border border-amber-400/40">
              01
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
              Create Your Profile
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Register free with basic biodata, education, occupation, family background, and Kongu Kootam.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-white dark:bg-[#1A0F12] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 relative hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 font-bold flex items-center justify-center text-lg font-serif-brand border border-amber-400/40">
              02
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
              Set Your Preferences
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Define your criteria for age, height, district, educational qualification, and Kootam exogamy rules.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-white dark:bg-[#1A0F12] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 relative hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 font-bold flex items-center justify-center text-lg font-serif-brand border border-amber-400/40">
              03
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
              Discover Matches
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Browse screened profiles and check detailed 10-Porutham Vedic horoscope compatibility.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 bg-white dark:bg-[#1A0F12] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 relative hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-[#7A1C2E] dark:text-amber-300 font-bold flex items-center justify-center text-lg font-serif-brand border border-amber-400/40">
              04
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-amber-100 font-serif-brand">
              Connect & Converse
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Express interest, unlock verified family contact numbers, and initiate respectful family dialogues.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 5. FEATURED & RECOMMENDED PROFILES */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7A1C2E] dark:text-amber-400 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Personalized Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
              Featured & Verified Profiles
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 font-tamil">
              உங்களின் விருப்பங்கள் மற்றும் குடும்ப மதிப்பீடுகளுக்கு ஏற்ற தேர்ந்தெடுக்கப்பட்ட வரன்கள்
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab('search')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A1C2E] dark:text-amber-400 hover:underline cursor-pointer"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProfiles.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setCurrentTab('search')}
            className="px-8 py-3.5 bg-gradient-to-r from-[#7A1C2E] to-[#991B33] hover:from-[#8B1E34] hover:to-[#B3203E] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore More Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ================================================== */}
      {/* 6. SMART MATCHING SYSTEM SPOTLIGHT */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#180C0F] text-stone-100 rounded-3xl p-8 sm:p-12 border border-amber-500/30 shadow-2xl space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart Compatibility Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-brand text-amber-100">
              Matches Based on What Matters to You
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-tamil">
              வயது, சொந்த மாவட்டம், கல்வி, தொழில், உணவு முறை மற்றும் கூட்ட முறை சார்ந்த துல்லியமான பொருத்தம்
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3 hover:border-amber-400/50 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center font-bold border border-amber-500/40">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-amber-200">
                Community & Lineage Purity
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                60+ Kongu Kootam exogamy filters automatically avoid Dayadi lineage and ensure proper cultural alignment.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3 hover:border-rose-400/50 transition">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 text-rose-400 flex items-center justify-center font-bold border border-rose-500/40">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-amber-200">
                Education & Career Congruence
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Screen professionals by verified degrees (B.E., M.S., MBBS, CA, MBA) and annual CTC bands.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3 hover:border-emerald-400/50 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/40">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-amber-200">
                Native Regional Proximity
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Focused match discovery across Coimbatore, Erode, Tiruppur, Salem, Namakkal, Karur, Chennai, and abroad.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setCurrentTab('matches')}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xl transition hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Smart Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 7. KONGU CULTURAL HERITAGE & 10-PORUTHAM WIDGET */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white rounded-3xl p-8 sm:p-12 border-2 border-amber-400/40 shadow-xl space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
              <KolamMotif size={16} color="#F3E5AB" />
              <span>Built with Your Values in Mind</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-amber-100">
              Instant 10-Porutham Horoscope Match Checker
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 font-tamil">
              மணமகன் மற்றும் மணமகளின் பிறந்த நட்சத்திரத்தைத் தேர்ந்தெடுத்து பத்து பொருத்தங்களை உடனே அறிந்து கொள்ளுங்கள்.
            </p>
          </div>

          {/* Interactive Horoscope Calculator Form */}
          <form
            onSubmit={handleCheckHoroscope}
            className="max-w-3xl mx-auto bg-black/40 p-6 sm:p-8 rounded-3xl border border-amber-400/30 backdrop-blur-md space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-amber-200 mb-1.5 font-bold">
                  Bride's Birth Star (மணப்பெண் நட்சத்திரம்)
                </label>
                <select
                  value={brideStar}
                  onChange={e => setBrideStar(e.target.value)}
                  className="w-full p-3 bg-stone-900/90 border border-amber-400/40 rounded-xl text-amber-100 font-bold focus:outline-none"
                >
                  {['Ashwini', 'Bharani', 'Karthigai', 'Rohini', 'Mrigashirsha', 'Thiruvathirai', 'Punarpoosam', 'Poosam', 'Aayilyam', 'Makam', 'Pooram', 'Uthiram', 'Hastham', 'Chithirai', 'Swathi', 'Visakam', 'Anusham', 'Kettai', 'Moolam', 'Pooradam', 'Uthiradam', 'Thiruvonam', 'Avittam', 'Sathayam', 'Poorattathi', 'Uthirattathi', 'Revathi'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-amber-200 mb-1.5 font-bold">
                  Groom's Birth Star (மணமகன் நட்சத்திரம்)
                </label>
                <select
                  value={groomStar}
                  onChange={e => setGroomStar(e.target.value)}
                  className="w-full p-3 bg-stone-900/90 border border-amber-400/40 rounded-xl text-amber-100 font-bold focus:outline-none"
                >
                  {['Ashwini', 'Bharani', 'Karthigai', 'Rohini', 'Mrigashirsha', 'Thiruvathirai', 'Punarpoosam', 'Poosam', 'Aayilyam', 'Makam', 'Pooram', 'Uthiram', 'Hastham', 'Chithirai', 'Swathi', 'Visakam', 'Anusham', 'Kettai', 'Moolam', 'Pooradam', 'Uthiradam', 'Thiruvonam', 'Avittam', 'Sathayam', 'Poorattathi', 'Uthirattathi', 'Revathi'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer"
              >
                Calculate 10 Poruthams
              </button>
            </div>

            {/* Horoscope Result Box */}
            <div className="p-4 bg-stone-900/80 rounded-2xl border border-amber-400/30 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="font-bold text-amber-200">
                  Result: {brideStar} (Bride) + {groomStar} (Groom)
                </span>
                <p className="text-stone-300 text-[11px]">
                  Rajju Compatibility: <strong className="text-emerald-400">Auspicious</strong> • Total Score: <strong className="text-amber-300">{horoscopeResult.score} / 10 Poruthams</strong>
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-950 border border-emerald-400 text-emerald-300 font-bold rounded-lg text-xs">
                {horoscopeResult.score >= 7 ? 'Uthama Porutham' : 'Madhyama Porutham'}
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* ================================================== */}
      {/* 8. ASSISTED VIP CONCIERGE MATRIMONY */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A0F12] rounded-3xl p-8 sm:p-12 border-2 border-amber-400/40 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-stone-100">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-4 h-4" />
              <span>Assisted Matrimony VIP Concierge</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-brand text-amber-100">
              Prefer Personalized Matchmaking by a Senior Matrimonial Advisor?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-tamil">
              எங்கள் மூத்த திருமண ஆலோசகர் உங்கள் குடும்பத்திற்கென பிரத்யேகமாக வரன்களைத் தேர்ந்தெடுத்து, ஜாதகப் பொருத்தம் பார்த்து, இரு குடும்பத்தினரிடமும் பேசி சுபமுகூர்த்த சந்திப்பை ஒருங்கிணைப்பார்.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-amber-200/90 font-medium">
              <span>✓ Handpicked Matches</span>
              <span>✓ Astrologer Verification</span>
              <span>✓ Family Introductions</span>
            </div>
          </div>

          <button
            type="button"
            onClick={openAssistedModal}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xl transition hover:scale-105 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Request VIP Advisor Callback</span>
          </button>
        </div>
      </section>

      {/* ================================================== */}
      {/* 9. SAFETY & PRIVACY SECTION */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-stone-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Family Safety & Data Protection</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
              Your Privacy Matters
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-tamil">
              உங்கள் புகைப்படங்கள் மற்றும் தொலைபேசி எண்களை உங்கள் விருப்பப்படி மட்டுமே பகிரும் முழுமையான பாதுகாப்பு வசதிகள்.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab('safety')}
            className="px-6 py-3 border-2 border-[#7A1C2E] dark:border-amber-400 text-[#7A1C2E] dark:text-amber-300 rounded-2xl font-bold text-xs sm:text-sm hover:bg-[#7A1C2E] hover:text-white dark:hover:bg-amber-950 transition shrink-0 cursor-pointer"
          >
            Explore Privacy & Safety Guidelines
          </button>
        </div>
      </section>

      {/* ================================================== */}
      {/* 10. FAQ ACCORDION SECTION */}
      {/* ================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7A1C2E] dark:text-amber-400">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
            Common Matrimonial Queries
          </h2>
        </div>

        <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-md divide-y divide-stone-100 dark:divide-stone-800/60">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 hover:text-[#7A1C2E] dark:hover:text-amber-300 transition cursor-pointer gap-2"
                >
                  <span>{language === 'ta' ? faq.qTa : faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-tamil animate-in fade-in duration-150">
                    {language === 'ta' ? faq.aTa : faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================== */}
      {/* 11. FINAL CONVERSION CLOSING CTA */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-10 sm:p-16 rounded-3xl border-2 border-amber-400/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <KolamMotif size={160} color="#F3E5AB" />
          </div>

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-brand text-amber-100">
              Your Journey Towards a Meaningful Connection Starts Here
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed font-tamil">
              கொங்கு மண்டலத்தின் பாரம்பரியம் மற்றும் குடும்பப் பெருமையை மதிக்கும் மனதிற்கேற்ற வாழ்க்கைத்துணையை இன்று எளிதாகக் கண்டறியுங்கள்.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setCurrentTab('dashboard')}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xl transition hover:scale-105 cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={openRegistrationModal}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xl transition hover:scale-105 cursor-pointer"
              >
                Create Free Matrimonial Profile
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentTab('search')}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-amber-300/40 text-amber-100 font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-md transition cursor-pointer"
            >
              Browse Verified Profiles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
