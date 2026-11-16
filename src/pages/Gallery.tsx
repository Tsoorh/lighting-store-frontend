import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../services/gallery.service';
import { optionsService } from '../services/options.service';
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryItem } from '../model/gallery.model';
import { useLanguage } from '../hooks/useLanguage';
import { ContactSection } from '../cmps/ContactSection';

export const Gallery: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const isEn = language === 'en';

    const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'all'>('all');
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    const touchStartX = useRef<number | null>(null);

    const { data: siteOptions } = useQuery({
        queryKey: ['site-options'],
        queryFn: () => optionsService.getSiteOptions(),
        staleTime: 1000 * 60 * 5,
    });

    const { data: galleryConfig, isLoading } = useQuery({
        queryKey: ['gallery-items'],
        queryFn: () => galleryService.getGallery(),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (siteOptions && siteOptions.isGalleryActive === false) {
            navigate('/', { replace: true });
        }
    }, [siteOptions, navigate]);

    const visibleItems = useMemo(() => {
        return (galleryConfig?.items || []).filter((item) => item.isVisible !== false);
    }, [galleryConfig]);

    const availableCategories = useMemo(() => {
        const present = new Set(
            visibleItems
                .map((item) => item.category)
                .filter((cat): cat is GalleryCategory => Boolean(cat))
        );
        return GALLERY_CATEGORIES.filter((cat) => present.has(cat.value));
    }, [visibleItems]);

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'all') return visibleItems;
        return visibleItems.filter((item) => item.category === selectedCategory);
    }, [visibleItems, selectedCategory]);

    const activeItem: GalleryItem | null =
        lightboxIdx !== null && filteredItems[lightboxIdx] ? filteredItems[lightboxIdx] : null;

    useEffect(() => {
        if (lightboxIdx === null) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setLightboxIdx(null);
            } else if (e.key === 'ArrowRight') {
                setLightboxIdx((prev) => {
                    if (prev === null || filteredItems.length === 0) return null;
                    return isEn
                        ? (prev + 1) % filteredItems.length
                        : (prev - 1 + filteredItems.length) % filteredItems.length;
                });
            } else if (e.key === 'ArrowLeft') {
                setLightboxIdx((prev) => {
                    if (prev === null || filteredItems.length === 0) return null;
                    return isEn
                        ? (prev - 1 + filteredItems.length) % filteredItems.length
                        : (prev + 1) % filteredItems.length;
                });
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [lightboxIdx, filteredItems.length, isEn]);

    function getItemTitle(item: GalleryItem): string {
        const en = item.title?.en?.trim();
        const he = item.title?.he?.trim();
        return isEn ? en || he || '' : he || en || '';
    }

    function stepLightbox(delta: number) {
        if (filteredItems.length === 0) return;
        setLightboxIdx((prev) => {
            if (prev === null) return null;
            return (prev + delta + filteredItems.length) % filteredItems.length;
        });
    }

    function handleTouchStart(e: React.TouchEvent) {
        touchStartX.current = e.touches[0]?.clientX ?? null;
    }

    function handleTouchEnd(e: React.TouchEvent) {
        if (touchStartX.current === null) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
        const deltaX = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(deltaX) < 40) return;
        if (deltaX < 0) {
            stepLightbox(isEn ? 1 : -1);
        } else {
            stepLightbox(isEn ? -1 : 1);
        }
    }

    if (siteOptions && siteOptions.isGalleryActive === false) {
        return null;
    }

    return (
        <div className="gallery-page" dir={isEn ? 'ltr' : 'rtl'}>
            <section className="gallery-container">
                <header className="gallery-header">
                    <h1 className="gallery-title">{isEn ? 'Gallery' : 'גלריה'}</h1>
                    <p className="gallery-subtitle">
                        {isEn
                            ? 'Selected handcrafted lighting installations across private residences, hospitality, and architectural spaces.'
                            : 'מבחר פרויקטים והתקנות של גופי תאורה בעבודת יד בחללים פרטיים, מלונאות ואדריכלות.'}
                    </p>
                </header>

                {availableCategories.length > 0 && (
                    <div className="gallery-filter-bar" role="tablist" aria-label={isEn ? 'Gallery categories' : 'סינון גלריה'}>
                        <button
                            type="button"
                            className={`gallery-filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedCategory('all');
                                setLightboxIdx(null);
                            }}
                        >
                            {isEn ? 'All' : 'הכל'}
                        </button>
                        {availableCategories.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                className={`gallery-filter-pill ${selectedCategory === cat.value ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory(cat.value);
                                    setLightboxIdx(null);
                                }}
                            >
                                {isEn ? cat.en : cat.he}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading ? (
                    <div className="gallery-skeleton-grid" aria-busy="true">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="gallery-skeleton-card" />
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="gallery-empty">
                        {isEn
                            ? 'New lighting installation photos are being curated and will appear here soon.'
                            : 'תמונות חדשות של פרויקטים וגופי תאורה יעלו לכאן בקרוב.'}
                    </div>
                ) : (
                    <div className="gallery-masonry">
                        {filteredItems.map((item, idx) => {
                            const title = getItemTitle(item);
                            const src600 = galleryService.transformCloudinaryUrl(item.url, 600);
                            const src900 = galleryService.transformCloudinaryUrl(item.url, 900);
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className="gallery-masonry-item"
                                    onClick={() => setLightboxIdx(idx)}
                                    aria-label={title || (isEn ? `Open gallery image ${idx + 1}` : `פתח תמונה ${idx + 1}`)}
                                >
                                    <img
                                        src={src900}
                                        srcSet={src600 !== item.url ? `${src600} 600w, ${src900} 900w` : undefined}
                                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                        alt={title || (isEn ? 'Tiran Lasry lighting fixture' : 'גוף תאורה טירן לסרי')}
                                        loading="lazy"
                                    />
                                    <div className="gallery-item-overlay">
                                        <span className="gallery-item-title">{title}</span>
                                        <span className="gallery-item-expand" aria-hidden="true">⤢</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {activeItem && lightboxIdx !== null && (
                <div
                    className="gallery-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={getItemTitle(activeItem) || (isEn ? 'Gallery image viewer' : 'תצוגת תמונה')}
                    onClick={() => setLightboxIdx(null)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="gallery-lightbox-top" onClick={(e) => e.stopPropagation()}>
                        <span>
                            {lightboxIdx + 1} / {filteredItems.length}
                        </span>
                        <button
                            type="button"
                            className="gallery-lightbox-close"
                            onClick={() => setLightboxIdx(null)}
                            aria-label={isEn ? 'Close' : 'סגור'}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="gallery-lightbox-stage" onClick={(e) => e.stopPropagation()}>
                        {filteredItems.length > 1 && (
                            <button
                                type="button"
                                className="gallery-lightbox-nav prev"
                                onClick={() => stepLightbox(-1)}
                                aria-label={isEn ? 'Previous image' : 'תמונה קודמת'}
                            >
                                {isEn ? '‹' : '›'}
                            </button>
                        )}

                        <div className="gallery-lightbox-image-wrap">
                            <img
                                src={galleryService.transformCloudinaryUrl(activeItem.url, 1800)}
                                alt={getItemTitle(activeItem) || (isEn ? 'Gallery lighting image' : 'תמונת גלריה')}
                            />
                        </div>

                        {filteredItems.length > 1 && (
                            <button
                                type="button"
                                className="gallery-lightbox-nav next"
                                onClick={() => stepLightbox(1)}
                                aria-label={isEn ? 'Next image' : 'תמונה הבאה'}
                            >
                                {isEn ? '›' : '‹'}
                            </button>
                        )}
                    </div>

                    {(getItemTitle(activeItem) || activeItem.productId) && (
                        <div className="gallery-lightbox-footer" onClick={(e) => e.stopPropagation()}>
                            {getItemTitle(activeItem) && (
                                <span className="gallery-lightbox-caption">{getItemTitle(activeItem)}</span>
                            )}
                            {activeItem.productId && (
                                <button
                                    type="button"
                                    className="gallery-lightbox-product-link"
                                    onClick={() => {
                                        const targetId = activeItem.productId;
                                        setLightboxIdx(null);
                                        navigate(`/product/${targetId}`);
                                    }}
                                >
                                    {isEn ? 'View Fixture' : 'לפרטי גוף התאורה'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            <ContactSection />
        </div>
    );
};
