export interface FAQItem {
  id: string;
  question: string;
  questionTa?: string;
  answer: string;
  answerTa?: string;
  category: 'Registration' | 'Search & Matching' | 'Privacy & Safety' | 'Horoscope' | 'Membership';
}

export const mockFaqs: FAQItem[] = [
  {
    id: 'f1',
    category: 'Registration',
    question: 'How do I create a profile on Kongu Nila Matrimony?',
    questionTa: 'கொங்கு நிலா மேட்ரிமோனியில் சுயவிவரத்தை எவ்வாறு உருவாக்குவது?',
    answer: 'Registration is 100% free and takes less than 3 minutes. Click "Register Free", select who the profile is for (Myself, Son, Daughter, etc.), enter basic details, upload photos, and verify your mobile number via OTP.',
    answerTa: 'இலவச பதிவு 3 நிமிடங்களில் முடிந்துவிடும். "இலவச பதிவு" பொத்தானை அழுத்தி, சுயவிவரம் யாருக்கு என்பதை தேர்வு செய்து, விவரங்களை உள்ளிட்டு செல்போன் எண்ணை உறுதிப்படுத்தவும்.'
  },
  {
    id: 'f2',
    category: 'Privacy & Safety',
    question: 'Can I hide my phone number and photos from unknown users?',
    questionTa: 'எனது தொலைபேசி எண் மற்றும் புகைப்படங்களை மறைக்க முடியுமா?',
    answer: 'Yes, absolutely! Under "Privacy & Safety" in your dashboard, you can set your phone number to "Protected" and your photo privacy to "Members Only" or "On Request Only". You retain complete control.',
    answerTa: 'நிச்சயமாக! உங்கள் கட்டுப்பாட்டில் உள்ள ரகசிய அமைப்புகளில் தொலைபேசி எண் மற்றும் புகைப்படங்களை நீங்கள் விரும்பும் நபர்களுக்கு மட்டுமே காட்டும் வகையில் அமைக்கலாம்.'
  },
  {
    id: 'f3',
    category: 'Horoscope',
    question: 'How does the 10-Porutham horoscope matching system work?',
    questionTa: 'பத்து பொருத்தம் ஜாதகக் கணக்கீடு எவ்வாறு இயங்குகிறது?',
    answer: 'Our Vedic astrology engine calculates traditional Poruthams (Rasi, Nakshatra, Rajju, Gana, Dina, etc.) along with modern lifestyle, career, and value metrics to provide an overall compatibility score.',
    answerTa: 'எங்கள் பாரம்பரிய வேத ஜோதிட முறைப்படி 10 பொருத்தங்கள் (ராசி, நட்சத்திரம், ரஜ்ஜு, கணம், தினப் பொருத்தம் போன்றவை) மற்றும் வாழ்க்கை முறை பொருத்தங்கள் கணக்கிடப்படுகின்றன.'
  },
  {
    id: 'f4',
    category: 'Membership',
    question: 'What is Assisted Matrimony VIP?',
    questionTa: 'அசிஸ்டட் மேட்ரிமோனி (Assisted Matrimony) என்றால் என்ன?',
    answer: 'Assisted Matrimony is our personalized concierge service where a dedicated senior relationship manager handpicks matches, handles family-to-family discussions, verifies horoscopes with astrologers, and arranges meetings.',
    answerTa: 'அசிஸ்டட் மேட்ரிமோனி என்பது ஒரு பிரத்யேக மேனேஜர் மூலம் உங்கள் குடும்பத்திற்கு ஏற்ற வரன்களைத் தேர்ந்தெடுத்து, ஜாதகப் பொருத்தம் பார்த்து, இரு குடும்பத்தினரையும் நேரில் சந்திக்கும் வரை வழிகாட்டும் சிறப்பு சேவையாகும்.'
  },
  {
    id: 'f5',
    category: 'Search & Matching',
    question: 'Can I search based on specific Kongu Kootam or native towns?',
    questionTa: 'குறிப்பிட்ட கூட்ட முறை அல்லது சொந்த ஊர் அடிப்படையில் வரன் தேட முடியுமா?',
    answer: 'Yes, our Advanced Search includes specialized filters for Kongu Vellalar Kootams, Kula Deivam temples, Native districts (Coimbatore, Erode, Tiruppur, Salem, Namakkal, Karur), and global NRI locations.',
    answerTa: 'ஆம், எங்கள் விரிவான தேடலில் கொங்கு கூட்டங்கள், குலதெய்வம், சொந்த ஊர் மற்றும் வெளிநாட்டு (NRI) வரன்களைத் தனித்தனியாக வடிகட்டித் தேடலாம்.'
  }
];
