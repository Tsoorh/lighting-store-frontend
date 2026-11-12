import React, { createContext } from 'react'
import type {
    SiteMediaConfig,
    CanonicalSlotId,
    SiteMediaLogEntry,
    ObjectPosition
} from '../model/site-media.model'

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
    onToggleBannerEnabled: (enabled: boolean) => void
    onMoveBanner: (direction: 'up' | 'down') => void
    onUpdateBannerField: (field: 'linkUrl' | 'altEn' | 'altHe', val: string) => void
    activeModalSlot: CanonicalSlotId | 'hero_video' | 'full_width_banner' | null
    tempPosition: ObjectPosition
    setTempPosition: React.Dispatch<React.SetStateAction<ObjectPosition>>
    uploadProgress: number | null
    aspectRatioWarning: string | null
    previewFileUrl: string | null
    onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void
    onConfirmUploadAndStaging: () => Promise<void>
    historyItems: SiteMediaLogEntry[]
    historyTotal: number
    historySlotFilter: string
    setHistorySlotFilter: (val: string) => void
    historyActionFilter: string
    setHistoryActionFilter: (val: string) => void
    loadHistory: () => Promise<void>
    onRestoreToDraft: (logEntry: SiteMediaLogEntry) => void
    iframeRef: React.RefObject<HTMLIFrameElement>
    syncDraftToIframe: () => void
}

export const SiteMediaDraftContext = createContext<SiteMediaDraftContextType | null>(null)
