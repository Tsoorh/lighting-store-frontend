import React, { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../../services/gallery.service';
import { uploadService } from '../../services/upload.service';
import { productService } from '../../services/product.service';
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryItem } from '../../model/gallery.model';
import type { FullProduct } from '../../model/product.model';
import { useLanguage } from '../../hooks/useLanguage';

interface AdminGalleryEditorProps {
    isGalleryActive: boolean;
}

const MAX_FILE_BYTES = 15 * 1024 * 1024;

export const AdminGalleryEditor: React.FC<AdminGalleryEditorProps> = ({ isGalleryActive }) => {
    const { language } = useLanguage();
    const isEn = language === 'en';
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [items, setItems] = useState<GalleryItem[]>([]);
    const [savedSnapshot, setSavedSnapshot] = useState<string>('[]');
    const [products, setProducts] = useState<FullProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const [galleryCfg, allProducts] = await Promise.all([
                    galleryService.getGallery(),
                    productService.query({}).catch(() => [] as FullProduct[]),
                ]);
                setItems(galleryCfg.items);
                setSavedSnapshot(JSON.stringify(galleryCfg.items));
                setProducts(allProducts || []);
            } catch (err) {
                console.error('Failed to load gallery editor data', err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const isDirty = JSON.stringify(items) !== savedSnapshot;
    const visibleCount = items.filter((item) => item.isVisible !== false).length;

    async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        e.target.value = '';
        if (files.length === 0) return;

        setFeedback(null);
        const uploadedItems: GalleryItem[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) {
                    throw new Error(isEn ? `Unsupported file type: ${file.name}` : `סוג קובץ לא נתמך: ${file.name}`);
                }
                if (file.size > MAX_FILE_BYTES) {
                    throw new Error(
                        isEn ? `${file.name} exceeds 15MB limit` : `${file.name} חורג ממגבלת 15MB`
                    );
                }

                setUploadStatus(
                    isEn
                        ? `Uploading photo ${i + 1} of ${files.length}...`
                        : `מעלה תמונה ${i + 1} מתוך ${files.length}...`
                );

                const sig = await galleryService.getUploadSignature();
                const res = await uploadService.uploadDirectWithSignature(file, sig);

                uploadedItems.push({
                    id: `gal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                    url: res.secure_url,
                    publicId: res.public_id,
                    title: { en: '', he: '' },
                    category: null,
                    productId: null,
                    isVisible: true,
                    order: items.length + uploadedItems.length,
                    createdAt: new Date().toISOString(),
                });
            }

            setItems((prev) =>
                [...prev, ...uploadedItems].map((item, idx) => ({ ...item, order: idx }))
            );
            setFeedback({
                type: 'success',
                text: isEn
                    ? `${uploadedItems.length} photo(s) uploaded. Remember to click "Save Gallery" to publish.`
                    : `${uploadedItems.length} תמונות הועלו בהצלחה. לחץ על "שמור גלריה" כדי לשמור באתר.`,
            });
        } catch (err) {
            console.error('Gallery upload failed', err);
            setFeedback({
                type: 'error',
                text: err instanceof Error ? err.message : isEn ? 'Upload failed' : 'העלאת התמונה נכשלה',
            });
        } finally {
            setUploadStatus(null);
        }
    }

    function updateItem(id: string, patch: Partial<GalleryItem>) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    }

    function moveItem(index: number, direction: -1 | 1) {
        const target = index + direction;
        if (target < 0 || target >= items.length) return;
        setItems((prev) => {
            const copy = [...prev];
            const [moved] = copy.splice(index, 1);
            copy.splice(target, 0, moved);
            return copy.map((item, idx) => ({ ...item, order: idx }));
        });
    }

    function removeItem(id: string) {
        setItems((prev) => prev.filter((item) => item.id !== id).map((item, idx) => ({ ...item, order: idx })));
    }

    function handleDiscard() {
        try {
            setItems(JSON.parse(savedSnapshot) as GalleryItem[]);
            setFeedback(null);
        } catch {
            setItems([]);
        }
    }

    async function handleSave() {
        try {
            setIsSaving(true);
            setFeedback(null);
            const updated = await galleryService.saveGallery(items);
            setItems(updated.items);
            setSavedSnapshot(JSON.stringify(updated.items));
            queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
            setFeedback({
                type: 'success',
                text: isEn ? 'Gallery saved successfully!' : 'הגלריה נשמרה בהצלחה!',
            });
        } catch (err) {
            console.error('Failed to save gallery', err);
            setFeedback({
                type: 'error',
                text: isEn ? 'Failed to save gallery changes.' : 'שמירת השינויים בגלריה נכשלה.',
            });
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>{isEn ? 'Loading Gallery Editor...' : 'טוען עורך גלריה...'}</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} dir={isEn ? 'ltr' : 'rtl'}>
            {/* Hidden Status Notice Banner */}
            {!isGalleryActive && (
                <div
                    style={{
                        padding: '14px 18px',
                        borderRadius: '8px',
                        background: '#fff8e1',
                        border: '1px solid #ffe082',
                        color: '#795548',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        fontSize: '0.92rem',
                    }}
                >
                    <span style={{ fontSize: '1.15rem' }}>⚠️</span>
                    <span>
                        {isEn
                            ? 'This Gallery page is currently HIDDEN (OFF) on the website. You can upload and organize photos here; when ready, switch it ON under the "Categories & Pages" tab.'
                            : 'עמוד הגלריה נמצא כרגע במצב מוסתר (כבוי) באתר. ניתן להעלות ולארגן כאן תמונות, וכשהכל מוכן — להפעיל אותו בלשונית "קטגוריות ועמודים".'}
                    </span>
                </div>
            )}

            {/* Top Action & Stats Toolbar */}
            <div className="cms-top-bar" style={{ position: 'static' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#1e1c19' }}>
                            {isEn ? 'Gallery Photos' : 'תמונות הגלריה'} ({items.length})
                        </strong>
                        <span
                            className={`cms-status-badge ${visibleCount >= 6 ? 'published' : 'draft'}`}
                            style={{ animation: 'none', fontSize: '0.78rem' }}
                        >
                            {isEn
                                ? `${visibleCount} visible • Min 6 recommended (9–15 ideal)`
                                : `${visibleCount} מוצגות • מומלץ מינימום 6 תמונות (9–15 אידיאלי)`}
                        </span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#666' }}>
                        {isEn
                            ? 'Upload installation & lighting photos. Titles, categories, and product links are optional.'
                            : 'העלה תמונות של התקנות וגופי תאורה. כותרת, קטגוריה וקישור למוצר הם שדות רשות.'}
                    </span>
                </div>

                <div className="cms-actions-group" style={{ flexWrap: 'wrap' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFilesSelected}
                        style={{ display: 'none' }}
                    />
                    <button
                        type="button"
                        className="btn-cms-discard"
                        style={{ background: '#f5f5f5', color: '#1e1c19', borderColor: '#bdbdbd' }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={Boolean(uploadStatus) || isSaving}
                    >
                        {uploadStatus
                            ? uploadStatus
                            : isEn
                                ? '+ Upload Photos'
                                : '+ העלה תמונות'}
                    </button>
                    {isDirty && (
                        <button
                            type="button"
                            className="btn-cms-discard"
                            onClick={handleDiscard}
                            disabled={isSaving}
                        >
                            {isEn ? 'Discard' : 'בטל שינויים'}
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn-cms-publish"
                        onClick={handleSave}
                        disabled={!isDirty || isSaving || Boolean(uploadStatus)}
                    >
                        {isSaving
                            ? isEn
                                ? 'Saving...'
                                : 'שומר...'
                            : isEn
                                ? 'Save Gallery'
                                : 'שמור גלריה'}
                    </button>
                </div>
            </div>

            {feedback && (
                <div
                    style={{
                        padding: '12px 16px',
                        borderRadius: '6px',
                        background: feedback.type === 'success' ? '#e8f5e9' : '#ffebee',
                        color: feedback.type === 'success' ? '#1b5e20' : '#b71c1c',
                        border: `1px solid ${feedback.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span>{feedback.text}</span>
                    <button
                        type="button"
                        onClick={() => setFeedback(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {items.length === 0 ? (
                <div
                    style={{
                        padding: '48px 24px',
                        border: '2px dashed #d5d0c8',
                        borderRadius: '8px',
                        textAlign: 'center',
                        background: '#faf9f6',
                    }}
                >
                    <p style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#444' }}>
                        {isEn
                            ? 'No gallery photos uploaded yet.'
                            : 'עדיין לא הועלו תמונות לגלריה.'}
                    </p>
                    <button
                        type="button"
                        className="btn-cms-publish"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={Boolean(uploadStatus)}
                    >
                        {isEn ? '+ Upload Your First Photos' : '+ העלה תמונות ראשונות'}
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className="admin-gallery-item-card"
                            style={{
                                opacity: item.isVisible === false ? 0.65 : 1,
                            }}
                        >
                            {/* Thumbnail */}
                            <div
                                style={{
                                    width: '140px',
                                    height: '120px',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    background: '#ede9e2',
                                }}
                            >
                                <img
                                    src={galleryService.transformCloudinaryUrl(item.url, 400)}
                                    alt={item.title?.en || item.title?.he || `Gallery ${idx + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </div>

                            {/* Optional Metadata Inputs */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    gap: '10px',
                                }}
                            >
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#555' }}>
                                    <span>{isEn ? 'Title (Hebrew - optional)' : 'כותרת (עברית - רשות)'}</span>
                                    <input
                                        type="text"
                                        value={item.title?.he || ''}
                                        onChange={(e) =>
                                            updateItem(item.id, {
                                                title: { ...item.title, he: e.target.value },
                                            })
                                        }
                                        placeholder={isEn ? 'e.g. בית פרטי בהרצליה' : 'לדוגמה: בית פרטי בהרצליה'}
                                        style={{ padding: '7px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </label>

                                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#555' }}>
                                    <span>{isEn ? 'Title (English - optional)' : 'כותרת (אנגלית - רשות)'}</span>
                                    <input
                                        type="text"
                                        value={item.title?.en || ''}
                                        onChange={(e) =>
                                            updateItem(item.id, {
                                                title: { ...item.title, en: e.target.value },
                                            })
                                        }
                                        placeholder="e.g. Herzliya Residence"
                                        style={{ padding: '7px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </label>

                                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#555' }}>
                                    <span>{isEn ? 'Category Filter (optional)' : 'קטגוריית סינון (רשות)'}</span>
                                    <select
                                        value={item.category || ''}
                                        onChange={(e) =>
                                            updateItem(item.id, {
                                                category: (e.target.value || null) as GalleryCategory | null,
                                            })
                                        }
                                        style={{ padding: '7px 10px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
                                    >
                                        <option value="">{isEn ? '— None —' : '— ללא קטגוריה —'}</option>
                                        {GALLERY_CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {isEn ? cat.en : cat.he}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#555' }}>
                                    <span>{isEn ? 'Link Catalog Fixture (optional)' : 'קישור לגוף תאורה בקטלוג (רשות)'}</span>
                                    <select
                                        value={item.productId || ''}
                                        onChange={(e) =>
                                            updateItem(item.id, { productId: e.target.value || null })
                                        }
                                        style={{ padding: '7px 10px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
                                    >
                                        <option value="">{isEn ? '— None —' : '— ללא קישור —'}</option>
                                        {products.map((prod) => (
                                            <option key={prod._id} value={prod._id}>
                                                {isEn
                                                    ? prod.name?.en || prod.name?.he || prod._id
                                                    : prod.name?.he || prod.name?.en || prod._id}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            {/* Actions Column */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'stretch' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                        type="button"
                                        onClick={() => moveItem(idx, -1)}
                                        disabled={idx === 0}
                                        title={isEn ? 'Move Up' : 'הזז למעלה'}
                                        style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveItem(idx, 1)}
                                        disabled={idx === items.length - 1}
                                        title={isEn ? 'Move Down' : 'הזז למטה'}
                                        style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer' }}
                                    >
                                        ↓
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => updateItem(item.id, { isVisible: item.isVisible === false })}
                                    style={{
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        background: item.isVisible !== false ? '#e8f5e9' : '#f5f5f5',
                                        color: item.isVisible !== false ? '#2e7d32' : '#666',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {item.isVisible !== false
                                        ? isEn
                                            ? 'Visible'
                                            : 'מוצגת'
                                        : isEn
                                            ? 'Hidden'
                                            : 'מוסתרת'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    style={{
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ef9a9a',
                                        background: '#ffebee',
                                        color: '#c62828',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isEn ? 'Delete' : 'מחק'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
