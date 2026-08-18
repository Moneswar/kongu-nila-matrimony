import React, { useState } from 'react';
import { mockPlans } from '../data/mockPlans';
import { membershipService } from '../services/membershipService';
import { useMatrimony } from '../context/MatrimonyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { KolamMotif } from '../components/common/KolamMotif';
import {
  CheckCircle2,
  Crown,
  ShieldCheck,
  Sparkles,
  Star,
  Phone,
  Heart,
  Users,
  Clock,
  ArrowRight,
  Receipt,
  FileText,
  HelpCircle,
  ChevronDown,
  Check,
  Minus
} from 'lucide-react';
import { MembershipPlan } from '../types';

export const MembershipView: React.FC = () => {
  const { openAssistedModal, openUpgradeModal } = useMatrimony();
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const transactions = membershipService.getTransactions();

  const currentPlan = mockPlans.find(p => p.id === currentUser.membershipTier) || mockPlans[0];

  const handleSelectPlan = (plan: MembershipPlan) => {
    if (plan.id === 'assisted') {
      openAssistedModal();
    } else {
      openUpgradeModal(plan);
    }
  };

  const comparisonFeatures = [
    { name: 'Complete Profile Creation & Verification', free: true, classic: true, premium: true, assisted: true },
    { name: 'Search & Browse Verified Profiles', free: true, classic: true, premium: true, assisted: true },
    { name: 'Send & Receive Interests (விருப்பங்கள்)', free: true, classic: true, premium: true, assisted: true },
    { name: 'Verified Phone & Email Access', free: '—', classic: '30 Contacts', premium: '75 Contacts', assisted: '150 Contacts' },
    { name: 'Direct In-App Chat & Family Messaging', free: false, classic: true, premium: true, assisted: true },
    { name: 'Detailed 10-Porutham Horoscope Compatibility', free: false, classic: true, premium: true, assisted: true },
    { name: 'Priority Search Result Placement', free: false, classic: false, premium: true, assisted: true },
    { name: 'Dedicated Senior Relationship Manager', free: false, classic: false, premium: false, assisted: true },
    { name: 'Family-to-Family Meeting Coordination', free: false, classic: false, premium: false, assisted: true }
  ];

  const faqs = [
    {
      q: 'How does verified phone number access work?',
      a: 'When you upgrade to Classic Gold, Premium Diamond, or Assisted VIP, you can unlock verified contact numbers of prospective matches. Contact balances remain valid throughout your subscription.'
    },
    {
      q: 'Can I upgrade my plan midway?',
      a: 'Yes, you can upgrade to a higher-tier plan (like Premium Diamond or Assisted VIP) at any time, and the validity and remaining contacts will be combined.'
    },
    {
      q: 'What is included in the Assisted Matrimony VIP plan?',
      a: 'Our Assisted VIP service assigns a dedicated senior matrimonial advisor who personally searches profiles, coordinates horoscopes with Vedic astrologers, and arranges introductions between families.'
    },
    {
      q: 'Are all profiles ID verified before contact sharing?',
      a: 'Yes, 100% of profiles on Kongu Nila Matrimony undergo multi-level mobile, government ID, and photo verification to ensure safe and genuine matrimonial alliances.'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white py-14 sm:py-18 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500/40">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-kolam-pattern" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-400/50 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-md">
            <KolamMotif size={16} color="#F3E5AB" />
            <span className="font-tamil">கொங்கு நிலா சந்தா திட்டங்கள்</span>
            <span className="opacity-40">•</span>
            <span>Transparent Matrimonial Memberships</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-brand text-amber-100 tracking-tight">
            Choose Your Membership
          </h1>

          <p className="text-sm sm:text-base text-amber-200/90 max-w-2xl mx-auto leading-relaxed font-tamil">
            Select a plan that suits your matrimonial journey and connect with genuine, culturally aligned families across Kongu Nadu.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-amber-200/80">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% ID Verified Contacts</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>10-Porutham Horoscope Included</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-amber-400/30">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Dedicated VIP Counselors</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 2. CURRENT ACTIVE MEMBERSHIP STATUS CARD (IF LOGGED IN) */}
        {isAuthenticated && (
          <div className="bg-gradient-to-r from-amber-50 to-[#FAF7F2] dark:from-[#1E1114] dark:to-[#160A0D] rounded-3xl p-6 sm:p-7 border-2 border-amber-400/60 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-md shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Current Plan:
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                    {currentPlan.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Includes <strong>{currentPlan.contactViews || 'Standard'}</strong> verified contact views and {currentPlan.messagingLimit}.
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>Expires in 90 days (15 May 2025)</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  const targetPlan = mockPlans.find(p => p.id === 'premium') || mockPlans[2];
                  openUpgradeModal(targetPlan);
                }}
                className="flex-1 md:flex-initial px-5 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Upgrade Plan</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {/* 3. PRICING CARDS GRID */}
        <div>
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
              Transparent Membership Plans
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              No hidden charges. All plans include 100% ID verification and secure communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockPlans.map(plan => {
              const isCurrent = currentUser.membershipTier === plan.id;
              const isFeatured = !!plan.badge;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    isFeatured
                      ? 'bg-white dark:bg-[#1A0F12] border-2 border-amber-400 shadow-2xl scale-[1.02] ring-4 ring-amber-400/20'
                      : 'bg-white dark:bg-[#1A0F12] border border-[#EFE6DA] dark:border-amber-500/20 shadow-md hover:shadow-xl hover:border-amber-400/40'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-3.5 inset-x-0 mx-auto w-fit bg-gradient-to-r from-amber-500 via-[#7A1C2E] to-amber-600 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-lg border border-amber-300/40 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      <span>{plan.badge}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-amber-500/15">
                      <div>
                        <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                          {plan.name}
                        </h3>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {plan.durationMonths} Months Validity
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-400/30">
                        {plan.id === 'assisted' ? (
                          <Crown className="w-5 h-5 text-amber-500" />
                        ) : (
                          <Star className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                    </div>

                    <div className="mt-4 mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-[#7A1C2E] dark:text-amber-300 font-serif-brand">
                          ₹ {plan.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5 font-medium">
                        All taxes included • Instant activation
                      </span>
                    </div>

                    <ul className="space-y-3 text-xs text-stone-700 dark:text-stone-300 font-medium">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              f.included ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-300 dark:text-stone-600'
                            }`}
                          />
                          <span className={f.included ? '' : 'line-through text-stone-400 dark:text-stone-500'}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-stone-100 dark:border-amber-500/15">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400/40 cursor-default'
                          : isFeatured
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold'
                          : 'bg-[#7A1C2E] hover:bg-[#8B1E34] text-white font-bold'
                      }`}
                    >
                      {isCurrent ? 'Current Active Plan' : `Select ${plan.name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. COMPREHENSIVE FEATURES COMPARISON TABLE */}
        <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-md space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold font-serif-brand text-stone-900 dark:text-amber-100">
              Detailed Plan Feature Matrix
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Compare features across all membership tiers to choose the best option for your family.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-bold">
                  <th className="py-3 px-4">Feature / Service</th>
                  <th className="py-3 px-3 text-center">Free Basic</th>
                  <th className="py-3 px-3 text-center">Classic Gold</th>
                  <th className="py-3 px-3 text-center bg-amber-50/50 dark:bg-amber-950/20 text-[#7A1C2E] dark:text-amber-300 rounded-t-xl">
                    Premium Diamond
                  </th>
                  <th className="py-3 px-3 text-center">Assisted VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium text-stone-700 dark:text-stone-300">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="py-3.5 px-4 font-semibold">{row.name}</td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Minus className="w-4 h-4 text-stone-400 mx-auto" />
                      ) : (
                        <span className="text-stone-500">{row.free}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.classic === 'boolean' ? (
                        row.classic ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Minus className="w-4 h-4 text-stone-400 mx-auto" />
                      ) : (
                        <span className="font-bold text-amber-800 dark:text-amber-300">{row.classic}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center bg-amber-50/50 dark:bg-amber-950/20">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Minus className="w-4 h-4 text-stone-400 mx-auto" />
                      ) : (
                        <span className="font-bold text-amber-800 dark:text-amber-300">{row.premium}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.assisted === 'boolean' ? (
                        row.assisted ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Minus className="w-4 h-4 text-stone-400 mx-auto" />
                      ) : (
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{row.assisted}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. MEMBERSHIP & TRANSACTION HISTORY */}
        <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <div className="space-y-0.5">
              <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                <span>Transaction & Invoice History</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Official billing statements and subscription activation records.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold">
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Plan Name</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-stone-800 dark:text-stone-200">{t.id}</td>
                    <td className="py-3 px-3 font-semibold">{t.planName}</td>
                    <td className="py-3 px-3 font-bold text-[#7A1C2E] dark:text-amber-300">₹ {t.amount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-stone-500">{t.date}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-bold text-[10px]">
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => showToast(`Invoice ${t.invoiceNumber} saved.`, 'info')}
                        className="text-amber-800 dark:text-amber-400 hover:underline font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{t.invoiceNumber}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. ASSISTED VIP CALLOUT */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-8 sm:p-10 rounded-3xl border-2 border-amber-400/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-4 h-4" />
              <span>Assisted Matrimony VIP Concierge</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-brand text-amber-100">
              Prefer personalized matchmaking with a Dedicated Relationship Advisor?
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/90 font-tamil max-w-2xl">
              எங்கள் மூத்த திருமண ஆலோசகர் உங்கள் குடும்பத்திற்கென பிரத்யேகமாக வரன்களைத் தேர்ந்தெடுத்து, ஜாதகப் பொருத்தம் பார்த்து, இரு குடும்பத்தினரிடமும் பேசி சுபமுகூர்த்த சந்திப்பை ஒருங்கிணைப்பார்.
            </p>
          </div>

          <button
            type="button"
            onClick={openAssistedModal}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-bold rounded-2xl text-xs sm:text-sm shadow-xl transition hover:scale-105 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Request VIP Callback</span>
          </button>
        </div>

        {/* 7. FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
          <div className="text-center space-y-1 mb-4">
            <h3 className="text-xl font-bold font-serif-brand text-stone-900 dark:text-amber-100 flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>Membership FAQs</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Common questions about payments, verified contacts, and renewals.
            </p>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 hover:text-[#7A1C2E] dark:hover:text-amber-300 transition cursor-pointer gap-2"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180 text-amber-500' : 'text-stone-400'}`} />
                </button>
                {activeFaq === idx && (
                  <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
