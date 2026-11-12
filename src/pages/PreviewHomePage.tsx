import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/pages/HomePage.css'
import { HomeContent } from '../cmps/HomeContent'
import { authService } from '../services/auth.service'
import { type SiteMediaConfig, DEFAULT_SITE_MEDIA } from '../model/site-media.model'
import { useLanguage } from '../hooks/useLanguage'

export const PreviewHomePage: React.FC = () => {
    const [media, setMedia] = useState<SiteMediaConfig>(DEFAULT_SITE_MEDIA)
    const { language } = useLanguage()
    const navigate = useNavigate()
    const isEn = language === 'en'

    useEffect(() => {
        const user = authService.getLoggedinUser()
        const isAdmin = user?.role?.trim().toLowerCase() === 'admin'
        if (!isAdmin) {
            navigate('/')
            return
        }

        const handleMessage = (event: MessageEvent) => {
            // Strict origin and source validation
            if (event.origin !== window.location.origin) return
            if (event.source !== window.parent) return

            if (event.data?.type === 'TL_PREVIEW_DRAFT_UPDATE' && event.data?.payload) {
                const draft = event.data.payload as SiteMediaConfig
                if (draft.heroVideo && draft.gallery && draft.gallery.slot_1) {
                    setMedia(draft)
                }
            }
        }

        window.addEventListener('message', handleMessage)

        // Inform parent iframe container that preview is ready
        window.parent.postMessage({ type: 'TL_PREVIEW_FRAME_READY' }, window.location.origin)

        return () => window.removeEventListener('message', handleMessage)
    }, [navigate])

    return <HomeContent media={media} isEn={isEn} isPreview />
}
