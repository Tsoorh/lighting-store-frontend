import React from 'react'
import { useSiteMediaDraft } from '../../context/SiteMediaDraftContext'
import { useLanguage } from '../../hooks/useLanguage'
import { DEFAULT_FULL_WIDTH_BANNER } from '../../model/site-media.model'

export const AdminMediaModal: React.FC = () => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const {
        activeModalSlot,
        draftConfig,
        tempPosition,
        setTempPosition,
        uploadProgress,
        aspectRatioWarning,
        previewFileUrl,
        onFileSelected,
        onConfirmUploadAndStaging,
        onCloseModal
    } = useSiteMediaDraft()

    if (!activeModalSlot) return null

    const currentModalSlotItem = activeModalSlot !== 'hero_video' && activeModalSlot !== 'full_width_banner'
        ? draftConfig.gallery[activeModalSlot]
        : null

    return (
        <div className="cms-modal-backdrop" onClick={onCloseModal}>
            <div className="cms-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="cms-modal-header">
                    <h3>
                        {activeModalSlot === 'hero_video'
                            ? (isEn ? 'Hero Main Video Settings' : 'הגדרות וידאו ראשי')
                            : activeModalSlot === 'full_width_banner'
                            ? (isEn ? 'Full-Width Showcase Banner Settings' : 'הגדרות באנר תמונה ברוחב מלא')
                            : (isEn ? `Edit ${currentModalSlotItem?.title.en}` : `עריכת ${currentModalSlotItem?.title.he}`)
                        }
                    </h3>
                    <button className="cms-modal-close" onClick={onCloseModal}>✕</button>
                </div>

                <div className="cms-modal-body">
                    {/* Full-Width Banner Advice & Guidelines */}
                    {activeModalSlot === 'full_width_banner' && (
                        <div className="cms-guidance-box">
                            <strong>{isEn ? '💡 Upload Advice for Full-Width Banner:' : '💡 המלצות להעלאת באנר ברוחב מלא:'}</strong>
                            <ul>
                                <li>{isEn ? 'Suggested Dimensions: 1920 × 800 px (or 2560 × 1080 px for 4K/Retina displays).' : 'רזולוציה מומלצת: 1920 × 800 פיקסלים (או 2560 × 1080 פיקסלים למסכי Retina/4K).'}</li>
                                <li>{isEn ? 'Suggested Aspect Ratio: 21:9 or ~2.4:1 panoramic wide format.' : 'יחס גובה-רוחב מומלץ: 21:9 או כ-2.4:1 פנורמי רחב.'}</li>
                                <li>{isEn ? 'Recommended Formats: WebP (best loading speed), JPG, or PNG (Max 5MB).' : 'פורמטים מומלצים: WebP (מהירות טעינה מיטבית), JPG או PNG (עד 5MB).'}</li>
                                <li>{isEn ? 'Use the Horizontal & Vertical Focus sliders below to keep the focal subject centered on mobile screens.' : 'השתמש במחווני המיקוד למטה כדי שהנושא המרכזי יישאר בפוקוס במסכי טלפון.'}</li>
                            </ul>
                        </div>
                    )}

                    {/* File Selector */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                            {isEn ? 'Upload Replacement File' : 'העלאת קובץ להחלפה'}
                        </label>
                        <input
                            type="file"
                            accept={activeModalSlot === 'hero_video' ? 'video/mp4,video/webm,image/*' : 'image/*'}
                            onChange={onFileSelected}
                            style={{ width: '100%' }}
                        />
                        <span style={{ fontSize: '0.78rem', color: '#666', marginTop: '4px', display: 'block' }}>
                            {activeModalSlot === 'hero_video'
                                ? (isEn ? 'Max 25MB • Recommended 16:9 MP4' : 'עד 25MB • מומלץ 16:9 MP4')
                                : activeModalSlot === 'full_width_banner'
                                ? (isEn ? 'Max 5MB • Panoramic 21:9 • WebP, PNG, JPG' : 'עד 5MB • פנורמי 21:9 • WebP, PNG, JPG')
                                : (isEn ? 'Max 5MB • Formats: WebP, PNG, JPG' : 'עד 5MB • פורמטים: WebP, PNG, JPG')
                            }
                        </span>
                    </div>

                    {/* Aspect Ratio Warning */}
                    {aspectRatioWarning && (
                        <div className="cms-warning-box">
                            ⚠️ {aspectRatioWarning}
                        </div>
                    )}

                    {/* Live Cropping Preview */}
                    <div className="cms-modal-preview">
                        {activeModalSlot === 'hero_video' ? (
                            <div style={{ width: '100%', aspectRatio: '16 / 9', background: '#000', overflow: 'hidden' }}>
                                <video
                                    src={previewFileUrl || draftConfig.heroVideo.url}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: `${tempPosition.x}% ${tempPosition.y}%`
                                    }}
                                />
                            </div>
                        ) : activeModalSlot === 'full_width_banner' ? (
                            <div
                                style={{
                                    width: '100%',
                                    aspectRatio: '21 / 9',
                                    background: '#222',
                                    overflow: 'hidden',
                                    borderRadius: '4px'
                                }}
                            >
                                <img
                                    src={previewFileUrl || draftConfig.fullWidthBanner?.url || DEFAULT_FULL_WIDTH_BANNER.url}
                                    alt="Full width banner crop preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: `${tempPosition.x}% ${tempPosition.y}%`
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    aspectRatio: currentModalSlotItem?.aspectRatioType === 'wide' ? '2.113 / 1' : '1 / 1',
                                    background: '#ddd',
                                    overflow: 'hidden'
                                }}
                            >
                                <img
                                    src={previewFileUrl || currentModalSlotItem?.url}
                                    alt="Crop preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: `${tempPosition.x}% ${tempPosition.y}%`
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Focal Point Sliders */}
                    <div className="cms-slider-group">
                        <div className="cms-slider-label">
                            <span>{isEn ? 'Horizontal Focus Position (X)' : 'מיקוד אופקי (X)'}</span>
                            <span>{tempPosition.x}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={tempPosition.x}
                            onChange={(e) => setTempPosition(prev => ({ ...prev, x: +e.target.value }))}
                        />
                    </div>

                    <div className="cms-slider-group">
                        <div className="cms-slider-label">
                            <span>{isEn ? 'Vertical Focus Position (Y)' : 'מיקוד אנכי (Y)'}</span>
                            <span>{tempPosition.y}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={tempPosition.y}
                            onChange={(e) => setTempPosition(prev => ({ ...prev, y: +e.target.value }))}
                        />
                    </div>

                    {/* Upload Progress Bar */}
                    {uploadProgress !== null && (
                        <div style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                                <span>{isEn ? 'Uploading securely to Cloudinary...' : 'מעלה בצורה מאובטחת ל-Cloudinary...'}</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#2e7d32', transition: 'width 0.2s' }} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="cms-modal-footer">
                    <button
                        type="button"
                        onClick={onCloseModal}
                        style={{ background: 'none', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {isEn ? 'Cancel' : 'ביטול'}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmUploadAndStaging}
                        disabled={uploadProgress !== null}
                        style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {uploadProgress !== null
                            ? (isEn ? 'Uploading...' : 'מעלה...')
                            : (isEn ? 'Apply to Draft' : 'החל על הטיוטה')}
                    </button>
                </div>
            </div>
        </div>
    )
}

