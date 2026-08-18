import React, { useState } from 'react';
import { KolamMotif } from '../components/common/KolamMotif';
import { ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TermsView: React.FC = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<'privacy' | 'terms' | 'safety'>('privacy');

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500/40">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-kolam-pattern" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-400/50 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Legal & Privacy Governance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-brand text-amber-100">
            Privacy Policy & Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-amber-200/90 max-w-xl mx-auto">
            Our unwavering commitment to member confidentiality, data security, and authentic family values.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3 p-1.5 bg-white dark:bg-[#1A0F12] rounded-2xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm max-w-md mx-auto">
          <button
            onClick={() => setActiveSection('privacy')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSection === 'privacy'
                ? 'bg-[#7A1C2E] text-white shadow-md'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveSection('terms')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSection === 'terms'
                ? 'bg-[#7A1C2E] text-white shadow-md'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveSection('safety')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSection === 'safety'
                ? 'bg-[#7A1C2E] text-white shadow-md'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Member Safety</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 sm:p-10 border border-[#EFE6DA] dark:border-amber-500/20 shadow-sm space-y-6 text-stone-700 dark:text-stone-300 leading-relaxed text-sm">
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <h2 className="text-2xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Privacy Policy & Confidentiality Charter
                </h2>
                <p className="text-xs text-stone-500 mt-1">Last Updated: August 2026</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#7A1C2E] dark:text-amber-300">
                  1. Information We Collect
                </h3>
                <p>
                  Kongu Nila Matrimony collects personal bio-data, horoscope particulars (Rasi, Nakshatra, Dosham), photographs, educational qualifications, ancestral lineage (Kootam, Kula Deivam, Native Place), and contact credentials provided directly by prospective candidates or their authorized parents/guardians.
                </p>

                <h3 className="text-lg font-bold text-[#7A1C2E] dark:text-amber-300">
                  2. Photo & Contact Number Privacy Controls
                </h3>
                <p>
                  Members retain 100% granular control over who views their phone number and photo gallery. You can configure:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm">
                  <li><strong>Visible to All Verified Members:</strong> Only authenticated, screened matrimonial candidates can view.</li>
                  <li><strong>Visible Only on Mutual Interest Acceptance:</strong> Contact details are revealed exclusively when both families accept interest.</li>
                  <li><strong>Watermarked Photos:</strong> All profile images are dynamically protected against downloads.</li>
                </ul>

                <h3 className="text-lg font-bold text-[#7A1C2E] dark:text-amber-300">
                  3. Non-Disclosure & Security Guarantee
                </h3>
                <p>
                  Kongu Nila Matrimony <strong>never sells, rents, or shares</strong> member data with third-party advertisers, marketing agencies, or non-matrimonial organizations. Data is protected with AES-256 encryption.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <h2 className="text-2xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Terms of Service & Community Guidelines
                </h2>
                <p className="text-xs text-stone-500 mt-1">Last Updated: August 2026</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#7A1C2E] dark:text-amber-300">
                  1. Eligibility for Matrimonial Membership
                </h3>
                <p>
                  To register on Kongu Nila Matrimony, brides must be at least 18 years of age and grooms must be at least 21 years of age as per Indian Law. All registrations must be for genuine matrimonial alliances. Casual dating or deceptive identity generation is strictly prohibited.
                </p>

                <h3 className="text-lg font-bold text-[#7A1C2E] dark:text-amber-300">
                  2. Verification & Authenticity
                </h3>
                <p>
                  Members agree to provide accurate and truthful details regarding education, profession, income, marital status, and ancestral lineage. Any account identified with fraudulent claims will be terminated immediately.
                </p>

                <h3 className="text-lg font-bold text-[#7A1C2E] dark:text-amber-300">
                  3. Respectful Communication
                </h3>
                <p>
                  All interactions between families and members must maintain dignity and decorum. Any harassment, inappropriate language, or monetary demands will result in a permanent ban and potential legal reporting.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'safety' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <h2 className="text-2xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                  Safe Matrimonial Practices
                </h2>
                <p className="text-xs text-stone-500 mt-1">Guidance for Parents & Prospective Brides/Grooms</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-300/40 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <strong>Never send money:</strong> Kongu Nila Matrimony candidates or families will never request advance payments, emergency funds, or gift customs over phone or chat. Report any such requests immediately to our helpline at +91 98422 12345.
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#7A1C2E] dark:text-amber-300">
                  Safe Steps Before Finalizing an Alliance
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                  <li>Schedule initial calls with senior family members and parents.</li>
                  <li>Arrange formal first meetings at public or trusted residential venues.</li>
                  <li>Verify workplace and background through independent local references or our branch coordinators.</li>
                  <li>Exchange original horoscope jathagam copies through certified traditional astrologers.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
