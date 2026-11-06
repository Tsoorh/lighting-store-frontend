import React from 'react'
import { useSiteMediaDraft } from '../../context/SiteMediaDraftContext'
import { useLanguage } from '../../hooks/useLanguage'
import { DEFAULT_FULL_WIDTH_BANNER } from '../../model/site-media.model'

export const AdminBannerSection: React.FC = () => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const {
        draftConfig,
        isSlotModified,
        onOpenReplaceModal,
        onUndoSlot,
        onToggleBannerEnabled,
        onMoveBanner,
        onUpdateBannerField
    } = useSiteMediaDraft()

    const banner = draftConfig.fullWidthBanner
    const isBannerEnabled = !!banner?.enabled
    const bannerPos = banner?.position ?? 2

    function getPositionLabel(position: number, isEn: boolean) {
        switch (position) {
            case 1:
                return isEn ? '1. Below Hero (Above Collection)' : '1. מתחת לוידאו הראשי (לפני הקולקציה)'
            case 2:
                return isEn ? '2. Below Collection (Above Quote)' : '2. מתחת לקולקציה (לפני באנר הציטוט)'
            case 3:
                return isEn ? '3. Below Quote (Above Gallery)' : '3. מתחת לציטוט (לפני הגלריה)'
            case 4:
                return isEn ? '4. Below Gallery (Above Experience)' : '4. מתחת לגלריה (לפני הניסיון)'
            case 5:
                return isEn ? '5. Below Experience (Above Contact)' : '5. מתחת לניסיון (לפני יצירת קשר)'
            default:
                return isEn ? `Position ${position}` : `מיקום ${position}`
        }
    }

    // When banner is not added yet to the page, display the "Add Banner to Page" callout card
    if (!isBannerEnabled) {
        return (
            <div className="cms-add-banner-card">
                <div className="cms-add-banner-content">
                    <span className="cms-add-banner-icon">🖼️</span>
                    <div className="cms-add-banner-text">
                        <h4>{isEn ? 'Full-Width Showcase Banner' : 'באנר תמונה ברוחב מלא'}</h4>
                        <p>
                            {isEn
                                ? 'Add a full-width visual banner section to this page. You can customize the image, focal crop, and page placement.'
                                : 'הוסף מקטע באנר ברוחב מלא לעמוד זה. ניתן להתאים אישית את התמונה, מיקוד החיתוך ומיקומו בין חלקי העמוד.'}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn-add-banner-cta"
                    onClick={() => onToggleBannerEnabled(true)}
                >
                    + {isEn ? 'Add Banner to this Page' : 'הוסף באנר לעמוד זה'}
                </button>
            </div>
        )
    }

    // When banner is added / active, display full banner controls with remove button
    return (
        <div className={`cms-banner-card ${isSlotModified('full_width_banner') ? 'modified' : ''}`}>
            <div className="cms-card-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3>{isEn ? 'Full-Width Image Section' : 'באנר תמונה ברוחב מלא'}</h3>
                        <span className="cms-toggle-badge enabled">
                            {isEn ? '● Active on Page' : '● פעיל בעמוד'}
                        </span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                        {isEn
                            ? 'A 100% full-bleed image section. Can be reordered up/down across page sections.'
                            : 'מקטע תמונה ברוחב 100% מלא. ניתן להזיז למעלה ולמטה בין חלקי העמוד.'}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="cms-specs-pill">
                        21:9 • 1920×800 / 2560×1080 • WebP/JPG • Max 5MB
                    </span>
                    <button
                        type="button"
                        className="btn-remove-banner"
                        onClick={() => onToggleBannerEnabled(false)}
                        title={isEn ? 'Remove banner from this page' : 'הסר באנר מעמוד זה'}
                    >
                        ✕ {isEn ? 'Remove Banner' : 'הסר באנר'}
                    </button>
                </div>
            </div>

            {/* Position and reorder controls */}
            <div className="cms-banner-controls-bar">
                <div className="cms-banner-position-group">
                    <span className="cms-position-title">
                        {isEn ? 'Page Location:' : 'מיקום בעמוד:'}
                    </span>
                    <span className="cms-position-current-badge">
                        {getPositionLabel(bannerPos, isEn)}
                    </span>
                    <div className="cms-position-buttons">
                        <button
                            type="button"
                            className="btn-cms-reorder"
                            onClick={() => onMoveBanner('up')}
                            disabled={bannerPos <= 1}
                            title={isEn ? 'Move Higher up the page' : 'הזז למעלה בעמוד'}
                        >
                            ▲ {isEn ? 'Move Up' : 'למעלה'}
                        </button>
                        <button
                            type="button"
                            className="btn-cms-reorder"
                            onClick={() => onMoveBanner('down')}
                            disabled={bannerPos >= 5}
                            title={isEn ? 'Move Lower down the page' : 'הזז למטה בעמוד'}
                        >
                            ▼ {isEn ? 'Move Down' : 'למטה'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Visual Position Breadcrumb Map */}
            <div className="cms-position-map">
                <span className="cms-map-node">Hero</span>
                <span className={`cms-map-slot ${bannerPos === 1 ? 'active' : ''}`}>
                    {bannerPos === 1 && '⭐ Banner'}
                </span>
                <span className="cms-map-node">Collection</span>
                <span className={`cms-map-slot ${bannerPos === 2 ? 'active' : ''}`}>
                    {bannerPos === 2 && '⭐ Banner'}
                </span>
                <span className="cms-map-node">Quote Banner</span>
                <span className={`cms-map-slot ${bannerPos === 3 ? 'active' : ''}`}>
                    {bannerPos === 3 && '⭐ Banner'}
                </span>
                <span className="cms-map-node">Gallery</span>
                <span className={`cms-map-slot ${bannerPos === 4 ? 'active' : ''}`}>
                    {bannerPos === 4 && '⭐ Banner'}
                </span>
                <span className="cms-map-node">Experience</span>
                <span className={`cms-map-slot ${bannerPos === 5 ? 'active' : ''}`}>
                    {bannerPos === 5 && '⭐ Banner'}
                </span>
                <span className="cms-map-node">Contact</span>
            </div>

            {/* Banner Image Preview */}
            <div className="cms-banner-preview-box">
                <img
                    src={banner?.url || DEFAULT_FULL_WIDTH_BANNER.url}
                    alt="Full width banner preview"
                    style={{
                        objectPosition: `${banner?.objectPosition?.x ?? 50}% ${banner?.objectPosition?.y ?? 50}%`
                    }}
                />
            </div>

            {/* Click-through link & Alt text inputs */}
            <div className="cms-banner-extra-fields">
                <div className="cms-field-group">
                    <label>{isEn ? 'Optional Link URL (Clickable destination):' : 'קישור אופציונלי (לחיצה על הבאנר):'}</label>
                    <input
                        type="text"
                        placeholder={isEn ? 'e.g. /product/category/ceiling or https://...' : 'לדוגמה: /product/category/ceiling'}
                        value={banner?.linkUrl || ''}
                        onChange={(e) => onUpdateBannerField('linkUrl', e.target.value)}
                    />
                </div>
                <div className="cms-field-group">
                    <label>{isEn ? 'Alt Text (English):' : 'תיאור תמונה (אנגלית):'}</label>
                    <input
                        type="text"
                        placeholder="Descriptive alt text for accessibility"
                        value={banner?.alt?.en || ''}
                        onChange={(e) => onUpdateBannerField('altEn', e.target.value)}
                    />
                </div>
                <div className="cms-field-group">
                    <label>{isEn ? 'Alt Text (Hebrew):' : 'תיאור תמונה (עברית):'}</label>
                    <input
                        type="text"
                        placeholder="תיאור התמונה לנגישות"
                        value={banner?.alt?.he || ''}
                        onChange={(e) => onUpdateBannerField('altHe', e.target.value)}
                    />
                </div>
            </div>

            <div className="cms-banner-actions">
                <button
                    type="button"
                    className="btn-slot-replace"
                    onClick={() => onOpenReplaceModal('full_width_banner')}
                >
                    {isEn ? 'Replace Image & Adjust Focus' : 'החלף תמונה וכַוונן מיקוד'}
                </button>
                {isSlotModified('full_width_banner') && (
                    <button
                        type="button"
                        className="btn-slot-undo"
                        onClick={() => onUndoSlot('full_width_banner')}
                    >
                        {isEn ? 'Undo Banner Changes' : 'בטל שינויי באנר'}
                    </button>
                )}
            </div>
        </div>
    )
}

