import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react'
import {
    type SiteMediaConfig,
    DEFAULT_SITE_MEDIA,
    DEFAULT_FULL_WIDTH_BANNER,
    type CanonicalSlotId,
    type SiteMediaLogEntry,
    type ObjectPosition
} from '../model/site-media.model'
import { siteMediaService } from '../services/site-media.service'
import { uploadService, type CloudinaryUploadResult } from '../services/upload.service'
import { useLanguage } from '../hooks/useLanguage'

export interface SiteMediaDraftContextType {
    publishedConfig: SiteMediaConfig
    draftConfig: SiteMediaConfig
    isLoading: boolean
    isDirty: boolean
    isPublishing: boolean
    statusMessage: { type: 'success' | 'error' | 'info'; text: string } | null
    setStatusMessage: (msg: { type: 'success' | 'error' | 'info'; text: string } | null) => void
    isSlotModified: (slotId: CanonicalSlotId | 'hero_video' | 'full_width_banner') => boolean
    onOpenReplaceModal: (slotId: CanonicalSlotId | 'hero_video' | 'full_width_banner') => void
    onCloseModal: () => void
    onUndoSlot: (slotId: CanonicalSlotId | 'hero_video' | 'full_width_banner') => void
    onDiscardAll: () => void
    onPublish: () => Promise<void>
    // Banner handlers
    onToggleBannerEnabled: (enabled: boolean) => void
    onMoveBanner: (direction: 'up' | 'down') => void
    onUpdateBannerField: (field: 'linkUrl' | 'altEn' | 'altHe', val: string) => void
    // Modal states
    activeModalSlot: CanonicalSlotId | 'hero_video' | 'full_width_banner' | null
    tempPosition: ObjectPosition
    setTempPosition: React.Dispatch<React.SetStateAction<ObjectPosition>>
    uploadProgress: number | null
    aspectRatioWarning: string | null
    previewFileUrl: string | null
    onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void
    onConfirmUploadAndStaging: () => Promise<void>
    // History
    historyItems: SiteMediaLogEntry[]
    historyTotal: number
    historySlotFilter: string
    setHistorySlotFilter: (val: string) => void
    historyActionFilter: string
    setHistoryActionFilter: (val: string) => void
    loadHistory: () => Promise<void>
    onRestoreToDraft: (logEntry: SiteMediaLogEntry) => void
    // Simulation sync
    iframeRef: React.RefObject<HTMLIFrameElement>
    syncDraftToIframe: () => void
}

const SiteMediaDraftContext = createContext<SiteMediaDraftContextType | null>(null)

export const useSiteMediaDraft = () => {
    const context = useContext(SiteMediaDraftContext)
    if (!context) {
        throw new Error('useSiteMediaDraft must be used within a SiteMediaDraftProvider')
    }
    return context
}

