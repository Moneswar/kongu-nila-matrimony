import { HoroscopeInfo } from '../types';

export interface PoruthamResult {
  name: string;
  nameTa: string;
  status: 'Uthamam (Excellent)' | 'Madhyamam (Good)' | 'Neutral' | 'Not Matching';
  statusTa: string;
  matched: boolean;
  score: number; // out of 10
  importance: 'Crucial' | 'High' | 'Moderate';
  description: string;
  descriptionTa: string;
}

export interface FullHoroscopeMatchReport {
  score: number; // 0 - 10
  percentage: number;
  verdict: 'Highly Auspicious Match' | 'Good Match' | 'Satisfactory' | 'Consult Astrologer';
  verdictTa: string;
  rajjuPoruthamPassed: boolean;
  doshamCompatible: boolean;
  poruthams: PoruthamResult[];
}

export const TAMIL_NAKSHATRAS = [
  { nameEn: 'Ashwini', nameTa: 'அசுவினி' },
  { nameEn: 'Bharani', nameTa: 'பரணி' },
  { nameEn: 'Karthigai', nameTa: 'கார்த்திகை' },
  { nameEn: 'Rohini', nameTa: 'ரோகிணி' },
  { nameEn: 'Mrigasheersha', nameTa: 'மிருகசீரிடம்' },
  { nameEn: 'Thiruvathirai (Ardra)', nameTa: 'திருவாதிரை' },
  { nameEn: 'Punarpoosam (Punarvasu)', nameTa: 'புனர்பூசம்' },
  { nameEn: 'Poosam (Pushya)', nameTa: 'பூசம்' },
  { nameEn: 'Ayilyam (Ashlesha)', nameTa: 'ஆயில்யம்' },
  { nameEn: 'Makam (Magha)', nameTa: 'மகம்' },
  { nameEn: 'Pooram (Purva Phalguni)', nameTa: 'பூரம்' },
  { nameEn: 'Uthiram (Uttara Phalguni)', nameTa: 'உத்திரம்' },
  { nameEn: 'Hastham (Hasta)', nameTa: 'ஹஸ்தம்' },
  { nameEn: 'Chithirai (Chitra)', nameTa: 'சித்திரை' },
  { nameEn: 'Swathi', nameTa: 'சுவாதி' },
  { nameEn: 'Visakam (Vishakha)', nameTa: 'விசாகம்' },
  { nameEn: 'Anusham (Anuradha)', nameTa: 'அனுஷம்' },
  { nameEn: 'Kettai (Jyeshta)', nameTa: 'கேட்டை' },
  { nameEn: 'Moolam (Mula)', nameTa: 'மூலம்' },
  { nameEn: 'Pooradam (Purva Ashadha)', nameTa: 'பூராடம்' },
  { nameEn: 'Uthiradam (Uttara Ashadha)', nameTa: 'உத்திராடம்' },
  { nameEn: 'Thiruvonam (Shravana)', nameTa: 'திருவோணம்' },
  { nameEn: 'Avittam (Dhanishta)', nameTa: 'அவிட்டம்' },
  { nameEn: 'Sathayam (Shatabhisha)', nameTa: 'சதயம்' },
  { nameEn: 'Poorattathi (Purva Bhadrapada)', nameTa: 'பூரட்டாதி' },
  { nameEn: 'Uthirattathi (Uttara Bhadrapada)', nameTa: 'உத்திரட்டாதி' },
  { nameEn: 'Revathi', nameTa: 'ரேவதி' },
];

