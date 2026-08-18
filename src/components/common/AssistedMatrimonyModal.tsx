import React, { useState } from 'react';
import { useMatrimony } from '../../context/MatrimonyContext';
import { useToast } from '../../context/ToastContext';
import { KolamMotif } from './KolamMotif';
import { X, Crown, Phone, ShieldCheck, CheckCircle2, Star, Sparkles, Send } from 'lucide-react';

export const AssistedMatrimonyModal: React.FC = () => {
  const { isAssistedModalOpen, closeAssistedModal } = useMatrimony();
  const { showToast } = useToast();

  const [name, setName] = useState('Karthik Soundararajan');
  const [phone, setPhone] = useState('98422 12345');
  const [city, setCity] = useState('Coimbatore');
  const [preferredTime, setPreferredTime] = useState('Morning (10 AM - 1 PM)');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isAssistedModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast('A VIP Relationship Manager will call you shortly!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        id="assisted-modal-container"
        className="relative w-full max-w-lg bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-[#EFE6DA] dark:border-amber-500/30 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-6 relative border-b border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-400/40 flex items-center justify-center shadow-xs">
                <Crown className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif-brand tracking-wide text-amber-200">
                  Assisted Matrimony VIP
                </h3>
                <p className="text-xs text-amber-100/90 font-tamil">
                  நேரடி திருமண வழிகாட்டுதல் சேவை
                </p>
              </div>
            </div>
            <button
              onClick={closeAssistedModal}
              className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Highlights */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-500/30 flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 dark:text-amber-100">Personal Advisor</strong>
                <span className="text-[11px] text-stone-600 dark:text-stone-400">Dedicated relationship manager</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-500/30 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 dark:text-amber-100">Direct Verification</strong>
                <span className="text-[11px] text-stone-600 dark:text-stone-400">Ancestral Kootam & Background</span>
              </div>
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 font-semibold">
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-tamil">
                எங்களின் மூத்த திருமண ஆலோசகர் உங்களைத் தொடர்பு கொண்டு உங்கள் குடும்பத்திற்கு ஏற்ற சிறந்த கொங்கு வேளாளர் வரன்களைப் பரிந்துரைப்பார்.
              </p>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Your Name (பெயர்)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#7A1C2E]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#7A1C2E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Preferred Branch</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#7A1C2E]"
                  >
                    <option value="Coimbatore">Coimbatore Branch</option>
                    <option value="Erode">Erode Branch</option>
                    <option value="Tiruppur">Tiruppur Branch</option>
                    <option value="Salem">Salem Branch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 mb-1 font-bold">Preferred Callback Window</label>
                <select
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#7A1C2E]"
                >
                  <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                  <option value="Afternoon (2 PM - 5 PM)">Afternoon (2 PM - 5 PM)</option>
                  <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 btn-gold text-xs font-bold shadow-md hover:scale-[1.01] transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Request VIP Callback</span>
              </button>
            </form>
          ) : (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <strong className="block text-base font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                VIP Callback Request Registered!
              </strong>
              <p className="text-stone-700 dark:text-stone-300 font-tamil leading-relaxed text-xs">
                எங்கள் {city} கிளையின் மூத்த திருமண ஆலோசகர் உங்களை <strong>+91 {phone}</strong> என்ற எண்ணில் {preferredTime} நேரத்தில் தொடர்பு கொள்வார்.
              </p>
              <button
                onClick={closeAssistedModal}
                className="mt-2 px-6 py-2 btn-primary text-xs font-bold"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
