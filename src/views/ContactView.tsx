import React, { useState } from 'react';
import { KolamMotif } from '../components/common/KolamMotif';
import { useToast } from '../context/ToastContext';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, Building2, Sparkles } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('Coimbatore');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Nandri! Your inquiry has been routed to our ${branch} regional office. Our counselor will contact you shortly.`, 'success');
    setName('');
    setPhone('');
    setMessage('');
  };

  const branches = [
    {
      city: 'Coimbatore (Head Office)',
      cityTa: 'கோவை (தலைமை அலுவலகம்)',
      address: 'Race Course Road, Near Thomas Park, Coimbatore - 641018',
      phone: '+91 98422 12345 / 0422 4567890',
      email: 'cbe@kongunilamatrimony.com',
      hours: 'Mon - Sun: 9:00 AM - 7:30 PM'
    },
    {
      city: 'Erode Regional Branch',
      cityTa: 'ஈரோடு கிளை',
      address: 'Perundurai Road, Opp. Collectorate, Erode - 638011',
      phone: '+91 98422 12346 / 0424 2234567',
      email: 'erode@kongunilamatrimony.com',
      hours: 'Mon - Sat: 9:30 AM - 7:00 PM'
    },
    {
      city: 'Tiruppur Branch',
      cityTa: 'திருப்பூர் கிளை',
      address: 'Avinashi Road, Kumar Nagar, Tiruppur - 641603',
      phone: '+91 98422 12347 / 0421 2478901',
      email: 'tiruppur@kongunilamatrimony.com',
      hours: 'Mon - Sat: 9:30 AM - 7:00 PM'
    },
    {
      city: 'Salem Regional Branch',
      cityTa: 'சேலம் கிளை',
      address: 'Saradha College Main Road, Fairlands, Salem - 636016',
      phone: '+91 98422 12348 / 0427 2345678',
      email: 'salem@kongunilamatrimony.com',
      hours: 'Mon - Sat: 9:30 AM - 7:00 PM'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500/40">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-kolam-pattern" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-400/50 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-md">
            <KolamMotif size={16} color="#F3E5AB" />
            <span className="font-tamil">கொங்கு மண்டல கிளை அலுவலகங்கள்</span>
            <span className="opacity-40">•</span>
            <span>Direct Regional Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-brand text-amber-100 tracking-tight">
            Contact Our Regional Matrimony Centers
          </h1>

          <p className="text-sm sm:text-base text-amber-200/90 max-w-2xl mx-auto leading-relaxed font-tamil">
            எங்கள் கிளை அலுவலகங்களுக்கு நேரில் வருகை தந்து மூத்த திருமண ஆலோசகர்களிடம் வரன் விவரங்களை பதிவு செய்யலாம் மற்றும் ஆலோசனை பெறலாம்.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-amber-200/80">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-amber-400/30">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>4 Direct Branch Centers</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-amber-400/30">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dedicated Helpline: +91 98422 12345</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT: BRANCHES & INQUIRY FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Branches Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {branches.map((b, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1A0F12] p-5 sm:p-6 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-md hover:shadow-xl hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-stone-100 dark:border-amber-500/15 pb-3">
                    <div>
                      <h3 className="font-bold text-base font-serif-brand text-stone-900 dark:text-amber-100">
                        {b.city}
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-tamil mt-0.5">
                        {b.cityTa}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-400/30 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 font-medium">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#7A1C2E] dark:text-amber-400 shrink-0 mt-0.5" />
                      <span>{b.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
                      <span className="font-mono">{b.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
                      <span>{b.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#7A1C2E] dark:text-amber-400 shrink-0" />
                      <span>{b.hours}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 dark:border-amber-500/15">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Walk-in Consultations Available</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1A0F12] p-6 sm:p-8 rounded-3xl border border-[#EFE6DA] dark:border-amber-500/20 shadow-xl space-y-5 text-xs font-semibold">
            <div className="border-b border-stone-100 dark:border-amber-500/15 pb-4">
              <div className="flex items-center gap-2 text-[#7A1C2E] dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Confidential Matrimonial Inquiry</span>
              </div>
              <h3 className="text-lg font-bold font-serif-brand text-stone-900 dark:text-amber-100">
                Send an Inquiry or Schedule Appointment
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-tamil">
                உங்கள் விவரங்களை அனுப்பினால் எங்களின் திருமண ஆலோசகர் தொடர்பு கொள்வார்.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
                  Your Full Name (பெயர்)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Soundararajan K"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
                  Phone Number (தொலைபேசி எண்)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 98422 12345"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
                  Preferred Regional Branch (விருப்பமான கிளை)
                </label>
                <select
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                >
                  <option value="Coimbatore">Coimbatore (Race Course Road)</option>
                  <option value="Erode">Erode (Perundurai Road)</option>
                  <option value="Tiruppur">Tiruppur (Avinashi Road)</option>
                  <option value="Salem">Salem (Fairlands)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-bold">
                  Message or Match Requirements (விவரங்கள்)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Looking for Kongu Vellalar matches in Coimbatore..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-[#140C0E] rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold focus:outline-hidden focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/20 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#7A1C2E] via-[#8B1E34] to-[#5C1020] hover:from-[#8B1E34] hover:to-[#4A0A17] text-white rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 border border-amber-400/30 cursor-pointer hover:scale-[1.01]"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
