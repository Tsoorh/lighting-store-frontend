export type GalleryCategory = 'pendant' | 'wall' | 'ceiling' | 'projects';

export interface GalleryBilingualText {
    en?: string | null;
    he?: string | null;
}

export interface GalleryItem {
    id: string;
    url: string;
    publicId?: string | null;
    title?: GalleryBilingualText | null;
    category?: GalleryCategory | null;
    productId?: string | null;
    isVisible?: boolean;
    order: number;
    createdAt?: string;
}

export interface GalleryConfig {
    _id?: string;
    items: GalleryItem[];
    updatedAt?: string;
}

export const GALLERY_CATEGORIES: Array<{
    value: GalleryCategory;
    en: string;
    he: string;
}> = [
    { value: 'projects', en: 'Projects', he: 'פרויקטים' },
    { value: 'pendant', en: 'Pendant', he: 'תלויים' },
    { value: 'wall', en: 'Wall', he: 'קיר' },
    { value: 'ceiling', en: 'Ceiling', he: 'צמודי תקרה' },
];
