import React, { useState, useEffect } from 'react';
import { Profile, FoodPreference, FamilyType, FamilyValues, MaritalStatus, DoshamType, PrivacySettings } from '../../types';
import { useToast } from '../../context/ToastContext';
import { TAMIL_NAKSHATRAS } from '../../services/horoscopeService';
import {
  X,
  Check,
  User,
  BookOpen,
  Briefcase,
  Users,
  Heart,
  Sparkles,
  Shield,
  Plus,
  Trash2,
  Lock,
  Eye,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export type EditModalType =
  | 'basic'
  | 'about'
  | 'career'
  | 'family'
  | 'lifestyle'
  | 'preferences'
  | 'horoscope'
  | 'privacy'
  | null;

interface ProfileSectionModalsProps {
  activeModal: EditModalType;
  onClose: () => void;
  currentUser: Profile;
  onSaveProfile: (updated: Partial<Profile>) => void;
}

const TAMIL_RASIS = [
  'Mesham (Aries)',
  'Rishabham (Taurus)',
  'Mithunam (Gemini)',
  'Kadagam (Cancer)',
  'Simmam (Leo)',
  'Kanni (Virgo)',
  'Thulaam (Libra)',
  'Viruchigam (Scorpio)',
  'Dhanusu (Sagittarius)',
  'Makaram (Capricorn)',
  'Kumbam (Aquarius)',
  'Meenam (Pisces)'
];

const KONGU_KOOTAMS = [
  'Vellode Kootam',
  'Sengunni Kootam',
  'Porulanthai Kootam',
  'Semban Kootam',
  'Pavalampalayam Kootam',
  'Kannan Kootam',
  'Kavalan Kootam',
  'Pillan Kootam',
  'Kari Kootam',
  'Muthan Kootam',
  'Eenjan Kootam',
  'Aadhirai Kootam',
  'Kaada Kootam',
  'Vilayan Kootam',
  'Thazhinji Kootam',
  'Other Kongu Kootam'
];

const POPULAR_HOBBIES = [
  'Carnatic Vocal',
  'Classical Bharatanatyam',
  'Organic Farming',
  'Badminton & Tennis',
  'Trekking & Nature',
  'Book Reading',
  'Tamil Literature',
  'Temple Architecture',
  'Cooking & Baking',
  'Photography',
  'Yoga & Meditation'
];

const POPULAR_INTERESTS = [
  'Artificial Intelligence',
  'Sustainable Living',
  'Industrial Business',
  'Stock Investments',
  'Travel & Roadtrips',
  'Interior Designing',
  'Social Service'
];

const POPULAR_LANGUAGES = ['Tamil', 'English', 'Telugu', 'Kannada', 'Hindi', 'Malayalam', 'German', 'French'];

export const ProfileSectionModals: React.FC<ProfileSectionModalsProps> = ({
  activeModal,
  onClose,
  currentUser,
  onSaveProfile
}) => {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form states initialized with currentUser data
  // Basic Info State
  const [name, setName] = useState(currentUser.name || '');
  const [gender, setGender] = useState(currentUser.gender || 'male');
  const [age, setAge] = useState(currentUser.age || 27);
  const [dateOfBirth, setDateOfBirth] = useState(currentUser.dateOfBirth || '1997-05-15');
  const [height, setHeight] = useState(currentUser.height || "5 ft 8 in / 173 cm");
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(currentUser.maritalStatus || 'never_married');
  const [motherTongue, setMotherTongue] = useState(currentUser.motherTongue || 'Tamil');
  const [city, setCity] = useState(currentUser.city || 'Coimbatore');
  const [district, setDistrict] = useState(currentUser.district || 'Coimbatore');
  const [nativePlace, setNativePlace] = useState(currentUser.nativePlace || 'Pollachi');

  // About Me State
  const [aboutMe, setAboutMe] = useState(currentUser.aboutMe || '');

  // Career & Education State
  const [education, setEducation] = useState(currentUser.education || 'B.E. (Hons), M.S.');
  const [degree, setDegree] = useState(currentUser.degree || 'M.S. in Computer Science');
  const [college, setCollege] = useState(currentUser.college || currentUser.institution || 'PSG College of Technology');
  const [profession, setProfession] = useState(currentUser.profession || 'Senior Software Engineer');
  const [designation, setDesignation] = useState(currentUser.designation || 'Lead Architect');
  const [industry, setIndustry] = useState(currentUser.industry || 'Information Technology');
  const [company, setCompany] = useState(currentUser.company || 'Zoho Corporation');
  const [income, setIncome] = useState(currentUser.income || '₹ 20 - 25 Lakhs / yr');

  // Family State
  const [fatherName, setFatherName] = useState(currentUser.fatherName || '');
  const [fatherOccupation, setFatherOccupation] = useState(currentUser.fatherOccupation || 'Civil Engineer & Contractor');
  const [motherName, setMotherName] = useState(currentUser.motherName || '');
  const [motherOccupation, setMotherOccupation] = useState(currentUser.motherOccupation || 'Homemaker');
  const [brothersCount, setBrothersCount] = useState(currentUser.brothersCount || 0);
  const [brothersMarried, setBrothersMarried] = useState(currentUser.brothersMarried || 0);
  const [sistersCount, setSistersCount] = useState(currentUser.sistersCount || 0);
  const [sistersMarried, setSistersMarried] = useState(currentUser.sistersMarried || 0);
  const [familyType, setFamilyType] = useState<FamilyType>(currentUser.familyType || 'nuclear');
  const [familyValues, setFamilyValues] = useState<FamilyValues>(currentUser.familyValues || 'moderate');
  const [familyStatus, setFamilyStatus] = useState(currentUser.familyStatus || 'upper_middle_class');
  const [familyLocation, setFamilyLocation] = useState(currentUser.familyLocation || 'Coimbatore, Tamil Nadu');
  const [kootamGothram, setKootamGothram] = useState(currentUser.kootamGothram || 'Vellode Kootam');
  const [kulaDeivam, setKulaDeivam] = useState(currentUser.kulaDeivam || 'Sellandi Amman, Anthiyur');
  const [aboutFamily, setAboutFamily] = useState(currentUser.aboutFamily || '');

  // Lifestyle State
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(currentUser.foodPreference || 'vegetarian');
  const [smoking, setSmoking] = useState(currentUser.smoking || false);
  const [drinking, setDrinking] = useState(currentUser.drinking || false);
  const [hobbies, setHobbies] = useState<string[]>(currentUser.hobbies || ['Carnatic Vocal', 'Badminton']);
  const [interests, setInterests] = useState<string[]>(currentUser.interests || ['Artificial Intelligence', 'Farming']);
  const [languages, setLanguages] = useState<string[]>(currentUser.languages || ['Tamil', 'English']);
  const [newHobbyInput, setNewHobbyInput] = useState('');

  // Partner Preferences State
  const [prefAgeMin, setPrefAgeMin] = useState(currentUser.partnerPreferences?.ageRange[0] || 22);
  const [prefAgeMax, setPrefAgeMax] = useState(currentUser.partnerPreferences?.ageRange[1] || 28);
  const [prefLocations, setPrefLocations] = useState<string[]>(currentUser.partnerPreferences?.locations || ['Coimbatore', 'Erode', 'Tiruppur', 'Chennai']);
  const [prefEducation, setPrefEducation] = useState<string[]>(currentUser.partnerPreferences?.educationLevels || ['B.E./B.Tech', 'M.S. Abroad', 'MBBS', 'CA']);
  const [prefProfessions, setPrefProfessions] = useState<string[]>(currentUser.partnerPreferences?.professions || ['Software Engineer', 'Doctor', 'Business / Industrialist']);
  const [prefCommunities, setPrefCommunities] = useState<string[]>(currentUser.partnerPreferences?.communities || ['Kongu Vellalar']);
  const [prefDiet, setPrefDiet] = useState<FoodPreference[]>(currentUser.partnerPreferences?.foodPreference || ['vegetarian', 'non_vegetarian']);
  const [prefDosham, setPrefDosham] = useState(currentUser.partnerPreferences?.doshamAcceptable ?? true);
  const [newPrefLoc, setNewPrefLoc] = useState('');

  // Horoscope State
  const [rasi, setRasi] = useState(currentUser.horoscope.rasi || 'Simmam (Leo)');
  const [nakshatra, setNakshatra] = useState(currentUser.horoscope.nakshatra || 'Uthiram');
  const [padam, setPadam] = useState(currentUser.horoscope.padam || 1);
  const [lagnam, setLagnam] = useState(currentUser.horoscope.lagnam || 'Mesham');
  const [birthPlace, setBirthPlace] = useState(currentUser.horoscope.birthPlace || 'Pollachi');
  const [birthDate, setBirthDate] = useState(currentUser.horoscope.birthDate || '1997-05-15');
  const [birthTime, setBirthTime] = useState(currentUser.horoscope.birthTime || '07:45 AM');
  const [dosham, setDosham] = useState<DoshamType>(currentUser.horoscope.dosham || 'no_dosham');
  const [horoscopeHidden, setHoroscopeHidden] = useState(currentUser.horoscopeHidden || false);

  // Privacy State
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(currentUser.privacySettings || {
    hidePhoneNumber: false,
    hideEmail: true,
    photoVisibility: currentUser.photoPrivacy || 'public',
    horoscopeVisibility: currentUser.horoscopeHidden ? 'on_request' : 'public',
    profileVisibility: 'all',
    allowVisitorsTracking: true,
    lastSeenVisibility: true,
    blockedProfileIds: [],
    contactAccessPreference: 'interests_accepted_only'
  });

  // Re-sync when currentUser changes
  useEffect(() => {
    setName(currentUser.name || '');
    setGender(currentUser.gender || 'male');
    setAge(currentUser.age || 27);
    setDateOfBirth(currentUser.dateOfBirth || '1997-05-15');
    setHeight(currentUser.height || "5 ft 8 in / 173 cm");
    setMaritalStatus(currentUser.maritalStatus || 'never_married');
    setMotherTongue(currentUser.motherTongue || 'Tamil');
    setCity(currentUser.city || 'Coimbatore');
    setDistrict(currentUser.district || 'Coimbatore');
    setNativePlace(currentUser.nativePlace || 'Pollachi');
    setAboutMe(currentUser.aboutMe || '');
    setEducation(currentUser.education || '');
    setDegree(currentUser.degree || '');
    setCollege(currentUser.college || '');
    setProfession(currentUser.profession || '');
    setDesignation(currentUser.designation || '');
    setIndustry(currentUser.industry || '');
    setCompany(currentUser.company || '');
    setIncome(currentUser.income || '');
    setFatherName(currentUser.fatherName || '');
    setFatherOccupation(currentUser.fatherOccupation || '');
    setMotherName(currentUser.motherName || '');
    setMotherOccupation(currentUser.motherOccupation || '');
    setBrothersCount(currentUser.brothersCount || 0);
    setBrothersMarried(currentUser.brothersMarried || 0);
    setSistersCount(currentUser.sistersCount || 0);
    setSistersMarried(currentUser.sistersMarried || 0);
    setFamilyType(currentUser.familyType || 'nuclear');
    setFamilyValues(currentUser.familyValues || 'moderate');
    setFamilyStatus(currentUser.familyStatus || 'upper_middle_class');
    setFamilyLocation(currentUser.familyLocation || '');
    setKootamGothram(currentUser.kootamGothram || 'Vellode Kootam');
    setKulaDeivam(currentUser.kulaDeivam || 'Sellandi Amman');
    setAboutFamily(currentUser.aboutFamily || '');
    setFoodPreference(currentUser.foodPreference || 'vegetarian');
    setSmoking(currentUser.smoking || false);
    setDrinking(currentUser.drinking || false);
    setHobbies(currentUser.hobbies || []);
    setInterests(currentUser.interests || []);
    setLanguages(currentUser.languages || ['Tamil', 'English']);
    setRasi(currentUser.horoscope.rasi || 'Simmam (Leo)');
    setNakshatra(currentUser.horoscope.nakshatra || 'Uthiram');
    setPadam(currentUser.horoscope.padam || 1);
    setLagnam(currentUser.horoscope.lagnam || 'Mesham');
    setBirthPlace(currentUser.horoscope.birthPlace || 'Pollachi');
    setBirthDate(currentUser.horoscope.birthDate || '1997-05-15');
    setBirthTime(currentUser.horoscope.birthTime || '07:45 AM');
    setDosham(currentUser.horoscope.dosham || 'no_dosham');
    setHoroscopeHidden(currentUser.horoscopeHidden || false);
  }, [currentUser]);

  if (!activeModal) return null;

  const handleSave = (updates: Partial<Profile>, successMessage: string) => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveProfile(updates);
      setIsSaving(false);
      showToast(successMessage, 'success');
      onClose();
    }, 500);
  };

  const toggleItemInArray = (arr: string[], item: string) => {
    if (arr.includes(item)) {
      return arr.filter(i => i !== item);
    }
    return [...arr, item];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-[#EFE6DA] dark:border-amber-500/30 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-200">
              {activeModal === 'basic' && <User className="w-5 h-5" />}
              {activeModal === 'about' && <BookOpen className="w-5 h-5" />}
              {activeModal === 'career' && <Briefcase className="w-5 h-5" />}
              {activeModal === 'family' && <Users className="w-5 h-5" />}
              {activeModal === 'lifestyle' && <Heart className="w-5 h-5" />}
              {activeModal === 'preferences' && <SlidersHorizontal className="w-5 h-5" />}
              {activeModal === 'horoscope' && <Sparkles className="w-5 h-5" />}
              {activeModal === 'privacy' && <Shield className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif-brand text-amber-200 capitalize">
                {activeModal === 'basic' && 'Edit Basic Information'}
                {activeModal === 'about' && 'Edit About Me'}
                {activeModal === 'career' && 'Edit Education & Career'}
                {activeModal === 'family' && 'Edit Family & Lineage'}
                {activeModal === 'lifestyle' && 'Edit Lifestyle & Hobbies'}
                {activeModal === 'preferences' && 'Edit Partner Preferences'}
                {activeModal === 'horoscope' && 'Horoscope & Astrology'}
                {activeModal === 'privacy' && 'Privacy & Visibility Settings'}
              </h2>
              <p className="text-xs text-amber-100/80">
                Keep your profile updated for authentic Kongu matrimonial matches
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4">
          {/* 1. BASIC INFO FORM */}
          {activeModal === 'basic' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  >
                    <option value="male">Groom (மணமகன் - Male)</option>
                    <option value="female">Bride (மணமகள் - Female)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={18}
                    max={70}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Date of Birth *</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Height *</label>
                  <select
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  >
                    <option value="5 ft 0 in / 152 cm">5 ft 0 in (152 cm)</option>
                    <option value="5 ft 2 in / 157 cm">5 ft 2 in (157 cm)</option>
                    <option value="5 ft 4 in / 163 cm">5 ft 4 in (163 cm)</option>
                    <option value="5 ft 6 in / 168 cm">5 ft 6 in (168 cm)</option>
                    <option value="5 ft 8 in / 173 cm">5 ft 8 in (173 cm)</option>
                    <option value="5 ft 10 in / 178 cm">5 ft 10 in (178 cm)</option>
                    <option value="6 ft 0 in / 183 cm">6 ft 0 in (183 cm)</option>
                    <option value="6 ft 2 in / 188 cm">6 ft 2 in (188 cm)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Marital Status *</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  >
                    <option value="never_married">Never Married (முதல் மணம்)</option>
                    <option value="divorced">Divorced (மறுமணம்)</option>
                    <option value="widowed">Widowed (துணை இழந்தவர்)</option>
                    <option value="separated">Separated</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Ancestral Native Place *</label>
                  <input
                    type="text"
                    value={nativePlace}
                    onChange={(e) => setNativePlace(e.target.value)}
                    placeholder="e.g. Pollachi / Gobichettipalayam"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Currently Residing City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. RS Puram, Coimbatore"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. ABOUT ME FORM WITH CHARACTER COUNTER */}
          {activeModal === 'about' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Write About Yourself (Personality, Values & Expectations) *
                </label>
                <span className={`text-[11px] font-mono font-bold ${
                  aboutMe.length > 900 ? 'text-rose-600' : 'text-stone-500'
                }`}>
                  {aboutMe.length} / 1000 characters
                </span>
              </div>

              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                maxLength={1000}
                rows={6}
                placeholder="Share about your upbringing, personal passions, career goals, Kongu cultural ties, and the kind of partner you hope to build a happy life with..."
                className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E] leading-relaxed text-xs"
              />

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-500/20 space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Matrimonial Writing Tip
                </span>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-200/90">
                  Profiles with 3-4 sentences detailing both modern career ambitions and rooted Kongu values receive 3x more genuine parental inquiries.
                </p>
              </div>
            </div>
          )}

          {/* 3. EDUCATION & CAREER FORM */}
          {activeModal === 'career' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Highest Education Qualification *</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. B.E. (CSE), M.S. Data Science"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Degree Speciliazation</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. M.S. in Computer Science"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Institution / College Name</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. PSG College of Tech / Anna University"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Profession / Job Role *</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Senior Software Architect / Doctor / CA"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Industry *</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  >
                    <option value="Information Technology">Information Technology & Software</option>
                    <option value="Healthcare & Medicine">Healthcare, Doctors & Medicine</option>
                    <option value="Finance & Banking">Chartered Accountancy & Finance</option>
                    <option value="Manufacturing & Textiles">Kongu Industrial & Textiles</option>
                    <option value="Civil & Real Estate">Civil, Infrastructure & Real Estate</option>
                    <option value="Agriculture & Dairy">Modern Agriculture & Agrotech</option>
                    <option value="Government & Civil Services">Govt / TNPSC / UPSC Civil Services</option>
                    <option value="Other">Other Profession</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Company / Employer Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Bosch Global / Own Business / Hospital"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Annual Income Range *</label>
                  <select
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  >
                    <option value="₹ 6 - 10 Lakhs / yr">₹ 6 - 10 Lakhs / yr</option>
                    <option value="₹ 10 - 15 Lakhs / yr">₹ 10 - 15 Lakhs / yr</option>
                    <option value="₹ 15 - 20 Lakhs / yr">₹ 15 - 20 Lakhs / yr</option>
                    <option value="₹ 20 - 30 Lakhs / yr">₹ 20 - 30 Lakhs / yr</option>
                    <option value="₹ 30 - 50 Lakhs / yr">₹ 30 - 50 Lakhs / yr</option>
                    <option value="₹ 50 Lakhs+ / yr">₹ 50 Lakhs+ / yr</option>
                    <option value="$ 100k - $ 150k / yr (Abroad)">$ 100k - $ 150k / yr (USA / Abroad)</option>
                    <option value="$ 150k+ / yr (Abroad)">$ 150k+ / yr (USA / Abroad)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 4. FAMILY & KOOTAM FORM */}
          {activeModal === 'family' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Father's Name & Occupation *</label>
                  <input
                    type="text"
                    value={fatherOccupation}
                    onChange={(e) => setFatherOccupation(e.target.value)}
                    placeholder="e.g. S. Subramanian, Senior Civil Engineer (Retd)"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Mother's Name & Occupation *</label>
                  <input
                    type="text"
                    value={motherOccupation}
                    onChange={(e) => setMotherOccupation(e.target.value)}
                    placeholder="e.g. S. Kalyani, High School Principal / Homemaker"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Brothers (Total / Married)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={brothersCount}
                      onChange={(e) => setBrothersCount(Number(e.target.value))}
                      min={0}
                      className="w-1/2 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                      placeholder="Total"
                    />
                    <input
                      type="number"
                      value={brothersMarried}
                      onChange={(e) => setBrothersMarried(Number(e.target.value))}
                      min={0}
                      className="w-1/2 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                      placeholder="Married"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Sisters (Total / Married)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={sistersCount}
                      onChange={(e) => setSistersCount(Number(e.target.value))}
                      min={0}
                      className="w-1/2 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                      placeholder="Total"
                    />
                    <input
                      type="number"
                      value={sistersMarried}
                      onChange={(e) => setSistersMarried(Number(e.target.value))}
                      min={0}
                      className="w-1/2 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                      placeholder="Married"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Kongu Kootam / Gothram *</label>
                  <select
                    value={kootamGothram}
                    onChange={(e) => setKootamGothram(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  >
                    {KONGU_KOOTAMS.map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Kula Deivam (குலதெய்வம்) & Location *</label>
                  <input
                    type="text"
                    value={kulaDeivam}
                    onChange={(e) => setKulaDeivam(e.target.value)}
                    placeholder="e.g. Sellandi Amman, Anthiyur"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Family Type & Values</label>
                  <div className="flex gap-2">
                    <select
                      value={familyType}
                      onChange={(e) => setFamilyType(e.target.value as FamilyType)}
                      className="w-1/2 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                    >
                      <option value="nuclear">Nuclear (தனிக்குடும்பம்)</option>
                      <option value="joint">Joint (கூட்டுக் குடும்பம்)</option>
                    </select>
                    <select
                      value={familyValues}
                      onChange={(e) => setFamilyValues(e.target.value as FamilyValues)}
                      className="w-1/2 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                    >
                      <option value="traditional">Traditional</option>
                      <option value="moderate">Moderate</option>
                      <option value="liberal">Liberal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Family Settled Location</label>
                  <input
                    type="text"
                    value={familyLocation}
                    onChange={(e) => setFamilyLocation(e.target.value)}
                    placeholder="e.g. Coimbatore, Tamil Nadu"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300">About Family Write-up</label>
                  <textarea
                    value={aboutFamily}
                    onChange={(e) => setAboutFamily(e.target.value)}
                    rows={3}
                    placeholder="Describe family background, ancestral properties/agriculture, relations..."
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-hidden focus:border-[#7A1C2E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. LIFESTYLE & HOBBIES FORM */}
          {activeModal === 'lifestyle' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Food Preference *</label>
                  <select
                    value={foodPreference}
                    onChange={(e) => setFoodPreference(e.target.value as FoodPreference)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="vegetarian">Vegetarian (சைவம்)</option>
                    <option value="non_vegetarian">Non-Vegetarian (அசைவம்)</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Smoking</label>
                  <select
                    value={smoking ? 'yes' : 'no'}
                    onChange={(e) => setSmoking(e.target.value === 'yes')}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="no">No / Non-Smoker</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Drinking</label>
                  <select
                    value={drinking ? 'yes' : 'no'}
                    onChange={(e) => setDrinking(e.target.value === 'yes')}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="no">No / Non-Drinker</option>
                    <option value="yes">Social Drinker</option>
                  </select>
                </div>
              </div>

              {/* Hobbies selection pills */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  Hobbies & Personal Interests (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_HOBBIES.map(hobby => {
                    const isSelected = hobbies.includes(hobby);
                    return (
                      <button
                        key={hobby}
                        type="button"
                        onClick={() => setHobbies(toggleItemInArray(hobbies, hobby))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#7A1C2E] text-white shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{hobby}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Languages Known */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <label className="font-bold text-stone-700 dark:text-stone-300 block">
                  Languages Known
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_LANGUAGES.map(lang => {
                    const isSelected = languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguages(toggleItemInArray(languages, lang))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{lang}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 6. PARTNER PREFERENCES FORM */}
          {activeModal === 'preferences' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    Partner Age Range ({prefAgeMin} to {prefAgeMax} yrs)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={prefAgeMin}
                      onChange={(e) => setPrefAgeMin(Number(e.target.value))}
                      min={18}
                      max={60}
                      className="w-1/2 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                      placeholder="Min Age"
                    />
                    <span className="text-stone-400">to</span>
                    <input
                      type="number"
                      value={prefAgeMax}
                      onChange={(e) => setPrefAgeMax(Number(e.target.value))}
                      min={18}
                      max={65}
                      className="w-1/2 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                      placeholder="Max Age"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Marital Status Acceptable</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="never_married">Never Married Only</option>
                    <option value="all">Any Status (Never Married / Divorced)</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Preferred Locations</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Coimbatore', 'Erode', 'Tiruppur', 'Salem', 'Chennai', 'Bengaluru', 'USA', 'UK', 'Singapore'].map(loc => {
                      const isSel = prefLocations.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setPrefLocations(toggleItemInArray(prefLocations, loc))}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                            isSel ? 'bg-[#7A1C2E] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {loc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Preferred Professions</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Software Engineer', 'Doctor (MBBS/MD)', 'Business / Industrialist', 'Chartered Accountant', 'Govt Officer', 'Professor / Academic'].map(prof => {
                      const isSel = prefProfessions.includes(prof);
                      return (
                        <button
                          key={prof}
                          type="button"
                          onClick={() => setPrefProfessions(toggleItemInArray(prefProfessions, prof))}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                            isSel ? 'bg-amber-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {prof}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Horoscope & Dosham Preference</label>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefDosham}
                        onChange={(e) => setPrefDosham(e.target.checked)}
                        className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E]"
                      />
                      <span>Accept Chevvai / Rahu-Ketu Dosham matches if charts align</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. HOROSCOPE FORM */}
          {activeModal === 'horoscope' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Rasi (ராசி) *</label>
                  <select
                    value={rasi}
                    onChange={(e) => setRasi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    {TAMIL_RASIS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Nakshatra / Star (நட்சத்திரம்) *</label>
                  <select
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    {TAMIL_NAKSHATRAS.map(n => (
                      <option key={n.nameEn} value={n.nameEn}>
                        {n.nameEn} ({n.nameTa})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Padam (பாதம்)</label>
                  <select
                    value={padam}
                    onChange={(e) => setPadam(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value={1}>1 ஆம் பாதம்</option>
                    <option value={2}>2 ஆம் பாதம்</option>
                    <option value={3}>3 ஆம் பாதம்</option>
                    <option value={4}>4 ஆம் பாதம்</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Lagnam (லக்னம்)</label>
                  <select
                    value={lagnam}
                    onChange={(e) => setLagnam(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    {TAMIL_RASIS.map(r => (
                      <option key={r.split(' ')[0]} value={r.split(' ')[0]}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Birth Place (பிறந்த இடம்) *</label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="e.g. Pollachi / Erode / Coimbatore"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Birth Time (பிறந்த நேரம்) *</label>
                  <input
                    type="text"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    placeholder="e.g. 07:45 AM"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Dosham Details (தோஷ விவரம்) *</label>
                  <select
                    value={dosham}
                    onChange={(e) => setDosham(e.target.value as DoshamType)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="no_dosham">Suddha Jathagam (சுத்த ஜாதகம் - No Dosham)</option>
                    <option value="sevvaai_dosham">Sevvai Dosham (செவ்வாய் தோஷம்)</option>
                    <option value="rahu_ketu_dosham">Rahu - Ketu Dosham (ராகு கேது தோஷம்)</option>
                    <option value="kala_sarpa">Kala Sarpa Dosham</option>
                    <option value="dont_know">Don't Know / Need Astrologer Verification</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-stone-800 dark:text-stone-200 block">
                        Hide Horoscope from Public Profiles
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Only share horoscope details after you accept an interest request
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={horoscopeHidden}
                      onChange={(e) => setHoroscopeHidden(e.target.checked)}
                      className="w-4 h-4 rounded text-[#7A1C2E]"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 8. PRIVACY SETTINGS FORM */}
          {activeModal === 'privacy' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-3">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">Phone Number Visibility</span>
                      <span className="text-[10px] text-stone-500">Hide phone number from unverified users</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.hidePhoneNumber}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, hidePhoneNumber: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#7A1C2E]"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">Email Address Visibility</span>
                      <span className="text-[10px] text-stone-500">Hide email address from public search results</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.hideEmail}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, hideEmail: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#7A1C2E]"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">Last Active / Online Status</span>
                      <span className="text-[10px] text-stone-500">Show when you were last active on Kongu Nila</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.lastSeenVisibility}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, lastSeenVisibility: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#7A1C2E]"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <label className="font-bold text-stone-900 dark:text-white block">
                    Contact Access Rule
                  </label>
                  <select
                    value={privacySettings.contactAccessPreference}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      contactAccessPreference: e.target.value as PrivacySettings['contactAccessPreference']
                    }))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
                  >
                    <option value="interests_accepted_only">Only Members whose Interest I Accepted (Recommended)</option>
                    <option value="premium_only">Verified Premium Members Only</option>
                    <option value="anyone">Anyone with Verified Phone</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="bg-stone-50 dark:bg-stone-850 px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold text-xs rounded-xl transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              if (activeModal === 'basic') {
                handleSave(
                  { name, gender, age, dateOfBirth, height, maritalStatus, motherTongue, city, district, nativePlace },
                  'Basic Information saved successfully'
                );
              } else if (activeModal === 'about') {
                handleSave({ aboutMe }, 'About Me updated successfully');
              } else if (activeModal === 'career') {
                handleSave(
                  { education, degree, college, profession, designation, industry, company, income },
                  'Education & Career details saved successfully'
                );
              } else if (activeModal === 'family') {
                handleSave(
                  {
                    fatherName,
                    fatherOccupation,
                    motherName,
                    motherOccupation,
                    brothersCount,
                    brothersMarried,
                    sistersCount,
                    sistersMarried,
                    familyType,
                    familyValues,
                    familyStatus,
                    familyLocation,
                    kootamGothram,
                    kulaDeivam,
                    aboutFamily
                  },
                  'Family & Kootam details saved successfully'
                );
              } else if (activeModal === 'lifestyle') {
                handleSave(
                  { foodPreference, smoking, drinking, hobbies, interests, languages },
                  'Lifestyle & Hobbies saved successfully'
                );
              } else if (activeModal === 'preferences') {
                handleSave(
                  {
                    partnerPreferences: {
                      ...currentUser.partnerPreferences,
                      ageRange: [prefAgeMin, prefAgeMax],
                      heightRange: currentUser.partnerPreferences?.heightRange || [150, 185],
                      maritalStatus: currentUser.partnerPreferences?.maritalStatus || ['never_married'],
                      locations: prefLocations,
                      educationLevels: prefEducation,
                      professions: prefProfessions,
                      communities: prefCommunities,
                      subCastes: currentUser.partnerPreferences?.subCastes || [],
                      minAnnualIncome: currentUser.partnerPreferences?.minAnnualIncome || 12,
                      foodPreference: prefDiet,
                      doshamAcceptable: prefDosham
                    }
                  },
                  'Partner Preferences saved successfully'
                );
              } else if (activeModal === 'horoscope') {
                handleSave(
                  {
                    horoscope: {
                      ...currentUser.horoscope,
                      rasi,
                      nakshatra,
                      padam,
                      lagnam,
                      birthPlace,
                      birthDate,
                      birthTime,
                      dosham,
                      horoscopeAvailable: true
                    },
                    horoscopeHidden
                  },
                  'Horoscope details updated successfully'
                );
              } else if (activeModal === 'privacy') {
                handleSave({ privacySettings }, 'Privacy settings updated successfully');
              }
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-[#7A1C2E] to-[#5C1020] hover:from-[#5C1020] hover:to-[#4A0A17] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-amber-300" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
