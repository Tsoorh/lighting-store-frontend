import { useContext } from 'react'
import { SiteMediaDraftContext } from '../context/site-media-draft'

export const useSiteMediaDraft = () => {
    const context = useContext(SiteMediaDraftContext)
    if (!context) {
        throw new Error('useSiteMediaDraft must be used within a SiteMediaDraftProvider')
    }
    return context
}
