import React, { useState } from 'react';
import { Profile } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  X,
  Upload,
  Image as ImageIcon,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Shield,
  Eye,
  Lock,
  Sparkles,
  Check,
  Edit2,
  AlertCircle
} from 'lucide-react';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
  onUpdatePhotos: (photos: string[], captions: Record<string, string>, photoPrivacy: 'public' | 'members_only' | 'on_request') => void;
}

const SAMPLE_PHOTO_PRESETS_MALE = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
];

const SAMPLE_PHOTO_PRESETS_FEMALE = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
];

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdatePhotos
}) => {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<string[]>(currentUser.photos || []);
  const [captions, setCaptions] = useState<Record<string, string>>(currentUser.photoCaptions || {});
  const [photoPrivacy, setPhotoPrivacy] = useState<'public' | 'members_only' | 'on_request'>(currentUser.photoPrivacy || 'public');
  const [editingCaptionIdx, setEditingCaptionIdx] = useState<number | null>(null);
  const [captionInput, setCaptionInput] = useState('');
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const presets = currentUser.gender === 'female' ? SAMPLE_PHOTO_PRESETS_FEMALE : SAMPLE_PHOTO_PRESETS_MALE;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newPhotoUrl = event.target.result as string;
        setPhotos(prev => [...prev, newPhotoUrl]);
        showToast('Photo added to gallery (Mock Upload)', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddPreset = (url: string) => {
    if (photos.includes(url)) {
      showToast('Photo already in your album', 'info');
      return;
    }
    setPhotos(prev => [...prev, url]);
    showToast('Photo added from sample gallery', 'success');
  };

  const handleAddCustomUrl = () => {
    if (!customUrl.trim()) return;
    if (photos.includes(customUrl.trim())) {
      showToast('Photo already in your album', 'info');
      return;
    }
    setPhotos(prev => [...prev, customUrl.trim()]);
    setCustomUrl('');
    showToast('Photo URL added to album', 'success');
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const newPhotos = [...photos];
    const [selected] = newPhotos.splice(index, 1);
    newPhotos.unshift(selected);
    setPhotos(newPhotos);
    showToast('Primary profile photo updated', 'success');
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const newPhotos = [...photos];
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;
    setPhotos(newPhotos);
  };

  const confirmDelete = () => {
    if (photoToDelete === null) return;
    if (photos.length <= 1) {
      showToast('At least 1 photo is recommended for a matrimonial profile', 'info');
    }
    const targetUrl = photos[photoToDelete];
    const newPhotos = photos.filter((_, idx) => idx !== photoToDelete);
    setPhotos(newPhotos);
    
    // cleanup caption
    if (targetUrl && captions[targetUrl]) {
      const newCaptions = { ...captions };
      delete newCaptions[targetUrl];
      setCaptions(newCaptions);
    }
    setPhotoToDelete(null);
    showToast('Photo removed', 'info');
  };

  const startEditCaption = (index: number) => {
    setEditingCaptionIdx(index);
    const photoUrl = photos[index];
    setCaptionInput(captions[photoUrl] || '');
  };

  const saveCaption = (index: number) => {
    const photoUrl = photos[index];
    setCaptions(prev => ({
      ...prev,
      [photoUrl]: captionInput.trim()
    }));
    setEditingCaptionIdx(null);
    showToast('Photo caption saved', 'success');
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdatePhotos(photos, captions, photoPrivacy);
      setIsSaving(false);
      showToast('Photo album and visibility saved successfully!', 'success');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#160A0D] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-[#EFE6DA] dark:border-amber-500/30 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A1C2E] via-[#5C1020] to-[#3B0712] text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif-brand text-amber-200">
                Photo Manager & Privacy
              </h2>
              <p className="text-xs text-amber-100/80">
                Manage your photos, set primary avatar, add captions & configure privacy
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

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {/* Privacy Level Selector Bar */}
          <div className="bg-amber-50/70 dark:bg-stone-800/60 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 dark:text-amber-200 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#7A1C2E] dark:text-amber-400" />
                Photo Privacy Setting
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Respected in search & public profile view
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPhotoPrivacy('public')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  photoPrivacy === 'public'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 shadow-xs'
                    : 'bg-white dark:bg-stone-800/90 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Visible to All
                  </span>
                  {photoPrivacy === 'public' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[10px] opacity-75 mt-1">Recommended for 3x faster family responses</p>
              </button>

              <button
                type="button"
                onClick={() => setPhotoPrivacy('members_only')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  photoPrivacy === 'members_only'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-300 shadow-xs'
                    : 'bg-white dark:bg-stone-800/90 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Members Only
                  </span>
                  {photoPrivacy === 'members_only' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[10px] opacity-75 mt-1">Only logged-in verified members can view</p>
              </button>

              <button
                type="button"
                onClick={() => setPhotoPrivacy('on_request')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  photoPrivacy === 'on_request'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-300 shadow-xs'
                    : 'bg-white dark:bg-stone-800/90 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> On Request Only
                  </span>
                  {photoPrivacy === 'on_request' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </div>
                <p className="text-[10px] opacity-75 mt-1">Blurred in public; unlocked on your approval</p>
              </button>
            </div>
          </div>

          {/* Current Gallery Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>My Photos ({photos.length})</span>
                <span className="text-[11px] font-normal text-stone-500">First photo is your primary profile avatar</span>
              </h3>
            </div>

            {photos.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl bg-stone-50/50 dark:bg-stone-800/20">
                <ImageIcon className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">No photos uploaded yet</p>
                <p className="text-xs text-stone-500 mt-1">Upload from your device or select from sample templates below</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((url, idx) => {
                  const isPrimary = idx === 0;
                  const currentCaption = captions[url] || '';

                  return (
                    <div
                      key={`${url}-${idx}`}
                      className={`relative rounded-2xl overflow-hidden border bg-white dark:bg-stone-800 shadow-sm flex flex-col transition group ${
                        isPrimary
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative aspect-4/5 w-full bg-stone-100 dark:bg-stone-900 overflow-hidden">
                        <img
                          src={url}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />

                        {/* Primary Badge */}
                        {isPrimary && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-stone-950" />
                            <span>Primary Photo</span>
                          </div>
                        )}

                        {/* Position Indicator */}
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Control toolbar */}
                      <div className="p-3 bg-stone-50 dark:bg-stone-850 border-t border-stone-100 dark:border-stone-800 space-y-2">
                        {/* Action buttons */}
                        <div className="flex items-center justify-between gap-1 text-xs">
                          {!isPrimary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              className="px-2 py-1 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-300 font-bold rounded-lg text-[10px] transition flex items-center gap-1"
                              title="Make this your primary profile photo"
                            >
                              <Star className="w-3 h-3 text-amber-600" />
                              <span>Make Primary</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Main Profile
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMove(idx, 'left')}
                                className="p-1 rounded bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-200"
                                title="Move left"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {idx < photos.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMove(idx, 'right')}
                                className="p-1 rounded bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-200"
                                title="Move right"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setPhotoToDelete(idx)}
                              className="p-1 rounded bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-700 dark:text-rose-400"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Caption input / view */}
                        {editingCaptionIdx === idx ? (
                          <div className="space-y-1.5 pt-1">
                            <input
                              type="text"
                              value={captionInput}
                              onChange={(e) => setCaptionInput(e.target.value)}
                              placeholder="e.g. Traditional temple visit"
                              className="w-full text-xs px-2 py-1 rounded bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-hidden focus:border-[#7A1C2E]"
                              maxLength={60}
                            />
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingCaptionIdx(null)}
                                className="text-[10px] px-2 py-0.5 text-stone-500 hover:text-stone-700"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => saveCaption(idx)}
                                className="text-[10px] px-2 py-0.5 bg-[#7A1C2E] text-white font-bold rounded"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditCaption(idx)}
                            className="text-[11px] text-stone-600 dark:text-stone-300 hover:text-[#7A1C2E] dark:hover:text-amber-300 cursor-pointer flex items-center justify-between pt-1 border-t border-stone-200/50 dark:border-stone-700/50"
                          >
                            <span className="truncate italic">
                              {currentCaption ? `"${currentCaption}"` : '+ Add caption'}
                            </span>
                            <Edit2 className="w-3 h-3 text-stone-400 shrink-0 ml-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upload and Sample Presets Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Upload from Device (Mock File Reader) */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/40 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#7A1C2E]/10 dark:bg-amber-400/10 text-[#7A1C2E] dark:text-amber-300 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Upload Photo from Device
                </p>
                <p className="text-[10px] text-stone-500">Supports JPG, PNG up to 5MB (Simulated upload)</p>
              </div>
              <label className="cursor-pointer px-4 py-2 bg-[#7A1C2E] hover:bg-[#5C1020] text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Browse Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Sample Matrimonial Portraits */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Quick Matrimonial Templates
                </span>
                <span className="text-[10px] text-stone-500">Click to add</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {presets.map((presetUrl, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleAddPreset(presetUrl)}
                    className="aspect-square rounded-xl overflow-hidden border border-stone-300 hover:border-amber-400 hover:scale-105 transition shadow-xs relative group"
                    title="Click to add photo"
                  >
                    <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 pt-1">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="Or paste direct image URL..."
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 flex-1 focus:outline-hidden focus:border-[#7A1C2E]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomUrl}
                  className="px-3 py-1.5 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 dark:bg-stone-850 px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {photos.length} photo(s) in album
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold text-xs rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
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
                  <span>Save Album & Privacy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {photoToDelete !== null && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="text-base font-bold text-stone-900 dark:text-white">Delete Photo?</h4>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Are you sure you want to remove this photo from your matrimonial album?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