export const horoscopeService = {
  calculate10Poruthams: (brideStar: string, groomStar: string): FullHoroscopeMatchReport => {
    // Standard mock astrology engine providing realistic Tamil Porutham breakdown
    const poruthams: PoruthamResult[] = [
      {
        name: 'Dina Porutham (Health & Longevity)',
        nameTa: 'தினப் பொருத்தம் (ஆரோக்கியம் & ஆயுள்)',
        status: 'Uthamam (Excellent)',
        statusTa: 'உத்தமம்',
        matched: true,
        score: 1,
        importance: 'High',
        description: 'Ensures good health, freedom from diseases, and energetic lifestyle for both partners.',
        descriptionTa: 'இருவருக்கும் உடல்நலம், ஆரோக்கியம் மற்றும் நீண்ட ஆயுளை நல்கும்.'
      },
      {
        name: 'Gana Porutham (Temperament Harmony)',
        nameTa: 'கணப் பொருத்தம் (மன ஒற்றுமை)',
        status: 'Uthamam (Excellent)',
        statusTa: 'உத்தமம் (தேவ - மனித கணம்)',
        matched: true,
        score: 1,
        importance: 'High',
        description: 'Harmonious emotional temperament, mutual respect, and smooth household decision-making.',
        descriptionTa: 'இருவரிடையே மன ஒற்றுமை, பரஸ்பர மரியாதை மற்றும் குடும்ப இணக்கம்.'
      },
      {
        name: 'Mahendra Porutham (Progeny & Wealth)',
        nameTa: 'மகேந்திரப் பொருத்தம் (புத்திர பாக்கியம்)',
        status: 'Uthamam (Excellent)',
        statusTa: 'உத்தமம்',
        matched: true,
        score: 1,
        importance: 'High',
        description: 'Blessings of healthy progeny, family continuity, and progressive financial accumulation.',
        descriptionTa: 'வம்ச விருத்தி, புத்திர பாக்கியம் மற்றும் செல்வம் பெருகுதல்.'
      },
      {
        name: 'Stree Deerkha (Bride’s Prosperity)',
        nameTa: 'ஸ்திரீ தீர்க்கப் பொருத்தம் (மங்கல வாழ்வு)',
        status: 'Uthamam (Excellent)',
        statusTa: 'உத்தமம்',
        matched: true,
        score: 1,
        importance: 'Moderate',
        description: 'Brings immense prosperity, happiness, and respect to the bride in her marital home.',
        descriptionTa: 'பெண்ணிற்கு நல்வாழ்வு, செல்வாக்கு மற்றும் சகல மங்கலங்களையும் தரும்.'
      },
      {
        name: 'Yoni Porutham (Physical Affinity)',
        nameTa: 'யோனிப் பொருத்தம் (அன்யோன்யம்)',
        status: 'Uthamam (Excellent)',
        statusTa: 'உத்தமம்',
        matched: true,
        score: 1,
        importance: 'High',
        description: 'Physical compatibility, emotional warmth, and enduring marital attraction.',
        descriptionTa: 'தம்பதியரிடையே சிறந்த அன்னியோன்யமும் தாம்பத்ய சுகமும் நிலைக்கும்.'
      },
      {
        name: 'Rasi Porutham (Lineage & Harmony)',
        nameTa: 'ராசிப் பொருத்தம் (குடும்ப ஒற்றுமை)',
        status: 'Madhyamam (Good)',
        statusTa: 'மத்திமம்',
        matched: true,
        score: 1,
        importance: 'High',
        description: 'Fosters unity between both extended families and avoids domestic friction.',
        descriptionTa: 'இரு குடும்பங்களுக்கிடையே சுமுக உறவும் ஒற்றுமையும் பேணப்படும்.'
      },
      {
        name: 'Rasiyadhipathi (Planetary Friendship)',
        nameTa: 'ராசியாதிபதிப் பொருத்தம் (கிரக நட்பு)',
        status: 'Uthamam (Excellent)',
        statusTa: 'உத்தமம் (மித்ர கிரகங்கள்)',
        matched: true,
        score: 1,
        importance: 'Moderate',
        description: 'Friendship between the planetary lords of the respective moon signs.',
        descriptionTa: 'ராசி நாதர்களின் நல்லுறவினால் மனஸ்தாபங்கள் இன்றி நட்பு நிலவும்.'
      },
      {
        name: 'Vasiya Porutham (Mutual Affection)',
        nameTa: 'வசியப் பொருத்தம் (கவர்ச்சி & அன்பு)',
        status: 'Uthamam (Excellent)',
        statusTa: 'உத்தமம்',
        matched: true,
        score: 1,
        importance: 'Moderate',
        description: 'Deep mutual magnetic affection, loyalty, and lifelong dedication to one another.',
        descriptionTa: 'ஒருவருக்கொருவர் விட்டுக் கொடுக்கும் தன்மையும் மனக்கவர்ச்சியும் நிலவும்.'
      },
      {
        name: 'Rajju Porutham (Mangalya Longevity)',
        nameTa: 'ரஜ்ஜுப் பொருத்தம் (மாங்கல்ய பலம்)',
        status: 'Uthamam (Excellent)',
        statusTa: 'உத்தமம் (ரஜ்ஜு தட்டு இல்லை)',
        matched: true,
        score: 1,
        importance: 'Crucial',
        description: 'The supreme cornerstone of Tamil Porutham — guarantees long and prosperous marital bond.',
        descriptionTa: 'திருமணப் பொருத்தங்களில் தலையாயது. தீர்க்க சுமங்கலி யோகத்தை உறுதி செய்கிறது.'
      },
      {
        name: 'Vedha Porutham (Affliction Immunity)',
        nameTa: 'வேதைப் பொருத்தம் (தோஷமின்மை)',
        status: 'Uthamam (Excellent)',
        statusTa: 'உத்தமம் (வேதை இல்லை)',
        matched: true,
        score: 1,
        importance: 'High',
        description: 'Protects the couple from unexpected obstacles, sorrow, or unforeseen distress.',
        descriptionTa: 'எந்தவித வேதை தோஷமும் இன்றி தம்பதியர் சுபமாய் வாழ துணைபுரியும்.'
      }
    ];

    const matchedCount = poruthams.filter(p => p.matched).length;
    const score = Math.min(10, Math.max(7, matchedCount));

    return {
      score,
      percentage: Math.round((score / 10) * 100),
      verdict: score >= 9 ? 'Highly Auspicious Match' : 'Good Match',
      verdictTa: score >= 9 ? 'மிகச் சிறந்த மங்களகரமான பொருத்தம்' : 'நல்ல பொருத்தம்',
      rajjuPoruthamPassed: true,
      doshamCompatible: true,
      poruthams,
    };
  }
};
