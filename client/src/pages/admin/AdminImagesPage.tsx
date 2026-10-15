import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Sparkles,
  Layers,
  Building,
  User,
  Sliders,
  LayoutGrid,
} from 'lucide-react';
import { api, WebsiteImageItem } from '../../services/api.js';

type SectionFilter = 'all' | 'hero' | 'categories' | 'building' | 'owner' | 'about';

interface SectionMeta {
  key: SectionFilter;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionMeta[] = [
  {
    key: 'all',
    label: 'All Images',
    description: 'Every image currently active across the Jai Bharat website.',
    icon: LayoutGrid,
  },
  {
    key: 'hero',
    label: 'Homepage Banner / Hero',
    description: 'Rotating banner images on the homepage hero section.',
    icon: Sparkles,
  },
  {
    key: 'categories',
    label: 'Food and Biryani Sections',
    description: 'Category cards featured in the "Flavors You Can\'t Resist!" section.',
    icon: Layers,
  },
  {
    key: 'building',
    label: 'Restaurant Building / Location',
    description: 'Exterior photo featured in the "Find Your Jai Bharat" section.',
    icon: Building,
  },
  {
    key: 'owner',
    label: 'Owner Photo',
    description: 'Founder photo featured in the Homepage Quote section and About Us page.',
    icon: User,
  },
  {
    key: 'about',
    label: 'About Us',
    description: 'Culinary philosophy and story photo featured on the About Us page.',
    icon: Sliders,
  },
];

export const AdminImagesPage: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionFilter>('all');
  const [images, setImages] = useState<WebsiteImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State (Change Image / Add Image)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetItem, setModalTargetItem] = useState<WebsiteImageItem | null>(null);
  const [modalSection, setModalSection] = useState<string>('hero');
  const [modalTitle, setModalTitle] = useState('');
  const [modalAltText, setModalAltText] = useState('');
  const [modalUrl, setModalUrl] = useState('');
  const [modalIsDefault, setModalIsDefault] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  const [uploadSource, setUploadSource] = useState<'device' | 'url'>('device');

  // Delete Confirmation Modal State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<WebsiteImageItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminImages();
      setImages(data);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to load images from server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  // Filter images by current section filter
  const displayedImages = images
    .filter((img) => (selectedSection === 'all' ? true : img.section === selectedSection))
    .sort((a, b) => {
      if (a.section === 'hero' && b.section === 'hero') {
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return a.displayOrder - b.displayOrder;
      }
      return a.displayOrder - b.displayOrder;
    });

  const heroImages = images
    .filter((img) => img.section === 'hero')
    .sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return a.displayOrder - b.displayOrder;
    });

  // Get readable human label for a section
  const getSectionTitle = (sectionKey: string): string => {
    switch (sectionKey) {
      case 'hero':
        return 'Homepage Banner';
      case 'categories':
        return 'Food Section';
      case 'building':
        return 'Building / Location';
      case 'owner':
        return 'Owner Photo';
      case 'about':
        return 'About Us';
      default:
        return 'Website Image';
    }
  };

  // Get readable description of where the image is displayed
  const getImageLocation = (sectionKey: string): string => {
    switch (sectionKey) {
      case 'hero':
        return 'Homepage Rotating Carousel';
      case 'categories':
        return 'Homepage "Flavors You Can\'t Resist!"';
      case 'building':
        return 'Homepage "Find Your Jai Bharat"';
      case 'owner':
        return 'Homepage Quote & About Us Page';
      case 'about':
        return 'About Us "Culinary Philosophy"';
      default:
        return 'Public Website';
    }
  };

  // Open modal to Change an existing image
  const handleOpenChangeModal = (item: WebsiteImageItem) => {
    setModalTargetItem(item);
    setModalSection(item.section);
    setModalTitle(item.title);
    setModalAltText(item.altText || '');
    setModalUrl(item.imageUrl);
    setModalIsDefault(item.isDefault);
    setSelectedFile(null);
    setFilePreviewUrl('');
    setUploadSource('device');
    setIsModalOpen(true);
  };

  // Open modal to Add a new image (for Carousel)
  const handleOpenAddModal = (section: string) => {
    setModalTargetItem(null);
    setModalSection(section);
    setModalTitle('');
    setModalAltText('');
    setModalUrl('');
    setModalIsDefault(false);
    setSelectedFile(null);
    setFilePreviewUrl('');
    setUploadSource('device');
    setIsModalOpen(true);
  };

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFilePreviewUrl(objectUrl);

      // Auto-populate title if empty
      if (!modalTitle) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .trim();
        setModalTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  // Save changes (Uploads new file, then persists database record)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = modalTargetItem ? modalTargetItem.imageUrl : '';

      // If user selected a replacement file from device, upload it first
      if (uploadSource === 'device') {
        if (selectedFile) {
          const uploadRes = await api.uploadImageFile(selectedFile);
          finalImageUrl = uploadRes.imageUrl;
        } else if (!modalTargetItem) {
          throw new Error('Please select an image file to upload.');
        }
      } else if (uploadSource === 'url') {
        if (!modalUrl.trim()) {
          throw new Error('Please enter a valid image URL.');
        }
        finalImageUrl = modalUrl.trim();
      }

      if (!finalImageUrl) {
        throw new Error('An image source is required.');
      }

      if (modalTargetItem) {
        // Update existing record
        await api.updateWebsiteImage(modalTargetItem.id, {
          title: modalTitle || modalTargetItem.title,
          altText: modalAltText || modalTitle || modalTargetItem.title,
          imageUrl: finalImageUrl,
          isDefault: modalIsDefault,
        });
        showNotification('success', `"${modalTitle || modalTargetItem.title}" saved successfully!`);
      } else {
        // Create new record
        await api.createWebsiteImage({
          section: modalSection,
          title: modalTitle || 'New Image',
          altText: modalAltText || modalTitle || 'New Image',
          imageUrl: finalImageUrl,
          isDefault: modalIsDefault,
          isEnabled: true,
        });
        showNotification('success', 'New image uploaded and saved successfully!');
      }

      setIsModalOpen(false);
      await loadImages();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Set an image as the Default / First carousel image
  const handleSetDefault = async (item: WebsiteImageItem) => {
    setIsSaving(true);
    try {
      await api.setDefaultWebsiteImage(item.id);
      showNotification('success', `"${item.title}" is now set as the First image!`);
      await loadImages();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to set default image.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle enabled/disabled state
  const handleToggleEnabled = async (item: WebsiteImageItem) => {
    try {
      await api.updateWebsiteImage(item.id, { isEnabled: !item.isEnabled });
      showNotification(
        'success',
        `"${item.title}" is now ${!item.isEnabled ? 'active on the website' : 'hidden from view'}.`
      );
      await loadImages();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update status.');
    }
  };

  // Reorder hero carousel images (Move Up / Down)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const list = [...heroImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap items locally
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const items = list.map((item, idx) => ({
      id: item.id,
      displayOrder: idx,
    }));

    try {
      await api.reorderWebsiteImages(items);
      showNotification('success', 'Carousel order updated successfully!');
      await loadImages();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to reorder images.');
    }
  };

  // Confirm and execute image deletion
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmItem) return;
    try {
      await api.deleteWebsiteImage(deleteConfirmItem.id);
      showNotification('success', `"${deleteConfirmItem.title}" has been removed.`);
      setDeleteConfirmItem(null);
      await loadImages();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to remove image.');
    }
  };

  const activeMeta = SECTIONS.find((s) => s.key === selectedSection) || SECTIONS[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Image Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Change, replace, and organize images across all sections of the restaurant website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadImages}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 shadow-xs transition-colors"
            title="Refresh images"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>View Website</span>
          </a>
        </div>
      </div>

      {/* 2. Notification Alert */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* 3. Section Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isSelected = selectedSection === sec.key;
          const count =
            sec.key === 'all'
              ? images.length
              : images.filter((img) => img.section === sec.key).length;

          return (
            <button
              key={sec.key}
              onClick={() => setSelectedSection(sec.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200/90 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-stone-400'}`} />
              <span>{sec.label}</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Section Context Bar & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
        <div>
          <h2 className="text-sm sm:text-base font-serif font-bold text-stone-900">
            {activeMeta.label}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {activeMeta.description}
          </p>
        </div>

        {/* Upload Button for Hero Section */}
        {(selectedSection === 'hero' || selectedSection === 'all') && (
          <button
            onClick={() => handleOpenAddModal('hero')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#991b1b] hover:bg-[#7f1d1d] text-white shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Carousel Image</span>
          </button>
        )}
      </div>

      {/* 5. EQUAL-SIZED RESPONSIVE GRID */}
      {displayedImages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <p className="text-sm font-semibold text-stone-700">No images found in this section.</p>
          <p className="text-xs text-stone-400 mt-1">Select another section or click Refresh.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedImages.map((item) => {
            const heroIndex = heroImages.findIndex((h) => h.id === item.id);
            const isHero = item.section === 'hero';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between h-full ${
                  item.isDefault && isHero
                    ? 'border-amber-400 ring-2 ring-amber-400/30'
                    : 'border-stone-200/90'
                } ${!item.isEnabled ? 'opacity-65 bg-stone-50' : ''}`}
              >
                {/* Image Preview Area - 100% Equal Aspect Ratio [4/3] */}
                <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden border-b border-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                    {/* Default or Sequence badge */}
                    {isHero && item.isDefault ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        <span>First / Default</span>
                      </span>
                    ) : isHero ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-xs">
                        #{heroIndex + 1}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-900/70 text-stone-100 backdrop-blur-xs">
                        {getSectionTitle(item.section)}
                      </span>
                    )}

                    {/* Active / Hidden status */}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-xs shadow-xs ${
                        item.isEnabled
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-stone-700/90 text-stone-200'
                      }`}
                    >
                      {item.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Content Container - Equal Dimensions & Clean Readable Title */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        {getSectionTitle(item.section)}
                      </span>
                      {isHero && item.isDefault && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                          Loads First
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-serif font-bold text-stone-900 text-sm leading-snug mt-1 line-clamp-1"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                      {getImageLocation(item.section)}
                    </p>
                  </div>

                  {/* Actions Footer - Consistently Aligned */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5">
                    {/* Primary "Change Image" Button */}
                    <button
                      onClick={() => handleOpenChangeModal(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#991b1b] hover:bg-[#7f1d1d] text-white shadow-xs transition-colors"
                      title="Upload and replace this image"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Change Image</span>
                    </button>

                    {/* Carousel Specific Reorder & Default Buttons */}
                    {isHero && (
                      <>
                        {!item.isDefault && (
                          <button
                            onClick={() => handleSetDefault(item)}
                            disabled={isSaving}
                            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-300 transition-colors"
                            title="Set as First / Default image on homepage visit"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleMoveOrder(heroIndex, 'up')}
                          disabled={heroIndex === 0 || isSaving}
                          className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Earlier in Carousel Sequence"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleMoveOrder(heroIndex, 'down')}
                          disabled={heroIndex === heroImages.length - 1 || isSaving}
                          className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Later in Carousel Sequence"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => handleToggleEnabled(item)}
                      className={`p-2 rounded-xl border transition-colors ${
                        item.isEnabled
                          ? 'border-stone-200 text-stone-600 hover:bg-stone-100'
                          : 'border-emerald-300 text-emerald-700 bg-emerald-50'
                      }`}
                      title={item.isEnabled ? 'Disable / Hide from website' : 'Enable image'}
                    >
                      {item.isEnabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    {/* Remove Button for Carousel items */}
                    {isHero && (
                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        disabled={heroImages.length <= 1}
                        className="p-2 rounded-xl border border-stone-200 text-stone-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        title="Remove image from carousel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. CHANGE / UPLOAD IMAGE MODAL (WITH LIVE PREVIEW BEFORE SAVING) */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  {modalTargetItem ? 'Change Image' : 'Add New Carousel Image'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Section: {getSectionTitle(modalSection)}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Upload Source Toggle */}
              <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUploadSource('device')}
                  className={`flex-1 py-2 rounded-lg transition-colors text-center ${
                    uploadSource === 'device'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => setUploadSource('url')}
                  className={`flex-1 py-2 rounded-lg transition-colors text-center ${
                    uploadSource === 'url'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Use Image Link
                </button>
              </div>

              {/* Source A: Upload from Device */}
              {uploadSource === 'device' && (
                <div className="space-y-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-amber-50/20 flex flex-col items-center justify-center"
                  >
                    <Upload className="w-8 h-8 text-stone-400 mb-2" />
                    <p className="text-xs font-semibold text-stone-800">
                      {selectedFile ? selectedFile.name : 'Click to select photo from device'}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Supports JPG, JPEG, PNG, and WebP (up to 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Source B: Direct URL */}
              {uploadSource === 'url' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Image Link
                  </label>
                  <input
                    type="text"
                    value={modalUrl}
                    onChange={(e) => {
                      setModalUrl(e.target.value);
                      setFilePreviewUrl(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
              )}

              {/* PREVIEW CONTAINER: Compare Current Image vs Selected Replacement */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  {filePreviewUrl ? 'Selected New Preview' : 'Current Image Preview'}
                </span>

                <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={filePreviewUrl || (modalTargetItem ? modalTargetItem.imageUrl : '')}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      // ignore temporary typing errors
                    }}
                  />
                  {filePreviewUrl && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Ready to Save
                    </div>
                  )}
                </div>
              </div>

              {/* Image Title / Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  Image Name / Label
                </label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="e.g. Delicious Chicken Dum Biryani"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>

              {/* Hero First/Default Checkbox */}
              {modalSection === 'hero' && (
                <div className="pt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modalDefaultCheck"
                    checked={modalIsDefault}
                    onChange={(e) => setModalIsDefault(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded-sm border-stone-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="modalDefaultCheck" className="text-xs font-semibold text-stone-700 cursor-pointer">
                    Set as First / Default Image (loads first on homepage visit)
                  </label>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || (uploadSource === 'device' && !selectedFile && !modalTargetItem)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#991b1b] hover:bg-[#7f1d1d] text-white shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. REMOVE CONFIRMATION MODAL */}
      {/* ===================================================================== */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                Remove Image?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Are you sure you want to remove <strong>"{deleteConfirmItem.title}"</strong> from the website carousel?
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors border border-stone-200"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
