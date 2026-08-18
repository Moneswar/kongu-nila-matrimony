import React, { useState } from 'react';
import { KolamMotif } from '../components/common/KolamMotif';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Lock, Eye, AlertTriangle, CheckCircle2, UserX, FileText, Sparkles, Check } from 'lucide-react';

export const SafetyView: React.FC = () => {
  const { showToast } = useToast();

  const [photoPrivacy, setPhotoPrivacy] = useState<'all' | 'verified_only' | 'on_request'>('verified_only');
  const [phonePrivacy, setPhonePrivacy] = useState<'mutual_interest_only' | 'on_request'>('mutual_interest_only');
  const [horoscopePrivacy, setHoroscopePrivacy] = useState<'all' | 'shortlisted_only'>('all');

  const handleSaveSettings = () => {
    showToast('Privacy & Security Settings updated successfully!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-kolam-pattern" />
        <div className="relative flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Family Trust & Data Protection</span>
        </div>
        <h1 className="relative text-2xl sm:text-3xl font-bold font-serif-brand text-amber-100">
          Safety Guidelines & Privacy Controls
        </h1>
        <p className="relative text-xs sm:text-sm text-amber-200/90 font-tamil leading-relaxed">
          கொங்கு நிலா மேட்ரிமோனி உங்கள் குடும்ப விவரங்கள் மற்றும் அந்தரங்க பாதுகாப்பிற்கு மிகுந்த முன்னுரிமை அளிக்கிறது.
        </p>
      </div>

      {/* Privacy Customization Panel */}
      <div className="bg-white dark:bg-[#1A0F12] rounded-3xl p-6 sm:p-8 border border-[#EFE6DA] dark:border-amber-500/20 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-amber-500/15 pb-4">
          <h2 className="text-lg font-bold text-stone-900 dark:text-amber-100 font-serif-brand flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Profile Privacy & Contact Access Controls</span>
          </h2>
          <span className="text-xs text-amber-700 dark:text-amber-400 font-bold hidden sm:inline">
            Active Protection
          </span>
        </div>

        <div className="space-y-6 text-xs font-semibold">
          {/* Photo Privacy */}
          <div className="space-y-2">
            <label className="block text-stone-900 dark:text-amber-200 font-bold uppercase tracking-wider text-[11px]">
              Photograph Visibility (புகைப்பட அனுமதி)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'all', title: 'Visible to All Members', desc: 'Any registered user can see photos' },
                { id: 'verified_only', title: 'Verified Profiles Only (Recommended)', desc: 'Only Govt ID verified members' },
                { id: 'on_request', title: 'Visible on Request Only', desc: 'Approve each request manually' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPhotoPrivacy(opt.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    photoPrivacy === opt.id
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-stone-900 dark:text-amber-200 shadow-xs'
                      : 'bg-stone-50 dark:bg-[#140C0E] border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-amber-400/50'
                  }`}
                >
                  <div>
                    <strong className="block text-xs text-stone-900 dark:text-amber-100">{opt.title}</strong>
                    <span className="text-[11px] opacity-80 block mt-1">{opt.desc}</span>
                  </div>
                  {photoPrivacy === opt.id && (
                    <span className="mt-2 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Privacy */}
          <div className="space-y-2 pt-4 border-t border-stone-100 dark:border-amber-500/15">
            <label className="block text-stone-900 dark:text-amber-200 font-bold uppercase tracking-wider text-[11px]">
              Family Phone Number Access (தொலைபேசி எண் பாதுகாப்பு)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'mutual_interest_only', title: 'Mutual Interest Accepted Members Only', desc: 'Protected until both families accept interest' },
                { id: 'on_request', title: 'Individual Request Approval', desc: 'Requires explicit SMS/OTP consent before sharing' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPhonePrivacy(opt.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    phonePrivacy === opt.id
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-stone-900 dark:text-amber-200 shadow-xs'
                      : 'bg-stone-50 dark:bg-[#140C0E] border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-amber-400/50'
                  }`}
                >
                  <div>
                    <strong className="block text-xs text-stone-900 dark:text-amber-100">{opt.title}</strong>
                    <span className="text-[11px] opacity-80 block mt-1">{opt.desc}</span>
                  </div>
                  {phonePrivacy === opt.id && (
                    <span className="mt-2 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-stone-100 dark:border-amber-500/15">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 btn-primary text-xs font-bold shadow-md transition"
            >
              Save Privacy Settings
            </button>
          </div>
        </div>
      </div>

      {/* Safety Best Practices Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Golden Rules for Safe Matrimony</span>
          </div>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300 font-medium list-disc list-inside leading-relaxed font-tamil">
            <li>முதலில் குடும்பப் பின்னணி மற்றும் சொந்த ஊர் தகவல்களை உறுதி செய்யுங்கள்.</li>
            <li>நேரில் குடும்பத்தாரோடு பொது இடங்களில் சந்தித்து உரையாடுங்கள்.</li>
            <li>ஜாதகக் குறிப்புகள் மற்றும் கூட்ட முறைகளை மூத்தவர்களோடு கலந்து ஆலோசியுங்கள்.</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-[#1A0F12] p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Never Share or Engage In</span>
          </div>
          <ul className="space-y-2 text-stone-700 dark:text-stone-300 font-medium list-disc list-inside leading-relaxed font-tamil">
            <li>எக்காரணம் கொண்டும் முன்பணம் அல்லது வங்கி பணப் பரிவர்த்தனைகள் செய்யாதீர்கள்.</li>
            <li>சந்தேகத்திற்கிடமான விவரங்கள் இருந்தால் உடனே 98422 12345 எண்ணில் புகார் அளியுங்கள்.</li>
            <li>OTP அல்லது ரகசிய கடவுச்சொற்களை யாரிடமும் பகிராதீர்கள்.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
