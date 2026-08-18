import React, { useState } from 'react';
import { mockStories } from '../data/mockStories';
import { KolamMotif } from '../components/common/KolamMotif';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  Send,
  Check,
  Filter,
  X,
  Share2,
  Quote,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StoriesView: React.FC = () => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedStoryDetail, setSelectedStoryDetail] = useState<any | null>(null);

  // Form State
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('2025-02-14');
  const [location, setLocation] = useState('Coimbatore');
  const [kootams, setKootams] = useState('Vellode & Sengunni Kootam');
  const [storyText, setStoryText] = useState('');

  const locations = ['All', 'Coimbatore', 'Erode', 'Tiruppur', 'Salem', 'Namakkal', 'Chennai'];

  const filteredStories = selectedLocation === 'All'
    ? mockStories
    : mockStories.filter(s => s.location.toLowerCase().includes(selectedLocation.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitModalOpen(false);
    showToast('Nandri! Your Vivaham Story has been submitted for verification.', 'success');
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#7A1C2E', '#F3E5AB']
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500/40">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-kolam-pattern" />
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/70 rounded-full text-xs font-bold text-amber-300 border border-amber-400/40">
              <Heart className="w-4 h-4 fill-current text-rose-400" />
              <span>Real Vivaham Milestones</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif-brand text-amber-100">
              Celebrated Kongu Vivaham Stories
            </h1>
            <p className="text-sm sm:text-base text-amber-200/90 font-tamil leading-relaxed">
              கொங்கு நிலா மேட்ரிமோனி மூலம் மனமொத்த வரன் அமைந்து சுபமுகூர்த்த நன்னாளில் திருமண பந்தத்தில் இணைந்த தம்பதியினர்.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold rounded-2xl text-xs sm:text-sm shadow-xl transition hover:scale-105 shrink-0"
          >
            Share Your Wedding Story
          </button>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#1A0F12] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
            <Filter className="w-4 h-4 text-[#7A1C2E] dark:text-amber-400" />
            <span>Filter by District:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedLocation === loc
                    ? 'bg-[#7A1C2E] text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => (
            <div
              key={story.id}
              className="bg-white dark:bg-[#1A0F12] rounded-3xl overflow-hidden border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={story.image}
                    alt={story.coupleNames}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#7A1C2E]/90 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {story.location}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-stone-950/80 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {story.engagementYear}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {story.weddingDate}
                    </span>
                    <span className="text-[#7A1C2E] dark:text-amber-400 font-bold">
                      Verified Vivaham
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                    {story.coupleNames}
                  </h3>

                  <div className="relative">
                    <Quote className="w-4 h-4 text-amber-500/40 absolute -top-1 -left-1" />
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-4 line-clamp-3">
                      "{story.story}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-3">
                <div className="p-2.5 bg-amber-50 dark:bg-stone-900/80 rounded-xl border border-amber-200/60 dark:border-stone-800 text-[11px] text-[#7A1C2E] dark:text-amber-300 font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Blessed by parents & traditional Kootam alignment</span>
                </div>

                <button
                  onClick={() => setSelectedStoryDetail(story)}
                  className="w-full py-2 bg-stone-100 dark:bg-stone-800 hover:bg-[#7A1C2E] hover:text-white dark:hover:bg-amber-400 dark:hover:text-stone-950 rounded-xl text-xs font-bold transition"
                >
                  Read Full Couple Journey
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Detail Modal */}
      {selectedStoryDetail && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A0F12] max-w-2xl w-full rounded-3xl overflow-hidden border border-amber-400/40 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative aspect-16/9">
              <img
                src={selectedStoryDetail.image}
                alt={selectedStoryDetail.coupleNames}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedStoryDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/70 text-white hover:bg-stone-950 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                    {selectedStoryDetail.coupleNames}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#7A1C2E]" />
                    {selectedStoryDetail.location} • Wedding: {selectedStoryDetail.weddingDate}
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-300 text-xs font-bold rounded-full border border-amber-300/40">
                  {selectedStoryDetail.engagementYear}
                </span>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-stone-900 rounded-2xl border border-amber-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-tamil">
                "{selectedStoryDetail.story}"
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Story link copied to clipboard!', 'success');
                  }}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Story</span>
                </button>
                <button
                  onClick={() => setSelectedStoryDetail(null)}
                  className="px-5 py-2 bg-[#7A1C2E] text-white text-xs font-bold rounded-xl hover:bg-[#8B1E34] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Your Story Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A0F12] max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-amber-400/40 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="text-xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Share Your Vivaham Story
                </h3>
                <p className="text-xs text-stone-500 font-tamil">உங்கள் திருமண அனுபவத்தைப் பகிருங்கள்</p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">Bride Name</label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={e => setBrideName(e.target.value)}
                    placeholder="e.g. Deepa"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">Groom Name</label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={e => setGroomName(e.target.value)}
                    placeholder="e.g. Karthikeyan"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">Wedding Date</label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={e => setWeddingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">Native District</label>
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                  >
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Erode">Erode</option>
                    <option value="Tiruppur">Tiruppur</option>
                    <option value="Salem">Salem</option>
                    <option value="Namakkal">Namakkal</option>
                    <option value="Karur">Karur</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">Kootams / Lineage</label>
                <input
                  type="text"
                  value={kootams}
                  onChange={e => setKootams(e.target.value)}
                  placeholder="e.g. Vellode & Sengunni Kootam"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">Your Story & Experience</label>
                <textarea
                  rows={4}
                  required
                  value={storyText}
                  onChange={e => setStoryText(e.target.value)}
                  placeholder="How did you connect on Kongu Nila Matrimony? Share words of inspiration for other families..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Story for Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
