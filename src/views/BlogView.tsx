import React, { useState } from 'react';
import { KolamMotif } from '../components/common/KolamMotif';
import { useMatrimony } from '../context/MatrimonyContext';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  Calendar,
  Heart,
  Sparkles,
  ArrowRight,
  Compass,
  Users,
  ShieldCheck,
  Search,
  Tag
} from 'lucide-react';

interface BlogArticle {
  id: string;
  title: string;
  titleTa: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  summaryTa: string;
  content: string;
}

const articles: BlogArticle[] = [
  {
    id: '1',
    title: 'Understanding 10-Porutham: The Vedic Science of Matrimonial Harmony',
    titleTa: 'பத்து பொருத்தம்: இல்லற நல்லிணக்கத்தின் ஜோதிட அறிவியல் விளக்கம்',
    category: 'Horoscope & Astrology',
    date: 'August 14, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80',
    summary: 'A deep dive into Rajju, Dina, Gana, Rasi, and Yoni poruthams, explaining why traditional matching remains critical for enduring lifelong companionship.',
    summaryTa: 'ரஜ்ஜு, தின, கண, ராசி மற்றும் யோனி பொருத்தங்களின் முக்கியத்துவமும், அவை திருமண வாழ்வின் நிலைத்தன்மைக்கு எவ்வாறு உதவுகின்றன என்ற முழு விவரம்.',
    content: 'In Tamil Vedic astrology, the 10 Poruthams serve as a sacred compatibility blueprint assessing genetic harmony, mental alignment, emotional rhythm, and family longevity. Among them, Rajju Porutham is considered the supreme pillar of longevity, while Dina and Gana ensure daily temperament harmony...'
  },
  {
    id: '2',
    title: 'The Sacred Significance of Kootam & Gothram in Kongu Vellalar Weddings',
    titleTa: 'கொங்கு வேளாளர் திருமணங்களில் கூட்டம் மற்றும் கோத்திரத்தின் புனித முக்கியத்துவம்',
    category: 'Heritage & Traditions',
    date: 'August 10, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=80',
    summary: 'Learn about the ancient 60+ Kootam traditions, why same-kootam alliances are avoided as brother-sister lineages, and the beauty of parental blessings.',
    summaryTa: 'கொங்கு மண்டலத்தின் 60-க்கும் மேற்பட்ட கூட்டப் பிரிவுகள், ஒரே கூட்டத்தில் திருமணம் செய்யாததன் அறிவியல் மற்றும் பாரம்பரிய காரணங்கள்.',
    content: 'The Kongu Vellalar community traces its heritage across the fertile Cauvery and Noyyal river basins. The Kootam system ensures pure genetic diversity and maintains the integrity of maternal and paternal bloodlines...'
  },
  {
    id: '3',
    title: 'Modern First Meeting Guide for Tamil Families: Tips for a Respectful Alliance',
    titleTa: 'பெண் பார்க்கும் வைபவம் மற்றும் குடும்ப சந்திப்பு: நவீன தலைமுறைக்கான ஆலோசனைகள்',
    category: 'Family Guide',
    date: 'August 02, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
    summary: 'Essential etiquette for parents and prospective brides & grooms during the formal pen paarkkum vaibavam, balancing cultural grace and modern aspirations.',
    summaryTa: 'மரியாதைக்குரிய முதல் சந்திப்பு, ஒருவரையொருவர் புரிந்துகொள்ளும் உரையாடல்கள் மற்றும் பெற்றோர்களின் நல்லிணக்க வழிகாட்டல்.',
    content: 'A matrimonial first meeting is not an interview, but the beginning of two families coming together with respect, warmth, and shared values. Providing private time for the bride and groom to converse openly about career and lifestyle goals creates a solid foundation...'
  },
  {
    id: '4',
    title: 'Online Matrimonial Safety & Privacy: Best Practices for Families',
    titleTa: 'ஆன்லைன் மேட்ரிமோனி பாதுகாப்பு: குடும்பங்களுக்கான அத்தியாவசிய பாதுகாப்பு வழிமுறைகள்',
    category: 'Safety & Trust',
    date: 'July 28, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80',
    summary: 'How Kongu Nila protects your phone numbers and photos, and practical steps to verify biodatas with our branch relationship managers before finalizing.',
    summaryTa: 'தனிப்பட்ட விவரங்களைப் பாதுகாப்பது எப்படி? மற்றும் வரன்களின் உண்மைத்தன்மையை சரிபார்க்கும் வழிமுறைகள்.',
    content: 'Safety and privacy are non-negotiable in matrimony. Always verify Govt ID badges on profiles, communicate through our in-app messaging before sharing personal WhatsApp numbers, and utilize our branch coordinators for formal verification...'
  }
];

export const BlogView: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const categories = ['All', 'Horoscope & Astrology', 'Heritage & Traditions', 'Family Guide', 'Safety & Trust'];

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500/40">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-kolam-pattern" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-400/50 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <BookOpen className="w-4 h-4" />
            <span className="font-tamil">திருமண வழிகாட்டல் & பாரம்பரியம்</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-brand text-amber-100">
            Matrimonial Insights & Guides
          </h1>
          <p className="text-sm sm:text-base text-amber-200/90 max-w-xl mx-auto">
            Discover rich articles on 10-Porutham astrology, Kongu Kootam traditions, wedding etiquette, and matrimonial safety.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#7A1C2E] text-white shadow-md border border-amber-400/40'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Selected Article Modal / Detail View */}
        {selectedArticle && (
          <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 sm:p-10 border-2 border-amber-400/50 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-[#7A1C2E] dark:text-amber-300 rounded-full text-xs font-bold">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-amber-200"
              >
                Close Article ✕
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
              {language === 'ta' ? selectedArticle.titleTa : selectedArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-72 sm:h-96 object-cover rounded-2xl"
            />

            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed font-serif-brand">
              {language === 'ta' ? selectedArticle.summaryTa : selectedArticle.summary}
            </p>

            <div className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed space-y-4 pt-2 border-t border-stone-100 dark:border-stone-800">
              <p>{selectedArticle.content}</p>
              <p>
                Kongu Nila Matrimony continues to provide dedicated guidance for families honoring these timeless traditions while embracing modern career and lifestyle compatibility.
              </p>
            </div>
          </div>
        )}

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white dark:bg-[#1A0F12] rounded-3xl overflow-hidden border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm hover:shadow-xl hover:border-amber-400 cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#7A1C2E]/90 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100 group-hover:text-[#7A1C2E] dark:group-hover:text-amber-300 transition">
                    {language === 'ta' ? article.titleTa : article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                    {language === 'ta' ? article.summaryTa : article.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center text-xs font-bold text-[#7A1C2E] dark:text-amber-400 group-hover:underline gap-1">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
