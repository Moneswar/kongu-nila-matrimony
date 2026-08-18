import React, { useState } from 'react';
import { SearchFilterState, Gender } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Search, SlidersHorizontal, Sparkles, MapPin, Users, Heart, GraduationCap, Briefcase } from 'lucide-react';
import { KolamMotif } from '../common/KolamMotif';

interface QuickSearchWidgetProps {
  onSearch: (filters: Partial<SearchFilterState>) => void;
  onOpenAdvanced: () => void;
}

export const QuickSearchWidget: React.FC<QuickSearchWidgetProps> = ({ onSearch, onOpenAdvanced }) => {
  const { t, language } = useLanguage();
  const [lookingFor, setLookingFor] = useState<Gender>('female');
  const [ageMin, setAgeMin] = useState<number>(22);
  const [ageMax, setAgeMax] = useState<number>(29);
  const [location, setLocation] = useState<string>('Coimbatore');
  const [community, setCommunity] = useState<string>('Kongu Vellalar');
  const [education, setEducation] = useState<string>('all');
  const [profession, setProfession] = useState<string>('all');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      gender: lookingFor,
      ageMin,
      ageMax,
      locations: location ? [location] : [],
      communities: community ? [community] : [],
      education: education !== 'all' ? [education] : [],
      professions: profession !== 'all' ? [profession] : [],
    });
  };

  return (
    <div
      id="quick-match-search-widget"
      className="w-full bg-white/95 dark:bg-[#1A0F12]/95 rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-amber-400/40 backdrop-blur-md"
    >
      {/* Title & Decorative Kolam */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7A1C2E] to-[#4A0A17] flex items-center justify-center shadow-md border border-amber-400/50">
            <KolamMotif size={20} color="#F3E5AB" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif-brand tracking-wide text-stone-900 dark:text-amber-100">
              {language === 'ta' ? 'பொருத்தமான வரன் தேடல்' : 'Find Your Ideal Life Partner'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {language === 'ta' ? 'கொங்கு மற்றும் தமிழ் மணமக்கள் உடனடித் தேர்வு' : 'Quick Match Discovery across Tamil Nadu & Global NRI'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAdvanced}
          className="text-xs font-bold text-[#7A1C2E] dark:text-amber-400 hover:text-rose-800 flex items-center gap-1.5 hover:underline"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Advanced Search</span>
        </button>
      </div>

      {/* Quick Search Form */}
      <form onSubmit={handleQuickSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-semibold">
          {/* 1. Looking for: Bride / Groom */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
              Looking for
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setLookingFor('female')}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  lookingFor === 'female'
                    ? 'bg-[#7A1C2E] text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>Bride (மணமகள்)</span>
              </button>
              <button
                type="button"
                onClick={() => setLookingFor('male')}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  lookingFor === 'male'
                    ? 'bg-[#7A1C2E] text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>Groom (மணமகன்)</span>
              </button>
            </div>
          </div>

          {/* 2. Age Range */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
              Age Range ({ageMin} to {ageMax} yrs)
            </label>
            <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800 p-2 rounded-xl border border-stone-200 dark:border-stone-700">
              <select
                value={ageMin}
                onChange={e => setAgeMin(Number(e.target.value))}
                className="bg-transparent text-stone-900 dark:text-stone-100 font-bold focus:outline-none w-full"
              >
                {[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(a => (
                  <option key={a} value={a} className="dark:bg-stone-900">{a} Yrs</option>
                ))}
              </select>
              <span className="text-stone-400 font-medium">to</span>
              <select
                value={ageMax}
                onChange={e => setAgeMax(Number(e.target.value))}
                className="bg-transparent text-stone-900 dark:text-stone-100 font-bold focus:outline-none w-full"
              >
                {[25, 26, 27, 28, 29, 30, 31, 32, 34, 36, 40].map(a => (
                  <option key={a} value={a} className="dark:bg-stone-900">{a} Yrs</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Location */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
              Location / Native
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="">All Regions (அனைத்து மாவட்டங்கள்)</option>
                <option value="Coimbatore">Coimbatore (கோவை)</option>
                <option value="Erode">Erode (ஈரோடு)</option>
                <option value="Tiruppur">Tiruppur (திருப்பூர்)</option>
                <option value="Salem">Salem (சேலம்)</option>
                <option value="Namakkal">Namakkal (நாமக்கல்)</option>
                <option value="Karur">Karur (கரூர்)</option>
                <option value="Dindigul">Dindigul (திண்டுக்கல்)</option>
                <option value="Chennai">Chennai (சென்னை)</option>
                <option value="Bengaluru">Bengaluru (பெங்களூரு)</option>
                <option value="Abroad (USA/UK/Singapore)">Abroad / NRI</option>
              </select>
            </div>
          </div>

          {/* 4. Community / Kootam */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
              Community / Kootam
            </label>
            <select
              value={community}
              onChange={e => setCommunity(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="Kongu Vellalar">Kongu Vellalar (கொங்கு வேளாளர்)</option>
              <option value="Vellode Kootam">Vellode Kootam (வெள்ளோடு)</option>
              <option value="Sengunni Kootam">Sengunni Kootam (செங்குண்ணி)</option>
              <option value="Porulanthai Kootam">Porulanthai Kootam (பொருளந்தை)</option>
              <option value="Semban Kootam">Semban Kootam (செம்பன்)</option>
              <option value="Kadaikaran Kootam">Kadaikaran Kootam (கடைக்காரன்)</option>
              <option value="All Communities">All Tamil Communities</option>
            </select>
          </div>

          {/* 5. Education */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
              Education
            </label>
            <select
              value={education}
              onChange={e => setEducation(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">Any Education (அனைத்து கல்வி)</option>
              <option value="B.E. / B.Tech / M.Tech">B.E. / B.Tech / M.Tech</option>
              <option value="MBBS / MD / Dental">MBBS / MD / Dental</option>
              <option value="MS Abroad / Foreign Degree">MS Abroad / Foreign Degree</option>
              <option value="CA / ICWA / CS / Finance">CA / ICWA / CS / Finance</option>
              <option value="MBA / Post Graduate">MBA / Post Graduate</option>
              <option value="B.Sc / B.Com / Arts">B.Sc / B.Com / Arts</option>
            </select>
          </div>

          {/* 6. Profession */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
              Profession
            </label>
            <select
              value={profession}
              onChange={e => setProfession(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">Any Profession (அனைத்து தொழில்)</option>
              <option value="Software / IT / Tech">Software / IT / Tech</option>
              <option value="Doctor / Medical / Healthcare">Doctor / Medical / Healthcare</option>
              <option value="Business / Entrepreneur">Business Owner / Entrepreneur</option>
              <option value="Civil / Mechanical Engineer">Civil / Core Engineering</option>
              <option value="Finance / Auditor / Banking">Finance / Auditor / Banking</option>
              <option value="Civil Services / Govt Officer">Govt Officer / Civil Services</option>
            </select>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Over <strong>15,000+</strong> 100% verified Kongu profiles available</span>
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenAdvanced}
              className="w-1/2 sm:w-auto px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Advanced Search
            </button>
            <button
              type="submit"
              id="btn-find-my-match"
              className="w-1/2 sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7A1C2E] via-[#8B1E34] to-[#A01F3C] hover:from-[#8B1E34] hover:to-[#B3203E] text-white rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 border border-amber-400/40 hover:scale-[1.02]"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Find My Match</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
