import React from 'react'
import { useSiteMediaDraft } from '../../context/SiteMediaDraftContext'
import { useLanguage } from '../../hooks/useLanguage'

export const AdminTopBar: React.FC = () => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const {
        publishedConfig,
        isDirty,
        isPublishing,
        statusMessage,
        setStatusMessage,
        onDiscardAll,
        onPublish
    } = useSiteMediaDraft()

    return (
        <>
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
        </>
    )
}

