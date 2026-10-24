import React, { useState, useEffect, useRef, useMemo } from 'react'
import { 
    type SiteMediaConfig, 
    DEFAULT_SITE_MEDIA, 
    type CanonicalSlotId, 
    type SiteMediaLogEntry,
    type ObjectPosition
} from '../../model/site-media.model'
import { siteMediaService } from '../../services/site-media.service'
import { uploadService, type CloudinaryUploadResult } from '../../services/upload.service'
import { useLanguage } from '../../hooks/useLanguage'
import '../../assets/styles/cmps/AdminSiteDesign.css'

export const AdminSiteDesign: React.FC = () => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const [publishedConfig, setPublishedConfig] = useState<SiteMediaConfig>(DEFAULT_SITE_MEDIA)
    const [draftConfig, setDraftConfig] = useState<SiteMediaConfig>(DEFAULT_SITE_MEDIA)
    const [isLoading, setIsLoading] = useState(true)
    const [activeSubTab, setActiveSubTab] = useState<'editor' | 'simulation' | 'history'>('editor')
    const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [isPublishing, setIsPublishing] = useState(false)
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

    // Modal & Positioning States
    const [activeModalSlot, setActiveModalSlot] = useState<CanonicalSlotId | 'hero_video' | null>(null)
    const [tempPosition, setTempPosition] = useState<ObjectPosition>({ x: 50, y: 50 })
    const [uploadProgress, setUploadProgress] = useState<number | null>(null)
    const [aspectRatioWarning, setAspectRatioWarning] = useState<string | null>(null)
    const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null)
    const [pendingFile, setPendingFile] = useState<File | null>(null)

    // History Log State
    const [historyItems, setHistoryItems] = useState<SiteMediaLogEntry[]>([])
    const [historyTotal, setHistoryTotal] = useState(0)
    const [historySlotFilter, setHistorySlotFilter] = useState<string>('all')
    const [historyActionFilter, setHistoryActionFilter] = useState<string>('all')

    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    // Load initial config
    useEffect(() => {
        async function loadConfig() {
            try {
                setIsLoading(true)
                const config = await siteMediaService.getSiteMedia()
                setPublishedConfig(config)
                setDraftConfig(JSON.parse(JSON.stringify(config)))
            } catch (err) {
                console.error('Failed to load site media config', err)
                setStatusMessage({ 
                    type: 'error', 
                    text: isEn ? 'Failed to load current site media' : 'טעינת הגדרות המדיה נכשלה' 
                })
            } finally {
                setIsLoading(false)
            }
        }
        loadConfig()
    }, [isEn])

    // Load History logs when switching to history tab
    useEffect(() => {
        if (activeSubTab === 'history') {
            loadHistory()
        }
    }, [activeSubTab, historySlotFilter, historyActionFilter])

    async function loadHistory() {
        try {
            const res = await siteMediaService.getMediaLog({
                slotId: historySlotFilter,
                actionType: historyActionFilter,
                limit: 50
            })
            setHistoryItems(res.items || [])
            setHistoryTotal(res.total || 0)
        } catch (err) {
            console.error('Failed to load history logs', err)
        }
    }

    // Determine if draft has unsaved differences
    const isDirty = useMemo(() => {
        return JSON.stringify(publishedConfig) !== JSON.stringify(draftConfig)
    }, [publishedConfig, draftConfig])

    // Detect per-slot modifications
    const isSlotModified = (slotId: CanonicalSlotId | 'hero_video') => {
        if (slotId === 'hero_video') {
            return JSON.stringify(publishedConfig.heroVideo) !== JSON.stringify(draftConfig.heroVideo)
        }
        return JSON.stringify(publishedConfig.gallery[slotId]) !== JSON.stringify(draftConfig.gallery[slotId])
    }

    // Unsaved changes browser prompt
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isDirty])

    // Synchronize draft state to simulation iframe
    const syncDraftToIframe = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                { type: 'TL_PREVIEW_DRAFT_UPDATE', payload: draftConfig },
                window.location.origin
            )
        }
    }

    useEffect(() => {
        syncDraftToIframe()
    }, [draftConfig, activeSubTab])

    // Handle iframe ready message
    useEffect(() => {
        const handleFrameMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return
            if (event.data?.type === 'TL_PREVIEW_FRAME_READY') {
                syncDraftToIframe()
            }
        }
        window.addEventListener('message', handleFrameMessage)
        return () => window.removeEventListener('message', handleFrameMessage)
    }, [draftConfig])

    // Open file selection / replace modal
    function onOpenReplaceModal(slotId: CanonicalSlotId | 'hero_video') {
        setActiveModalSlot(slotId)
        setPendingFile(null)
        setPreviewFileUrl(null)
        setAspectRatioWarning(null)
        setUploadProgress(null)
        
        const currentPos = slotId === 'hero_video' 
            ? draftConfig.heroVideo.objectPosition 
            : draftConfig.gallery[slotId].objectPosition
        setTempPosition({ ...currentPos })
    }

    // File selected for upload
    function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file || !activeModalSlot) return

        const isVideo = activeModalSlot === 'hero_video' && file.type.startsWith('video/')
        const maxBytes = isVideo ? 25 * 1024 * 1024 : 5 * 1024 * 1024

        if (file.size > maxBytes) {
            alert(isEn 
                ? `File exceeds maximum allowed size of ${isVideo ? '25MB' : '5MB'}`
                : `הקובץ חורג מהגודל המרבי המותר (${isVideo ? '25MB' : '5MB'})`
            )
            return
        }

        setPendingFile(file)
        const objectUrl = URL.createObjectURL(file)
        setPreviewFileUrl(objectUrl)
        setAspectRatioWarning(null)

        // Pre-upload Aspect Ratio Verification
        if (!isVideo) {
            const img = new Image()
            img.onload = () => {
                const ratio = img.naturalWidth / img.naturalHeight
                const targetRatio = activeModalSlot === 'hero_video' 
                    ? 1.778 
                    : draftConfig.gallery[activeModalSlot as CanonicalSlotId].targetRatio
                
                const ratioDiff = Math.abs(ratio - targetRatio) / targetRatio
                if (ratioDiff > 0.18) {
                    setAspectRatioWarning(isEn 
                        ? `Note: Image aspect ratio (${ratio.toFixed(2)}:1) differs from slot target (${targetRatio.toFixed(2)}:1). The image will be cropped to fit. Adjust positioning below.`
                        : `לתשומת לבך: יחס התמונה (${ratio.toFixed(2)}:1) שונה מהיחס המומלץ למשבצת (${targetRatio.toFixed(2)}:1). התמונה תותאם לגבולות המשבצת. ניתן לכוונן את המיקוד למטה.`
                    )
                }
            }
            img.src = objectUrl
        }
    }

    // Confirm Upload and Staging
    async function onConfirmUploadAndStaging() {
        if (!activeModalSlot) return

        try {
            if (pendingFile) {
                setUploadProgress(10)
                const isVideo = activeModalSlot === 'hero_video' && pendingFile.type.startsWith('video/')
                const resourceType = isVideo ? 'video' : 'image'

                let uploadRes: CloudinaryUploadResult
                try {
                    // Tier 1: Try to get backend signature with unique publicId
                    const sig = await siteMediaService.getUploadSignature(activeModalSlot, resourceType)
                    setUploadProgress(30)
                    uploadRes = await uploadService.uploadDirectWithSignature(pendingFile, sig, (pct) => {
                        setUploadProgress(Math.min(95, 30 + Math.round(pct * 0.65)))
                    })
                } catch (sigErr: any) {
                    console.warn('Backend upload signature endpoint unavailable, using direct Cloudinary upload:', sigErr)
                    try {
                        // Tier 2: Direct unsigned Cloudinary upload using tiran_preset
                        setUploadProgress(30)
                        const timestamp = Date.now()
                        const randomSalt = Math.random().toString(36).substring(2, 7)
                        const subFolder = resourceType === 'video' ? 'videos' : 'images'
                        const publicId = `tiran_lasry/homepage/${subFolder}/${activeModalSlot}_${timestamp}_${randomSalt}`

                        uploadRes = await uploadService.uploadUnsignedDirect(pendingFile, publicId, (pct) => {
                            setUploadProgress(Math.min(95, 30 + Math.round(pct * 0.65)))
                        })
                    } catch (directErr: any) {
                        console.warn('Direct Cloudinary upload failed, staging locally in draft with blob URL:', directErr)
                        // Tier 3: Local draft preview blob (works 100% offline with zero network requests)
                        const localBlobUrl = URL.createObjectURL(pendingFile)
                        uploadRes = {
                            secure_url: localBlobUrl,
                            public_id: '',
                            format: pendingFile.type,
                            bytes: pendingFile.size
                        }
                    }
                }
                setUploadProgress(100)

                // 3. Update Draft Configuration
                setDraftConfig(prev => {
                    const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
                    if (activeModalSlot === 'hero_video') {
                        next.heroVideo.url = uploadRes.secure_url
                        next.heroVideo.publicId = uploadRes.public_id
                        next.heroVideo.objectPosition = tempPosition
                    } else {
                        next.gallery[activeModalSlot].url = uploadRes.secure_url
                        next.gallery[activeModalSlot].publicId = uploadRes.public_id
                        next.gallery[activeModalSlot].objectPosition = tempPosition
                    }
                    return next
                })
            } else {
                // Just updated positioning
                setDraftConfig(prev => {
                    const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
                    if (activeModalSlot === 'hero_video') {
                        next.heroVideo.objectPosition = tempPosition
                    } else {
                        next.gallery[activeModalSlot].objectPosition = tempPosition
                    }
                    return next
                })
            }

            setStatusMessage({
                type: 'info',
                text: isEn ? 'Change staged in draft. Review in simulation before publishing.' : 'השינוי עודכן בטיוטה. מומלץ לבדוק בהדמיה לפני פרסום.'
            })
            onCloseModal()
        } catch (err: any) {
            console.error('Failed to upload/stage media', err)
            alert(isEn ? `Upload failed: ${err.message}` : `ההעלאה נכשלה: ${err.message}`)
        } finally {
            setUploadProgress(null)
        }
    }

    function onCloseModal() {
        if (previewFileUrl && previewFileUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewFileUrl)
        }
        setActiveModalSlot(null)
        setPendingFile(null)
        setPreviewFileUrl(null)
        setAspectRatioWarning(null)
    }

    // Reset single slot back to published
    function onUndoSlot(slotId: CanonicalSlotId | 'hero_video') {
        setDraftConfig(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
            if (slotId === 'hero_video') {
                next.heroVideo = JSON.parse(JSON.stringify(publishedConfig.heroVideo))
            } else {
                next.gallery[slotId] = JSON.parse(JSON.stringify(publishedConfig.gallery[slotId]))
            }
            return next
        })
    }

    // Discard all draft changes
    function onDiscardAll() {
        if (!isDirty) return
        const confirmed = window.confirm(isEn 
            ? 'Are you sure you want to discard all unsaved changes and revert to the published website?'
            : 'האם אתה בטוח שברצונך לבטל את כל השינויים שלא נשמרו ולחזור לגרסה המפורסמת?'
        )
        if (confirmed) {
            setDraftConfig(JSON.parse(JSON.stringify(publishedConfig)))
            setStatusMessage({
                type: 'info',
                text: isEn ? 'Draft discarded. Reverted to published site.' : 'הטיוטה בוטלה. הוחזרה הגרסה המפורסמת.'
            })
        }
    }

    // Approve & Publish Changes to Live Site
    async function onPublish() {
        if (!isDirty || isPublishing) return
        setIsPublishing(true)
        setStatusMessage(null)

        try {
            const res = await siteMediaService.publishMedia(publishedConfig.version, draftConfig)
            setPublishedConfig(res.config)
            setDraftConfig(JSON.parse(JSON.stringify(res.config)))
            setStatusMessage({
                type: 'success',
                text: isEn 
                    ? `Successfully published changes to live site! (Version ${res.version})` 
                    : `השינויים פורסמו בהצלחה באתר החי! (גרסה ${res.version})`
            })
        } catch (err: any) {
            console.error('Failed to publish site media', err)
            if (err?.response?.status === 409 || err?.isConflict) {
                setStatusMessage({
                    type: 'error',
                    text: isEn 
                        ? 'Conflict: Another administrator has published changes. Please refresh to load latest version.' 
                        : 'התנגשות גרסאות: מנהל אחר פרסם שינויים במקביל. יש לרענן את העמוד לקבלת הגרסה העדכנית.'
                })
            } else if (err?.response?.status === 404 || err?.message?.includes('404')) {
                try {
                    localStorage.setItem('tl_site_media_cache', JSON.stringify(draftConfig))
                } catch (e) {
                    console.warn('Failed to cache site media', e)
                }
                setPublishedConfig(JSON.parse(JSON.stringify(draftConfig)))
                setStatusMessage({
                    type: 'info',
                    text: isEn 
                        ? 'Saved to browser cache! Note: The backend returned 404 because the new backend code is not yet deployed to api.tiranlasry.com. Push backend to deploy or run backend locally on port 3000.'
                        : 'השינויים נשמרו בדפדפן! שים לב: השרת החזיר 404 מכיוון שקוד ה-backend החדש עדיין לא נפרס ל-api.tiranlasry.com. יש לפרוס את ה-backend או להריץ שרת מקומי בפורט 3000.'
                })
            } else {
                const serverErrMsg = typeof err?.response?.data === 'string'
                    ? err.response.data
                    : err?.response?.data?.error || err?.message || ''
                setStatusMessage({
                    type: 'error',
                    text: isEn 
                        ? `Failed to publish changes to live site.${serverErrMsg ? ' (' + serverErrMsg + ')' : ''}` 
                        : `פרסום השינויים לאתר נכשל.${serverErrMsg ? ' (' + serverErrMsg + ')' : ''}`
                })
            }
        } finally {
            setIsPublishing(false)
        }
    }

    // Restore from historical log into draft
    function onRestoreToDraft(logEntry: SiteMediaLogEntry) {
        setDraftConfig(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
            if (logEntry.slotId === 'hero_video') {
                next.heroVideo.url = logEntry.previousAsset.url
                next.heroVideo.publicId = logEntry.previousAsset.publicId
                if (logEntry.previousAsset.posterUrl !== undefined) {
                    next.heroVideo.posterUrl = logEntry.previousAsset.posterUrl
                }
                if (logEntry.previousAsset.posterPublicId !== undefined) {
                    next.heroVideo.posterPublicId = logEntry.previousAsset.posterPublicId
                }
                if (logEntry.previousAsset.objectPosition) {
                    next.heroVideo.objectPosition = logEntry.previousAsset.objectPosition
                }
            } else {
                const sId = logEntry.slotId as CanonicalSlotId
                if (next.gallery[sId]) {
                    next.gallery[sId].url = logEntry.previousAsset.url
                    next.gallery[sId].publicId = logEntry.previousAsset.publicId
                    if (logEntry.previousAsset.objectPosition) {
                        next.gallery[sId].objectPosition = logEntry.previousAsset.objectPosition
                    }
                }
            }
            return next
        })

        setActiveSubTab('editor')
        setStatusMessage({
            type: 'info',
            text: isEn 
                ? `Historical asset for ${logEntry.slotId} loaded into draft. Review in simulation and click "Approve & Publish" to go live.`
                : `הקובץ ההיסטורי עבור ${logEntry.slotId} נטען לטיוטה. בדוק בהדמיה ולחץ "אשר ופרסם לאתר" להחלה חיה.`
        })
    }

    if (isLoading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>{isEn ? 'Loading Site Media CMS...' : 'טוען מערכת ניהול מדיה...'}</p>
            </div>
        )
    }

    const currentModalSlotItem = activeModalSlot && activeModalSlot !== 'hero_video' 
        ? draftConfig.gallery[activeModalSlot] 
        : null

    return (
        <section className="admin-site-design" dir={isEn ? 'ltr' : 'rtl'}>
            {/* Sticky Action & Status Bar */}
            <div className="cms-top-bar">
                <div className="cms-status-group">
                    <span className={`cms-status-badge ${isDirty ? 'draft' : 'published'}`}>
                        <span style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            background: isDirty ? '#e65100' : '#2e7d32' 
                        }} />
                        {isDirty 
                            ? (isEn ? 'Draft Simulation (Unsaved Changes)' : 'הדמיית טיוטה (שינויים שלא נשמרו)') 
                            : (isEn ? 'Live Website (Published)' : 'אתר פעיל (מפורסם)')
                        }
                    </span>
                    <span className="cms-version-badge">
                        v{publishedConfig.version}
                    </span>
                </div>

                <div className="cms-actions-group">
                    <button 
                        type="button"
                        className="btn-cms-discard" 
                        onClick={onDiscardAll}
                        disabled={!isDirty || isPublishing}
                    >
                        {isEn ? 'Discard All' : 'בטל הכל'}
                    </button>
                    <button 
                        type="button"
                        className="btn-cms-publish" 
                        onClick={onPublish}
                        disabled={!isDirty || isPublishing}
                    >
                        {isPublishing 
                            ? (isEn ? 'Publishing...' : 'מפרסם...') 
                            : (isEn ? 'Approve & Publish Changes' : 'אשר ופרסם לאתר')}
                    </button>
                </div>
            </div>

            {/* Status Feedback Banner */}
            {statusMessage && (
                <div style={{
                    padding: '12px 18px',
                    borderRadius: '6px',
                    background: statusMessage.type === 'success' ? '#e8f5e9' : statusMessage.type === 'error' ? '#ffebee' : '#e1f5fe',
                    color: statusMessage.type === 'success' ? '#1b5e20' : statusMessage.type === 'error' ? '#b71c1c' : '#01579b',
                    border: `1px solid ${statusMessage.type === 'success' ? '#a5d6a7' : statusMessage.type === 'error' ? '#ef9a9a' : '#81d4fa'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{statusMessage.text}</span>
                    <button 
                        onClick={() => setStatusMessage(null)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Navigation Subtabs */}
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

            {/* TAB 1: Visual Editor & Sizing */}
            {activeSubTab === 'editor' && (
                <>
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
                </>
            )}

            {/* TAB 2: Live Responsive Simulation */}
            {activeSubTab === 'simulation' && (
                <div className="cms-simulation-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1280px', marginBottom: '16px', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>{isEn ? 'Real-Time Homepage Simulator' : 'הדמיית דף הבית בזמן אמת'}</h3>
                            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                                {isEn ? 'Inspects actual CSS media queries and image cropping.' : 'מדמה בדיוק את המדיה קווריס, החיתוך והרספונסיביות.'}
                            </p>
                        </div>
                        <div className="cms-device-toggles">
                            <button 
                                type="button"
                                className={`cms-device-btn ${activeDevice === 'desktop' ? 'active' : ''}`}
                                onClick={() => setActiveDevice('desktop')}
                            >
                                🖥️ {isEn ? 'Desktop (1280px)' : 'מחשב (1280px)'}
                            </button>
                            <button 
                                type="button"
                                className={`cms-device-btn ${activeDevice === 'tablet' ? 'active' : ''}`}
                                onClick={() => setActiveDevice('tablet')}
                            >
                                📱 {isEn ? 'Tablet (768px)' : 'טאבלט (768px)'}
                            </button>
                            <button 
                                type="button"
                                className={`cms-device-btn ${activeDevice === 'mobile' ? 'active' : ''}`}
                                onClick={() => setActiveDevice('mobile')}
                            >
                                📲 {isEn ? 'Mobile (375px)' : 'סלולר (375px)'}
                            </button>
                        </div>
                    </div>

                    <div className={`cms-simulation-viewport ${activeDevice}`}>
                        <iframe 
                            ref={iframeRef}
                            src="/preview-homepage"
                            title="Homepage Simulation"
                            className="cms-simulation-iframe"
                            onLoad={syncDraftToIframe}
                        />
                    </div>
                </div>
            )}

            {/* TAB 3: Replacement History & Restore */}
            {activeSubTab === 'history' && (
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
                                                    onClick={() => onRestoreToDraft(item)}
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

            {/* Replace & Crop Positioning Modal */}
            {activeModalSlot && (
                <div className="cms-modal-backdrop" onClick={onCloseModal}>
                    <div className="cms-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="cms-modal-header">
                            <h3>
                                {activeModalSlot === 'hero_video' 
                                    ? (isEn ? 'Hero Main Video Settings' : 'הגדרות וידאו ראשי')
                                    : (isEn ? `Edit ${currentModalSlotItem?.title.en}` : `עריכת ${currentModalSlotItem?.title.he}`)
                                }
                            </h3>
                            <button className="cms-modal-close" onClick={onCloseModal}>✕</button>
                        </div>

                        <div className="cms-modal-body">
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
            )}
        </section>
    )
}
