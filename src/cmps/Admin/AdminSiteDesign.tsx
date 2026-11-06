import React from 'react'
import { AdminEditPage } from './AdminEditPage'
import { SiteMediaDraftProvider } from '../../context/SiteMediaDraftContext'

/**
 * @deprecated Use AdminEditPage instead.
 * Retained for backwards compatibility.
 */
export const AdminSiteDesign: React.FC = () => {
    return (
        <SiteMediaDraftProvider>
            <AdminEditPage />
        </SiteMediaDraftProvider>
    )
}
