import { httpService } from './http.service';
import type { UploadSignatureResponse } from './site-media.service';
import type { GalleryConfig, GalleryItem } from '../model/gallery.model';

export const galleryService = {
    getGallery,
    getUploadSignature,
    saveGallery,
    transformCloudinaryUrl,
};

async function getGallery(): Promise<GalleryConfig> {
    try {
        const config = await httpService.get<GalleryConfig>('gallery');
        const items = Array.isArray(config?.items)
            ? [...config.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            : [];
        return { _id: config?._id || 'gallery_items', items, updatedAt: config?.updatedAt };
    } catch (err) {
        console.error('Failed to fetch gallery items', err);
        return { _id: 'gallery_items', items: [] };
    }
}

async function getUploadSignature(): Promise<UploadSignatureResponse> {
    return httpService.post<UploadSignatureResponse, Record<string, never>>('gallery/upload-signature', {});
}

async function saveGallery(items: GalleryItem[]): Promise<GalleryConfig> {
    const normalized = items.map((item, idx) => ({
        ...item,
        order: idx,
        isVisible: item.isVisible !== false,
    }));
    return httpService.put<GalleryConfig, { items: GalleryItem[] }>('gallery', { items: normalized });
}

/** Inserts Cloudinary responsive resize/format transforms (`w_<px>,c_limit,q_auto,f_auto`) cleanly into stored image URLs. */
function transformCloudinaryUrl(url: string, width: number): string {
    if (!url || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
        return url;
    }
    const marker = '/image/upload/';
    const idx = url.indexOf(marker);
    if (idx === -1) return url;
    const prefix = url.slice(0, idx + marker.length);
    const rest = url.slice(idx + marker.length);
    if (rest.startsWith('w_') || rest.startsWith('c_')) {
        return url;
    }
    return `${prefix}w_${width},c_limit,q_auto,f_auto/${rest}`;
}