export const SiteMediaDraftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const [publishedConfig, setPublishedConfig] = useState<SiteMediaConfig>(DEFAULT_SITE_MEDIA)
    const [draftConfig, setDraftConfig] = useState<SiteMediaConfig>(DEFAULT_SITE_MEDIA)
    const [isLoading, setIsLoading] = useState(true)
    const [isPublishing, setIsPublishing] = useState(false)
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

    // Modal & Positioning States
    const [activeModalSlot, setActiveModalSlot] = useState<CanonicalSlotId | 'hero_video' | 'full_width_banner' | null>(null)
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

    const iframeRef = useRef<HTMLIFrameElement>(null)

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
    const isSlotModified = (slotId: CanonicalSlotId | 'hero_video' | 'full_width_banner') => {
        if (slotId === 'hero_video') {
            return JSON.stringify(publishedConfig.heroVideo) !== JSON.stringify(draftConfig.heroVideo)
        }
        if (slotId === 'full_width_banner') {
            return JSON.stringify(publishedConfig.fullWidthBanner) !== JSON.stringify(draftConfig.fullWidthBanner)
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
    }, [draftConfig])

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
    function onOpenReplaceModal(slotId: CanonicalSlotId | 'hero_video' | 'full_width_banner') {
        setActiveModalSlot(slotId)
        setPendingFile(null)
        setPreviewFileUrl(null)
        setAspectRatioWarning(null)
        setUploadProgress(null)

        const currentPos = slotId === 'hero_video'
            ? draftConfig.heroVideo.objectPosition
            : slotId === 'full_width_banner'
            ? (draftConfig.fullWidthBanner?.objectPosition || { x: 50, y: 50 })
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

        if (!isVideo) {
            const img = new Image()
            img.onload = () => {
                const ratio = img.naturalWidth / img.naturalHeight
                const targetRatio = activeModalSlot === 'hero_video'
                    ? 1.778
                    : activeModalSlot === 'full_width_banner'
                    ? (draftConfig.fullWidthBanner?.targetRatio || 2.4)
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
                    const sig = await siteMediaService.getUploadSignature(activeModalSlot, resourceType)
                    setUploadProgress(30)
                    uploadRes = await uploadService.uploadDirectWithSignature(pendingFile, sig, (pct) => {
                        setUploadProgress(Math.min(95, 30 + Math.round(pct * 0.65)))
                    })
                } catch (sigErr: any) {
                    console.warn('Backend upload signature endpoint unavailable, using direct Cloudinary upload:', sigErr)
                    try {
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

                setDraftConfig(prev => {
                    const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
                    if (activeModalSlot === 'hero_video') {
                        next.heroVideo.url = uploadRes.secure_url
                        next.heroVideo.publicId = uploadRes.public_id
                        next.heroVideo.objectPosition = tempPosition
                    } else if (activeModalSlot === 'full_width_banner') {
                        const banner = next.fullWidthBanner ? { ...next.fullWidthBanner } : JSON.parse(JSON.stringify(DEFAULT_FULL_WIDTH_BANNER))
                        banner.url = uploadRes.secure_url
                        banner.publicId = uploadRes.public_id
                        banner.objectPosition = tempPosition
                        next.fullWidthBanner = banner
                    } else {
                        next.gallery[activeModalSlot].url = uploadRes.secure_url
                        next.gallery[activeModalSlot].publicId = uploadRes.public_id
                        next.gallery[activeModalSlot].objectPosition = tempPosition
                    }
                    return next
                })
            } else {
                setDraftConfig(prev => {
                    const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
                    if (activeModalSlot === 'hero_video') {
                        next.heroVideo.objectPosition = tempPosition
                    } else if (activeModalSlot === 'full_width_banner') {
                        const banner = next.fullWidthBanner ? { ...next.fullWidthBanner } : JSON.parse(JSON.stringify(DEFAULT_FULL_WIDTH_BANNER))
                        banner.objectPosition = tempPosition
                        next.fullWidthBanner = banner
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
    function onUndoSlot(slotId: CanonicalSlotId | 'hero_video' | 'full_width_banner') {
        setDraftConfig(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
            if (slotId === 'hero_video') {
                next.heroVideo = JSON.parse(JSON.stringify(publishedConfig.heroVideo))
            } else if (slotId === 'full_width_banner') {
                next.fullWidthBanner = publishedConfig.fullWidthBanner
                    ? JSON.parse(JSON.stringify(publishedConfig.fullWidthBanner))
                    : JSON.parse(JSON.stringify(DEFAULT_FULL_WIDTH_BANNER))
            } else {
                next.gallery[slotId] = JSON.parse(JSON.stringify(publishedConfig.gallery[slotId]))
            }
            return next
        })
    }

    // Banner handlers
    function onToggleBannerEnabled(enabled: boolean) {
        setDraftConfig(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
            const banner = next.fullWidthBanner ? { ...next.fullWidthBanner } : JSON.parse(JSON.stringify(DEFAULT_FULL_WIDTH_BANNER))
            banner.enabled = enabled
            next.fullWidthBanner = banner
            return next
        })
    }

    function onMoveBanner(direction: 'up' | 'down') {
        setDraftConfig(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
            const banner = next.fullWidthBanner ? { ...next.fullWidthBanner } : JSON.parse(JSON.stringify(DEFAULT_FULL_WIDTH_BANNER))
            const curPos = banner.position ?? 2
            const newPos = direction === 'up' ? Math.max(1, curPos - 1) : Math.min(5, curPos + 1)
            banner.position = newPos
            next.fullWidthBanner = banner
            return next
        })
    }

    function onUpdateBannerField(field: 'linkUrl' | 'altEn' | 'altHe', val: string) {
        setDraftConfig(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as SiteMediaConfig
            const banner = next.fullWidthBanner ? { ...next.fullWidthBanner } : JSON.parse(JSON.stringify(DEFAULT_FULL_WIDTH_BANNER))
            if (field === 'linkUrl') banner.linkUrl = val
            if (field === 'altEn') banner.alt = { ...(banner.alt || { en: '', he: '' }), en: val }
            if (field === 'altHe') banner.alt = { ...(banner.alt || { en: '', he: '' }), he: val }
            next.fullWidthBanner = banner
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
            } else if (logEntry.slotId === 'full_width_banner') {
                const banner = next.fullWidthBanner ? { ...next.fullWidthBanner } : JSON.parse(JSON.stringify(DEFAULT_FULL_WIDTH_BANNER))
                banner.url = logEntry.previousAsset.url
                banner.publicId = logEntry.previousAsset.publicId
                if (logEntry.previousAsset.objectPosition) {
                    banner.objectPosition = logEntry.previousAsset.objectPosition
                }
                next.fullWidthBanner = banner
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

        setStatusMessage({
            type: 'info',
            text: isEn
                ? `Historical asset for ${logEntry.slotId} loaded into draft. Review in simulation and click "Approve & Publish" to go live.`
                : `הקובץ ההיסטורי עבור ${logEntry.slotId} נטען לטיוטה. בדוק בהדמיה ולחץ "אשר ופרסם לאתר" להחלה חיה.`
        })
    }

    const value: SiteMediaDraftContextType = {
        publishedConfig,
        draftConfig,
        isLoading,
        isDirty,
        isPublishing,
        statusMessage,
        setStatusMessage,
        isSlotModified,
        onOpenReplaceModal,
        onCloseModal,
        onUndoSlot,
        onDiscardAll,
        onPublish,
        onToggleBannerEnabled,
        onMoveBanner,
        onUpdateBannerField,
        activeModalSlot,
        tempPosition,
        setTempPosition,
        uploadProgress,
        aspectRatioWarning,
        previewFileUrl,
        onFileSelected,
        onConfirmUploadAndStaging,
        historyItems,
        historyTotal,
        historySlotFilter,
        setHistorySlotFilter,
        historyActionFilter,
        setHistoryActionFilter,
        loadHistory,
        onRestoreToDraft,
        iframeRef,
        syncDraftToIframe
    }

    return (
        <SiteMediaDraftContext.Provider value={value}>
            {children}
        </SiteMediaDraftContext.Provider>
    )
}
