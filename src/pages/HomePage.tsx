import { useState, useEffect } from 'react'
import '../assets/styles/pages/HomePage.css'
import { HomeContent } from '../cmps/HomeContent'
import { useLanguage } from '../hooks/useLanguage'
import { authService } from '../services/auth.service'
import { productService } from '../services/product.service'
import { siteMediaService } from '../services/site-media.service'
import type { SiteMediaConfig } from '../model/site-media.model'
import type { Miniuser } from '../model/user.model'

export const HomePage = () => {
    const { language } = useLanguage()
    const [user] = useState<Miniuser | null>(authService.getLoggedinUser())
    const [media, setMedia] = useState<SiteMediaConfig>(siteMediaService.getCachedSiteMedia())

    const isEn = language === 'en'

    useEffect(() => {
        let isMounted = true
        siteMediaService.getSiteMedia()
            .then(liveMedia => {
                if (isMounted && liveMedia && liveMedia.gallery) {
                    setMedia(liveMedia)
                }
            })
            .catch(err => console.error('Failed to load site media on HomePage', err))
        return () => { isMounted = false }
    }, [])

    const canDownloadPriceList = Boolean(
        user?.role && ['admin', 'supplier', 'architect'].includes(user.role.trim().toLowerCase())
    )

    const onDownloadPriceList = async (type: 'pdf' | 'excel') => {
        try {
            await productService.downloadPriceList(type)
        } catch (err) {
            console.error('Failed to download price list', err)
        }
    }

    return (
        <HomeContent
            media={media}
            isEn={isEn}
            canDownloadPriceList={canDownloadPriceList}
            onDownloadPriceList={onDownloadPriceList}
        />
    )
}
