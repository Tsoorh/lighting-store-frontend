import { httpService } from './http.service'
import { 
    type SiteMediaConfig, 
    DEFAULT_SITE_MEDIA, 
    DEFAULT_FULL_WIDTH_BANNER,
    type SiteMediaLogEntry, 
    type CanonicalSlotId 
} from '../model/site-media.model'

const CACHE_KEY = 'tl_site_media_cache'

export interface UploadSignatureResponse {
    signature: string
    timestamp: number
    apiKey: string
    cloudName: string
    publicId: string
    folder: string
}

export const siteMediaService = {
    getCachedSiteMedia,
    getSiteMedia,
    getUploadSignature,
    publishMedia,
    getMediaLog,
    auditOrphans
}

function getCachedSiteMedia(): SiteMediaConfig {
    try {
        const item = localStorage.getItem(CACHE_KEY)
        if (item) {
            const parsed = JSON.parse(item)
            if (parsed && parsed.heroVideo && parsed.gallery && parsed.gallery.slot_1) {
                if (!parsed.fullWidthBanner) {
                    parsed.fullWidthBanner = DEFAULT_FULL_WIDTH_BANNER
                }
                return parsed
            }
        }
    } catch (err) {
        console.warn('Failed to parse cached site media', err)
    }
    return DEFAULT_SITE_MEDIA
}

async function getSiteMedia(): Promise<SiteMediaConfig> {
    try {
        const config = await httpService.get<SiteMediaConfig>('site-media')
        if (config && config.gallery) {
            if (!config.fullWidthBanner) {
                config.fullWidthBanner = DEFAULT_FULL_WIDTH_BANNER
            }
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(config))
            } catch (storageErr) {
                console.warn('Failed to cache site media in localStorage', storageErr)
            }
            return config
        }
        return getCachedSiteMedia()
    } catch (err) {
        console.error('Failed to fetch site media from API, falling back to cache', err)
        return getCachedSiteMedia()
    }
}

async function getUploadSignature(
    slotId: CanonicalSlotId | 'hero_video' | 'full_width_banner', 
    resourceType: 'image' | 'video'
): Promise<UploadSignatureResponse> {
    const payload = {
        target: slotId === 'hero_video' ? 'hero_video' : slotId === 'full_width_banner' ? 'full_width_banner' : 'gallery',
        slotId,
        resourceType
    }
    return httpService.post<UploadSignatureResponse, typeof payload>('site-media/upload-signature', payload)
}

async function publishMedia(
    baseVersion: number, 
    draftConfig: SiteMediaConfig
): Promise<{ success: boolean; version: number; publicationId: string; config: SiteMediaConfig }> {
    const payload = { baseVersion, draftConfig }
    const res = await httpService.put<
        { success: boolean; version: number; publicationId: string; config: SiteMediaConfig },
        typeof payload
    >('site-media/publish', payload)

    if (res && res.config) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(res.config))
        } catch (err) {
            console.warn('Failed to update site media cache', err)
        }
    }
    return res
}

async function getMediaLog(params: { slotId?: string; actionType?: string; limit?: number; skip?: number } = {}) {
    return httpService.get<{ items: SiteMediaLogEntry[]; total: number }, typeof params>('site-media/log', params)
}

async function auditOrphans() {
    return httpService.get<any>('site-media/orphan-audit')
}

