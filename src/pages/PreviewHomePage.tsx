import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { type SiteMediaConfig, DEFAULT_SITE_MEDIA } from '../model/site-media.model'
import { useLanguage } from '../hooks/useLanguage'
import { Icons } from '../cmps/Icons'
import '../assets/styles/pages/HomePage.css'

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

    const heroVid = media.heroVideo
    const g = media.gallery

    return (
        <div className="main-layout preview-mode-container" dir={isEn ? 'ltr' : 'rtl'}>
            <section className="hero-section">
                <div className="entry-vid">
                    <video 
                        key={heroVid.url}
                        src={heroVid.url} 
                        poster={heroVid.posterUrl || undefined}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="cover-img"
                        style={{
                            objectPosition: `${heroVid.objectPosition?.x ?? 50}% ${heroVid.objectPosition?.y ?? 50}%`
                        }}
                    />
                    <img src="/images/Figma/bright_logo_horizontal.png" alt="Bright Logo" className="entry-logo entry-logo-desktop" />
                    <div className="entry-logo entry-logo-mobile">
                        <img src="/images/Figma/T_tiran_slogen_logo.png" alt="Tiran Logo" />
                        <img src="/images/Figma/Tiran_lasry_slogen.png" alt="Tiran Lasry Slogan" />
                    </div>
                    <div className="entry-line"></div>
                    <div className="entry-cta animated-link" style={{ pointerEvents: 'none' }}>
                        <span className="entry-cta-text">{isEn ? 'View Collection' : 'צפיה בגופי התאורה'}</span>
                        <Icons iconName={isEn ? 'next' : 'back'} />
                    </div>
                </div>
                <div className="entry-vid-text">
                    {isEn 
                        ? 'Handcrafted lighting fixtures, combining 40 years of experience in the lighting world with precise craftsmanship and material sensitivity.'
                        : 'גופי תאורה בעבודת יד, המשלבים 40 שנות ניסיון בעולם התאורה עם מלאכה מדויקת ורגישות חומרית.'}
                </div>
            </section>

            <section className="gallery-sec page-section" style={{ marginTop: '40px', marginBottom: '60px' }}>
                <div className="gallery-grid">
                    {/* Item 1: slot_1 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_1.url} 
                            alt={isEn ? g.slot_1.alt.en : g.slot_1.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_1.objectPosition?.x ?? 50}% ${g.slot_1.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>

                    {/* Item 2: Fixed About Card */}
                    <div className="gallery-item gallery-about-card" dir={isEn ? 'ltr' : 'rtl'}>
                        <h3 className="gallery-about-title">
                            {isEn ? <>Second generation in lighting.<br />Choosing art.</> : <>דור שני לתאורה.<br />בחירה באמנות.</>}
                        </h3>
                        <div className="gallery-about-link animated-link" style={{ pointerEvents: 'none' }}>
                            <span>{isEn ? 'About Me' : 'אודותיי'}</span>
                            <Icons iconName={isEn ? 'next' : 'back'} />
                        </div>
                    </div>

                    {/* Item 3: slot_3 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_3.url} 
                            alt={isEn ? g.slot_3.alt.en : g.slot_3.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_3.objectPosition?.x ?? 50}% ${g.slot_3.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>

                    {/* Item 4: slot_4 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_4.url} 
                            alt={isEn ? g.slot_4.alt.en : g.slot_4.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_4.objectPosition?.x ?? 50}% ${g.slot_4.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>

                    {/* Item 5: slot_5 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_5.url} 
                            alt={isEn ? g.slot_5.alt.en : g.slot_5.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_5.objectPosition?.x ?? 50}% ${g.slot_5.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>

                    {/* Item 6: slot_6 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_6.url} 
                            alt={isEn ? g.slot_6.alt.en : g.slot_6.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_6.objectPosition?.x ?? 50}% ${g.slot_6.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}
