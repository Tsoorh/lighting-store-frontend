import React, { useEffect, useState } from 'react';
import { optionsService } from '../../services/options.service';
import type { SiteOptions } from '../../model/options.model';
import { useLanguage } from '../../hooks/useLanguage';

interface VisibilityRowProps {
    title: string;
    description: string;
    isActive: boolean;
    isUpdating: boolean;
    isEn: boolean;
    onToggle: () => void;
}

const VisibilityRow: React.FC<VisibilityRowProps> = ({
    title,
    description,
    isActive,
    isUpdating,
    isEn,
    onToggle,
}) => (
    <div
        className="admin-category-visibility-card"
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: '#fafafa',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            gap: '16px',
            flexWrap: 'wrap',
        }}
    >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px', color: '#1e1c19' }}>
                    {title}
                </span>
                <span
                    style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? '#2e7d32' : '#9e9e9e',
                    }}
                />
            </div>
            <span style={{ fontSize: '13px', color: '#666' }}>{description}</span>
        </div>

        <button
            type="button"
            onClick={onToggle}
            disabled={isUpdating}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '20px',
                border: '1px solid ' + (isActive ? '#c8e6c9' : '#e0e0e0'),
                cursor: isUpdating ? 'wait' : 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: isActive ? '#e8f5e9' : '#f5f5f5',
                color: isActive ? '#2e7d32' : '#616161',
                transition: 'all 0.2s ease',
            }}
            title={isEn ? 'Click to show/hide on site' : 'לחץ להצגה או הסתרה באתר'}
        >
            <span>
                {isUpdating
                    ? isEn
                        ? 'Updating...'
                        : 'מעדכן...'
                    : isActive
                        ? isEn
                            ? '✓ ON (Shown on site)'
                            : '✓ פעיל (מוצג באתר)'
                        : isEn
                            ? '✕ OFF (Hidden from site)'
                            : '✕ כבוי (מוסתר מהאתר)'}
            </span>
        </button>
    </div>
);

export const AdminCategoriesAndPages: React.FC = () => {
    const { language } = useLanguage();
    const isEn = language === 'en';

    const [siteOptions, setSiteOptions] = useState<SiteOptions>({
        isNewCollectionActive: true,
        isGalleryActive: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [updatingKey, setUpdatingKey] = useState<'newCollection' | 'gallery' | null>(null);

    useEffect(() => {
        async function loadOptions() {
            try {
                setIsLoading(true);
                const opt = await optionsService.getSiteOptions();
                setSiteOptions(opt);
            } catch (err) {
                console.error('Failed to load site options', err);
            } finally {
                setIsLoading(false);
            }
        }
        loadOptions();

        const onSiteOptionsChanged = (e: Event) => {
            const customEvent = e as CustomEvent<SiteOptions>;
            if (customEvent.detail) {
                setSiteOptions(customEvent.detail);
            }
        };
        window.addEventListener('site-options-changed', onSiteOptionsChanged);
        return () => window.removeEventListener('site-options-changed', onSiteOptionsChanged);
    }, []);

    async function handleToggle(key: 'newCollection' | 'gallery') {
        try {
            setUpdatingKey(key);
            const payload =
                key === 'newCollection'
                    ? { isNewCollectionActive: !siteOptions.isNewCollectionActive }
                    : { isGalleryActive: !siteOptions.isGalleryActive };

            const updated = await optionsService.updateSiteOptions(payload);
            setSiteOptions(updated);
        } catch (err) {
            console.error(`Failed to toggle ${key}`, err);
            alert(isEn ? 'Failed to update visibility' : 'עדכון ההגדרה נכשל');
        } finally {
            setUpdatingKey(null);
        }
    }

    if (isLoading) {
        return (
            <div className="admin-loader-container">
                <div className="admin-loader"></div>
                <p>{isEn ? 'Loading visibility settings...' : 'טוען הגדרות תצוגה...'}</p>
            </div>
        );
    }

    return (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} dir={isEn ? 'ltr' : 'rtl'}>
            {/* Section 1: Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '8px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e1c19' }}>
                        {isEn ? 'Categories' : 'קטגוריות'}
                    </h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                        {isEn
                            ? 'Show or hide special product categories in the catalog menu and filters.'
                            : 'הצגה או הסתרה של קטגוריות מוצרים בתפריט הראשי ובסרגל הסינונים.'}
                    </p>
                </div>

                <VisibilityRow
                    title={isEn ? 'Category: "New Collection"' : 'קטגוריה: "קולקציה חדשה"'}
                    description={
                        isEn
                            ? 'Controls whether "New Collection" appears under Lighting in the navigation menu and filter toolbar.'
                            : 'הגדרה זו קובעת האם קטגוריית "קולקציה חדשה" תוצג בתפריט תחת גופי תאורה ובסרגל הסינונים באתר.'
                    }
                    isActive={siteOptions.isNewCollectionActive}
                    isUpdating={updatingKey === 'newCollection'}
                    isEn={isEn}
                    onToggle={() => handleToggle('newCollection')}
                />
            </div>

            {/* Section 2: Pages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '8px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e1c19' }}>
                        {isEn ? 'Pages' : 'עמודים'}
                    </h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                        {isEn
                            ? 'Show or hide standalone pages in the main website navigation header.'
                            : 'הצגה או הסתרה של עמודים בתפריט הניווט הראשי של האתר.'}
                    </p>
                </div>

                <VisibilityRow
                    title={isEn ? 'Page: "Gallery"' : 'עמוד: "גלריה"'}
                    description={
                        isEn
                            ? 'Controls whether "Gallery" appears in the header between Lighting and About. Manage Gallery photos inside "Edit Page".'
                            : 'הגדרה זו קובעת האם הקישור "גלריה" יוצג בתפריט בין גופי תאורה לאודות. עריכת תמונות הגלריה מתבצעת תחת "עריכת עמוד".'
                    }
                    isActive={siteOptions.isGalleryActive}
                    isUpdating={updatingKey === 'gallery'}
                    isEn={isEn}
                    onToggle={() => handleToggle('gallery')}
                />
            </div>
        </section>
    );
};
