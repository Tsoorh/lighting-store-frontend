import React, { useState, useEffect } from 'react'
import { useSiteMediaDraft } from '../../context/SiteMediaDraftContext'
import { useLanguage } from '../../hooks/useLanguage'
import { AdminTopBar } from './AdminTopBar'
import { AdminSimulationView } from './AdminSimulationView'
import { AdminMediaModal } from './AdminMediaModal'
import { AdminBannerSection } from './AdminBannerSection'
import '../../assets/styles/cmps/AdminSiteDesign.css'

export const AdminEditPage: React.FC = () => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const {
        draftConfig,
        isLoading,
        isSlotModified,
        onOpenReplaceModal,
        onUndoSlot,
        onToggleBannerEnabled,
        historyItems,
        historyTotal,
        historySlotFilter,
        setHistorySlotFilter,
        historyActionFilter,
        setHistoryActionFilter,
        loadHistory,
        onRestoreToDraft
    } = useSiteMediaDraft()

    // Page selector: 'home' is active now, expandable to other pages later
    const [selectedPage, setSelectedPage] = useState<'home'>('home')
    const [activeSubTab, setActiveSubTab] = useState<'editor' | 'simulation' | 'history'>('editor')

    useEffect(() => {
        if (activeSubTab === 'history') {
            loadHistory()
        }
    }, [activeSubTab, historySlotFilter, historyActionFilter])

    if (isLoading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>{isEn ? 'Loading Page Editor...' : 'טוען עורך עמוד...'}</p>
            </div>
        )
    }

    const isBannerOnPage = !!draftConfig.fullWidthBanner?.enabled

    return (
        <section className="admin-site-design" dir={isEn ? 'ltr' : 'rtl'}>
            <AdminTopBar />

            {/* Page Selection Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '8px',
                flexWrap: 'wrap',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#666',
                        marginRight: isEn ? '12px' : 0,
                        marginLeft: isEn ? 0 : '12px'
                    }}>
                        {isEn ? 'Select Page to Edit:' : 'בחר עמוד לעריכה:'}
                    </span>

                    <button
                        type="button"
                        style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: selectedPage === 'home' ? '2px solid #000' : '1px solid #ddd',
                            background: selectedPage === 'home' ? '#000' : '#fff',
                            color: selectedPage === 'home' ? '#fff' : '#333',
                            fontWeight: selectedPage === 'home' ? 700 : 500,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => setSelectedPage('home')}
                    >
                        🏠 {isEn ? 'Home Page' : 'דף הבית'}
                    </button>
                </div>

                {/* Banner Status & Quick Add Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isBannerOnPage ? (
                        <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#2e7d32',
                            background: '#e8f5e9',
                            border: '1px solid #a5d6a7',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            🖼️ {isEn ? 'Banner active on page' : 'באנר פעיל בעמוד'}
                        </span>
                    ) : (
                        <button
                            type="button"
                            className="btn-add-banner-cta"
                            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                            onClick={() => {
                                onToggleBannerEnabled(true)
                                setActiveSubTab('editor')
                            }}
                        >
                            + {isEn ? 'Add Banner to Page' : 'הוסף באנר לעמוד'}
                        </button>
                    )}
                </div>
            </div>

            {/* Subnav for Home Page */}
            {selectedPage === 'home' && (
                <div className="cms-subnav">
                    <button
                        className={`cms-subnav-btn ${activeSubTab === 'editor' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('editor')}
                    >
                        {isEn ? '1. Visual Editor & Sizing' : '1. עורך עיצוב ומידות'}
                    </button>
                    <button
                        className={`cms-subnav-btn ${activeSubTab === 'simulation' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('simulation')}
                    >
                        {isEn ? '2. Live Responsive Simulation' : '2. הדמיית תצוגה רספונסיבית'}
                    </button>
                    <button
                        className={`cms-subnav-btn ${activeSubTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('history')}
                    >
                        {isEn ? `3. Replacement History & Restore (${historyTotal})` : `3. היסטוריית החלפות ושחזור (${historyTotal})`}
                    </button>
                </div>
            )}

            {/* TAB 1: Visual Editor & Sizing */}
            {selectedPage === 'home' && activeSubTab === 'editor' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Hero Section Card */}
                    <div className="cms-hero-card">
                        <div className="cms-card-header">
                            <div>
                                <h3>{isEn ? 'Homepage Hero Main Video' : 'וידאו ראשי - כותרת עליונה'}</h3>
                                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                                    {isEn ? 'Autoplay, muted, loop video at the top of the homepage.' : 'וידאו רקע בלולאה בחלק העליון של דף הבית.'}
                                </p>
                            </div>
                            <span className="cms-specs-pill">
                                16:9 • 1920×1080 • MP4/WEBM • Max 25MB
                            </span>
                        </div>

                        <div className="cms-hero-preview-wrapper">
                            <video
                                key={draftConfig.heroVideo.url}
                                src={draftConfig.heroVideo.url}
                                poster={draftConfig.heroVideo.posterUrl || undefined}
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{
                                    objectPosition: `${draftConfig.heroVideo.objectPosition.x}% ${draftConfig.heroVideo.objectPosition.y}%`
                                }}
                            />
                        </div>

                        <div className="cms-hero-controls">
                            <button
                                type="button"
                                className="btn-slot-replace"
                                onClick={() => onOpenReplaceModal('hero_video')}
                            >
                                {isEn ? 'Replace Video / Adjust Focus' : 'החלף וידאו / כוונן מיקוד'}
                            </button>
                            {isSlotModified('hero_video') && (
                                <button
                                    type="button"
                                    className="btn-slot-undo"
                                    onClick={() => onUndoSlot('hero_video')}
                                >
                                    {isEn ? 'Undo Video Changes' : 'בטל שינויי וידאו'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Banner Section Card (Shows Add Banner CTA if inactive, or full editor if active) */}
                    <AdminBannerSection />

                    {/* Gallery Grid Section Card */}
                    <div className="cms-gallery-section">
                        <div className="cms-card-header">
                            <div>
                                <h3>{isEn ? 'Gallery Grid (5 Replaceable Slots)' : 'רשת הגלריה (5 משבצות להחלפה)'}</h3>
                                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                                    {isEn
                                        ? 'Slots are fixed to preserve the layout. Replace photos without breaking responsiveness.'
                                        : 'המשבצות קבועות לשמירה על העיצוב. ניתן להחליף תמונות ללא שבירת הרספונסיביות.'}
                                </p>
                            </div>
                        </div>

                        <div className="cms-gallery-editor-grid">
                            {/* Slot 1: Wide */}
                            <div className={`cms-slot-card ${isSlotModified('slot_1') ? 'modified' : ''}`}>
                                <div className="cms-slot-header">
                                    <span className="cms-slot-title">{isEn ? draftConfig.gallery.slot_1.title.en : draftConfig.gallery.slot_1.title.he}</span>
                                    <span className="cms-slot-ratio-badge">Wide (2.11:1) • 1724×816</span>
                                </div>
                                <div className="cms-slot-preview-box wide">
                                    <img
                                        src={draftConfig.gallery.slot_1.url}
                                        alt="Slot 1"
                                        style={{
                                            objectPosition: `${draftConfig.gallery.slot_1.objectPosition.x}% ${draftConfig.gallery.slot_1.objectPosition.y}%`
                                        }}
                                    />
                                </div>
                                <div className="cms-slot-actions">
                                    <button type="button" className="btn-slot-replace" onClick={() => onOpenReplaceModal('slot_1')}>
                                        {isEn ? 'Replace / Focus' : 'החלף / מיקוד'}
                                    </button>
                                    {isSlotModified('slot_1') && (
                                        <button type="button" className="btn-slot-undo" onClick={() => onUndoSlot('slot_1')}>
                                            {isEn ? 'Undo' : 'בטל'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Slot 2: Fixed About Card */}
                            <div className="cms-slot-card">
                                <div className="cms-slot-header">
                                    <span className="cms-slot-title">{isEn ? 'Slot 2 (Fixed Design Element)' : 'משבצת 2 (אלמנט עיצוב קבוע)'}</span>
                                    <span className="cms-locked-pill">🔒 {isEn ? 'Fixed / Non-editable' : 'קבוע / לא לעריכה'}</span>
                                </div>
                                <div className="cms-slot-about-card">
                                    <h4>{isEn ? <>Second generation in lighting.<br />Choosing art.</> : <>דור שני לתאורה.<br />בחירה באמנות.</>}</h4>
                                    <span style={{ fontSize: '0.8rem', color: '#bbb' }}>{isEn ? 'About Me Link Card' : 'כרטיסיית אודותיי'}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#777' }}>
                                    {isEn ? 'Preserves signature Figma brand layout.' : 'שומר על יציבות המבנה המקורי.'}
                                </div>
                            </div>

                            {/* Slot 3: Square */}
                            <div className={`cms-slot-card ${isSlotModified('slot_3') ? 'modified' : ''}`}>
                                <div className="cms-slot-header">
                                    <span className="cms-slot-title">{isEn ? draftConfig.gallery.slot_3.title.en : draftConfig.gallery.slot_3.title.he}</span>
                                    <span className="cms-slot-ratio-badge">Square (1:1) • 816×816</span>
                                </div>
                                <div className="cms-slot-preview-box square">
                                    <img
                                        src={draftConfig.gallery.slot_3.url}
                                        alt="Slot 3"
                                        style={{
                                            objectPosition: `${draftConfig.gallery.slot_3.objectPosition.x}% ${draftConfig.gallery.slot_3.objectPosition.y}%`
                                        }}
                                    />
                                </div>
                                <div className="cms-slot-actions">
                                    <button type="button" className="btn-slot-replace" onClick={() => onOpenReplaceModal('slot_3')}>
                                        {isEn ? 'Replace / Focus' : 'החלף / מיקוד'}
                                    </button>
                                    {isSlotModified('slot_3') && (
                                        <button type="button" className="btn-slot-undo" onClick={() => onUndoSlot('slot_3')}>
                                            {isEn ? 'Undo' : 'בטל'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Slot 4: Wide */}
                            <div className={`cms-slot-card ${isSlotModified('slot_4') ? 'modified' : ''}`}>
                                <div className="cms-slot-header">
                                    <span className="cms-slot-title">{isEn ? draftConfig.gallery.slot_4.title.en : draftConfig.gallery.slot_4.title.he}</span>
                                    <span className="cms-slot-ratio-badge">Wide (2.11:1) • 1724×816</span>
                                </div>
                                <div className="cms-slot-preview-box wide">
                                    <img
                                        src={draftConfig.gallery.slot_4.url}
                                        alt="Slot 4"
                                        style={{
                                            objectPosition: `${draftConfig.gallery.slot_4.objectPosition.x}% ${draftConfig.gallery.slot_4.objectPosition.y}%`
                                        }}
                                    />
                                </div>
                                <div className="cms-slot-actions">
                                    <button type="button" className="btn-slot-replace" onClick={() => onOpenReplaceModal('slot_4')}>
                                        {isEn ? 'Replace / Focus' : 'החלף / מיקוד'}
                                    </button>
                                    {isSlotModified('slot_4') && (
                                        <button type="button" className="btn-slot-undo" onClick={() => onUndoSlot('slot_4')}>
                                            {isEn ? 'Undo' : 'בטל'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Slot 5: Wide */}
                            <div className={`cms-slot-card ${isSlotModified('slot_5') ? 'modified' : ''}`}>
                                <div className="cms-slot-header">
                                    <span className="cms-slot-title">{isEn ? draftConfig.gallery.slot_5.title.en : draftConfig.gallery.slot_5.title.he}</span>
                                    <span className="cms-slot-ratio-badge">Wide (2.11:1) • 1724×816</span>
                                </div>
                                <div className="cms-slot-preview-box wide">
                                    <img
                                        src={draftConfig.gallery.slot_5.url}
                                        alt="Slot 5"
                                        style={{
                                            objectPosition: `${draftConfig.gallery.slot_5.objectPosition.x}% ${draftConfig.gallery.slot_5.objectPosition.y}%`
                                        }}
                                    />
                                </div>
                                <div className="cms-slot-actions">
                                    <button type="button" className="btn-slot-replace" onClick={() => onOpenReplaceModal('slot_5')}>
                                        {isEn ? 'Replace / Focus' : 'החלף / מיקוד'}
                                    </button>
                                    {isSlotModified('slot_5') && (
                                        <button type="button" className="btn-slot-undo" onClick={() => onUndoSlot('slot_5')}>
                                            {isEn ? 'Undo' : 'בטל'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Slot 6: Square */}
                            <div className={`cms-slot-card ${isSlotModified('slot_6') ? 'modified' : ''}`}>
                                <div className="cms-slot-header">
                                    <span className="cms-slot-title">{isEn ? draftConfig.gallery.slot_6.title.en : draftConfig.gallery.slot_6.title.he}</span>
                                    <span className="cms-slot-ratio-badge">Square (1:1) • 816×816</span>
                                </div>
                                <div className="cms-slot-preview-box square">
                                    <img
                                        src={draftConfig.gallery.slot_6.url}
                                        alt="Slot 6"
                                        style={{
                                            objectPosition: `${draftConfig.gallery.slot_6.objectPosition.x}% ${draftConfig.gallery.slot_6.objectPosition.y}%`
                                        }}
                                    />
                                </div>
                                <div className="cms-slot-actions">
                                    <button type="button" className="btn-slot-replace" onClick={() => onOpenReplaceModal('slot_6')}>
                                        {isEn ? 'Replace / Focus' : 'החלף / מיקוד'}
                                    </button>
                                    {isSlotModified('slot_6') && (
                                        <button type="button" className="btn-slot-undo" onClick={() => onUndoSlot('slot_6')}>
                                            {isEn ? 'Undo' : 'בטל'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Live Responsive Simulation */}
            {selectedPage === 'home' && activeSubTab === 'simulation' && (
                <AdminSimulationView
                    title={isEn ? 'Real-Time Homepage Simulator' : 'הדמיית דף הבית בזמן אמת'}
                    subtitle={isEn
                        ? 'Inspects actual CSS media queries, banner placement, and image cropping across devices.'
                        : 'מדמה בדיוק את המדיה קווריס, מיקום הבאנר והחיתוך הרספונסיבי של דף הבית.'}
                />
            )}

            {/* TAB 3: Replacement History & Restore */}
            {selectedPage === 'home' && activeSubTab === 'history' && (
                <div className="cms-history-panel">
                    <div className="cms-card-header">
                        <div>
                            <h3>{isEn ? 'Media Replacement History Log' : 'יומן היסטוריית החלפות ושחזורים'}</h3>
                            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                                {isEn ? 'Audit record of all published replacements. Restoring loads asset into draft for review.' : 'תיעוד של כל ההחלפות. שחזור טוען את הקובץ לטיוטה לבדיקה לפני פרסום.'}
                            </p>
                        </div>
                    </div>

                    <div className="cms-history-filters">
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                                {isEn ? 'Filter Slot' : 'סנן לפי משבצת'}
                            </label>
                            <select
                                value={historySlotFilter}
                                onChange={(e) => setHistorySlotFilter(e.target.value)}
                                style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="all">{isEn ? 'All Slots' : 'כל המשבצות'}</option>
                                <option value="hero_video">{isEn ? 'Hero Video' : 'וידאו ראשי'}</option>
                                <option value="full_width_banner">{isEn ? 'Full-Width Banner' : 'באנר ברוחב מלא'}</option>
                                <option value="slot_1">{isEn ? 'Slot 1' : 'משבצת 1'}</option>
                                <option value="slot_3">{isEn ? 'Slot 3' : 'משבצת 3'}</option>
                                <option value="slot_4">{isEn ? 'Slot 4' : 'משבצת 4'}</option>
                                <option value="slot_5">{isEn ? 'Slot 5' : 'משבצת 5'}</option>
                                <option value="slot_6">{isEn ? 'Slot 6' : 'משבצת 6'}</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                                {isEn ? 'Action Type' : 'סוג פעולה'}
                            </label>
                            <select
                                value={historyActionFilter}
                                onChange={(e) => setHistoryActionFilter(e.target.value)}
                                style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="all">{isEn ? 'All Actions' : 'כל הפעולות'}</option>
                                <option value="replacement">{isEn ? 'Replacements' : 'החלפות'}</option>
                                <option value="restoration">{isEn ? 'Restorations' : 'שחזורים'}</option>
                            </select>
                        </div>
                    </div>

                    {historyItems.length === 0 ? (
                        <p style={{ padding: '24px 0', textAlign: 'center', color: '#888' }}>
                            {isEn ? 'No replacement history found.' : 'לא נמצאו רשומות היסטוריה.'}
                        </p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="cms-history-table">
                                <thead>
                                    <tr>
                                        <th>{isEn ? 'Date & Time' : 'תאריך ושעה'}</th>
                                        <th>{isEn ? 'Admin' : 'משתמש'}</th>
                                        <th>{isEn ? 'Slot' : 'משבצת'}</th>
                                        <th>{isEn ? 'Previous Asset' : 'קובץ קודם'}</th>
                                        <th>{isEn ? 'Replacement Asset' : 'קובץ חדש'}</th>
                                        <th>{isEn ? 'Action' : 'פעולה'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyItems.map((item, idx) => (
                                        <tr key={item._id || idx}>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {new Date(item.replacedAt).toLocaleString(isEn ? 'en-US' : 'he-IL')}
                                            </td>
                                            <td>{item.replacedBy?.fullname || item.replacedBy?.username}</td>
                                            <td>
                                                <span style={{ fontWeight: 600 }}>
                                                    {isEn ? (item.slotName?.en || item.slotId) : (item.slotName?.he || item.slotId)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="cms-thumb-pair">
                                                    {item.mediaType === 'hero_video' ? (
                                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>🎥 Video</span>
                                                    ) : (
                                                        <img
                                                            src={item.previousAsset?.url}
                                                            alt="Previous"
                                                            className="cms-history-thumb"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cms-thumb-pair">
                                                    {item.mediaType === 'hero_video' ? (
                                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>🎥 Video</span>
                                                    ) : (
                                                        <img
                                                            src={item.newAsset?.url}
                                                            alt="New"
                                                            className="cms-history-thumb"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn-cms-restore"
                                                    onClick={() => {
                                                        onRestoreToDraft(item)
                                                        setActiveSubTab('editor')
                                                    }}
                                                >
                                                    {isEn ? 'Restore to Draft' : 'שחזר לטיוטה'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <AdminMediaModal />
        </section>
    )
}
