import React, { useState } from 'react'
import { useSiteMediaDraft } from '../../context/SiteMediaDraftContext'
import { useLanguage } from '../../hooks/useLanguage'

interface AdminSimulationViewProps {
    title?: string
    subtitle?: string
}

export const AdminSimulationView: React.FC<AdminSimulationViewProps> = ({
    title,
    subtitle
}) => {
    const { language } = useLanguage()
    const isEn = language === 'en'
    const { iframeRef, syncDraftToIframe } = useSiteMediaDraft()
    const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

    const displayTitle = title || (isEn ? 'Real-Time Homepage Simulator' : 'הדמיית דף הבית בזמן אמת')
    const displaySubtitle = subtitle || (isEn ? 'Inspects actual CSS media queries and image cropping.' : 'מדמה בדיוק את המדיה קווריס, החיתוך והרספונסיביות.')

    return (
        <div className="cms-simulation-panel">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '1280px',
                marginBottom: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
            }}>
                <div>
                    <h3 style={{ margin: 0 }}>{displayTitle}</h3>
                    <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                        {displaySubtitle}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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

                    <a
                        href="/preview-homepage"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cms-device-btn"
                        style={{
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#f0f0f0',
                            border: '1px solid #ddd'
                        }}
                        title={isEn ? 'Open simulation in a new window' : 'פתח הדמיה בחלון חדש'}
                    >
                        ↗ {isEn ? 'Full Screen' : 'מסך מלא'}
                    </a>
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
    )
}

