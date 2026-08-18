import React, { useState } from 'react';
import { horoscopeService, TAMIL_NAKSHATRAS } from '../services/horoscopeService';
import { KolamMotif } from '../components/common/KolamMotif';
import { useToast } from '../context/ToastContext';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  Printer,
  ShieldCheck,
  Star,
  Info,
  Calendar
} from 'lucide-react';

export const HoroscopeView: React.FC = () => {
  const { showToast } = useToast();

  const [brideStar, setBrideStar] = useState('Rohini');
  const [groomStar, setGroomStar] = useState('Swathi');
  const [brideRasi, setBrideRasi] = useState('Rishabam (ரிஷபம்)');
  const [groomRasi, setGroomRasi] = useState('Thulam (துலாம்)');
  const [report, setReport] = useState(() =>
    horoscopeService.calculate10Poruthams('Rohini', 'Swathi')
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = horoscopeService.calculate10Poruthams(brideStar, groomStar);
    setReport(res);
    showToast('10-Porutham calculations updated successfully!', 'success');
  };

  const handleDownload = () => {
    showToast('Horoscope Compatibility Certificate downloaded as PDF', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white p-6 sm:p-10 rounded-3xl border-2 border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
          <KolamMotif size={18} color="#F3E5AB" />
          <span>Vedic Thirumana Porutham System</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-serif-brand text-amber-100">
          10-Porutham Horoscope Compatibility Matching
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/90 max-w-2xl font-tamil leading-relaxed">
          தமிழ் பாரம்பரிய முறைப்படியான 10 திருமணப் பொருத்தங்கள், ரஜ்ஜு பொருத்தம், செவ்வாய் தோஷம் மற்றும் கிரக அமைப்புகளை துல்லியமாக அறியும் வழிகாட்டி.
        </p>
      </div>

      {/* Input Calculator Form */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-brand flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-600" />
          <span>Select Bride & Groom Birth Stars (நட்சத்திரங்கள்)</span>
        </h2>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-bold">
          {/* Bride Star */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-tamil">
              பெண் நட்சத்திரம் (Bride Star)
            </label>
            <select
              value={brideStar}
              onChange={e => setBrideStar(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-3 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500"
            >
              {TAMIL_NAKSHATRAS.map(n => (
                <option key={n.nameEn} value={n.nameEn}>
                  {n.nameEn} ({n.nameTa})
                </option>
              ))}
            </select>
          </div>

          {/* Bride Rasi */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-tamil">
              பெண் ராசி (Bride Rasi)
            </label>
            <select
              value={brideRasi}
              onChange={e => setBrideRasi(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-3 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500"
            >
              <option>Mesham (மேஷம்)</option>
              <option>Rishabam (ரிஷபம்)</option>
              <option>Mithunam (மிதுனம்)</option>
              <option>Kadagam (கடகம்)</option>
              <option>Simmam (சிம்மம்)</option>
              <option>Kanni (கன்னி)</option>
              <option>Thulam (துலாம்)</option>
              <option>Viruchigam (விருச்சிகம்)</option>
              <option>Dhanusu (தனுசு)</option>
              <option>Magaram (மகரம்)</option>
              <option>Kumbam (கும்பம்)</option>
              <option>Meenam (மீனம்)</option>
            </select>
          </div>

          {/* Groom Star */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-tamil">
              ஆண் நட்சத்திரம் (Groom Star)
            </label>
            <select
              value={groomStar}
              onChange={e => setGroomStar(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-3 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500"
            >
              {TAMIL_NAKSHATRAS.map(n => (
                <option key={n.nameEn} value={n.nameEn}>
                  {n.nameEn} ({n.nameTa})
                </option>
              ))}
            </select>
          </div>

          {/* Groom Rasi */}
          <div>
            <label className="block text-stone-700 dark:text-stone-300 mb-1.5 font-tamil">
              ஆண் ராசி (Groom Rasi)
            </label>
            <select
              value={groomRasi}
              onChange={e => setGroomRasi(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-3 rounded-xl border border-stone-200 dark:border-stone-700 font-bold focus:ring-2 focus:ring-amber-500"
            >
              <option>Mesham (மேஷம்)</option>
              <option>Rishabam (ரிஷபம்)</option>
              <option>Mithunam (மிதுனம்)</option>
              <option>Kadagam (கடகம்)</option>
              <option>Simmam (சிம்மம்)</option>
              <option>Kanni (கன்னி)</option>
              <option>Thulam (துலாம்)</option>
              <option>Viruchigam (விருச்சிகம்)</option>
              <option>Dhanusu (தனுசு)</option>
              <option>Magaram (மகரம்)</option>
              <option>Kumbam (கும்பம்)</option>
              <option>Meenam (மீனம்)</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] text-white rounded-xl font-bold shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Calculate Porutham</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Overview Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-stone-800 dark:to-stone-800/80 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-stone-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold text-3xl flex items-center justify-center shadow-lg shrink-0 font-serif-brand">
            {report.score}/10
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-amber-950 dark:text-amber-200 font-serif-brand">
                {report.verdict}
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60">
                {report.score >= 7 ? 'Auspicious Match' : 'Conditional Match'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-1 font-tamil leading-relaxed">
              {report.verdictTa} • மணமகள்: {brideStar} ({brideRasi.split('(')[0]}) | மணமகன்: {groomStar} ({groomRasi.split('(')[0]})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 shadow-xs transition"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Traditional South Indian Horoscope Grid Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Rasi Chart */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-brand flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>South Indian Rasi Kattam (ராசி கட்டம்)</span>
          </h3>

          {/* Traditional 12-box South Indian Chart */}
          <div className="aspect-square w-full max-w-xs mx-auto grid grid-cols-4 grid-rows-4 border-2 border-amber-800/60 dark:border-amber-500/40 text-[10px] font-bold text-center bg-amber-50/20 dark:bg-stone-800/40">
            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Meenam</div>
            <div className="border border-amber-800/30 p-1 flex items-center justify-center text-amber-800 dark:text-amber-300">Mesham (Sun)</div>
            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Rishabam (Moon)</div>
            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Mithunam</div>

            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Kumbam (Jup)</div>
            {/* Center blank with Kolam */}
            <div className="col-span-2 row-span-2 border border-amber-800/30 flex flex-col items-center justify-center p-2 bg-white dark:bg-stone-900">
              <KolamMotif size={28} color="#D4AF37" />
              <span className="text-[9px] font-serif-brand text-amber-900 dark:text-amber-300 mt-1">
                RASI KATTAM
              </span>
            </div>
            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Kadagam</div>

            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Magaram</div>
            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Simmam (Ven)</div>

            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Dhanusu</div>
            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Viruchigam</div>
            <div className="border border-amber-800/30 p-1 flex items-center justify-center text-amber-800 dark:text-amber-300">Thulam (Mars)</div>
            <div className="border border-amber-800/30 p-1 flex items-center justify-center">Kanni (Sat)</div>
          </div>
          <p className="text-[11px] text-stone-500 text-center font-tamil">
            சுத்த ஜாதக அமைப்பு • செவ்வாய் தோஷம் சமநிலை
          </p>
        </div>

        {/* 10 Porutham Complete Breakdown Table */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-brand">
            Detailed 10-Porutham Analysis Table
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-2.5">Porutham</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {report.poruthams.map((p, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40">
                    <td className="p-2.5 font-bold font-tamil text-stone-900 dark:text-stone-100">
                      {p.nameTa} ({p.name})
                    </td>
                    <td className="p-2.5">
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 font-tamil">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {p.statusTa}
                      </span>
                    </td>
                    <td className="p-2.5 text-stone-600 dark:text-stone-400 text-[11px] font-tamil">
                      {p.descriptionTa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
