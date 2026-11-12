export const CLOUDINARY_CLOUD_ID = 'dhixlriwm'

export interface ProductGalleryItem {
    mainUrl: string
    thumbUrl: string
}

export function cleanImageName(raw: string): string {
    return raw.replace(/[\r\n\s]+/g, '').replace(/\.[^/.]+$/, '').replace(/^4G8A/i, '')
}

export function getCloudinaryPublicId(imgName: string): string {
    const cleanId = cleanImageName(imgName)
    const upper = cleanId.toUpperCase()
    if (upper.startsWith('C_') || upper.startsWith('H_') || upper.startsWith('S_')) {
        return cleanId
    }
    return `4G8A${cleanId}`
}

export function buildCloudinaryImageUrl(
    imgName: string,
    transform = '',
    extension = 'webp'
): string {
    const trimmed = imgName.trim()
    const publicId = trimmed === 'coming-soon' ? 'coming-soon' : getCloudinaryPublicId(trimmed)
    const transformSegment = transform ? `${transform}/` : ''
    const extSegment = extension ? `.${extension.replace(/^\./, '')}` : ''
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_ID}/image/upload/${transformSegment}${publicId}${extSegment}`
}

export function pickPrimaryProductImage(imgsUrl: string[] = []): string | null {
    const rawImgs = Array.isArray(imgsUrl) ? imgsUrl : []
    const filteredUrls = rawImgs.map(cleanImageName).filter(url => url && url !== 'coming-soon')
    if (filteredUrls.length === 0) return null

    const cPhoto = filteredUrls.find(url => url.toUpperCase().startsWith('C_'))
    const hPhoto = filteredUrls.find(url => url.toUpperCase().startsWith('H_'))
    const numPhoto = filteredUrls.find(url => {
        const upper = url.toUpperCase()
        return !upper.startsWith('C_') && !upper.startsWith('H_') && !upper.startsWith('S_')
    })
    const sPhoto = filteredUrls.find(url => url.toUpperCase().startsWith('S_'))

    return cPhoto || hPhoto || numPhoto || sPhoto || null
}

export function buildProductGallery(imgsUrl: string[] = []): ProductGalleryItem[] {
    if (!Array.isArray(imgsUrl) || imgsUrl.length === 0) return []

    const filteredUrls = imgsUrl.map(cleanImageName).filter(url => url && url !== 'coming-soon')
    const hPhotos = filteredUrls.filter(url => url.toUpperCase().startsWith('H_'))
    const sPhotos = filteredUrls.filter(url => url.toUpperCase().startsWith('S_'))
    const otherPhotos = filteredUrls.filter(url => {
        const upper = url.toUpperCase()
        return !upper.startsWith('C_') && !upper.startsWith('H_') && !upper.startsWith('S_')
    })
    const cPhotos = filteredUrls.filter(url => url.toUpperCase().startsWith('C_'))

    let nonScratchPhotos = [...hPhotos, ...otherPhotos]
    if (nonScratchPhotos.length === 0 && cPhotos.length > 0) {
        nonScratchPhotos = cPhotos
    }

    let combinedPhotos: string[]
    if (sPhotos.length > 0) {
        const maxNonScratch = Math.max(0, 5 - sPhotos.length)
        combinedPhotos = [...nonScratchPhotos.slice(0, maxNonScratch), ...sPhotos]
    } else {
        combinedPhotos = nonScratchPhotos.slice(0, 5)
    }

    return combinedPhotos.map(imgName => {
        const mainUrl = buildCloudinaryImageUrl(imgName)
        const isSketch = getCloudinaryPublicId(imgName).toUpperCase().startsWith('S_')
        return {
            mainUrl,
            thumbUrl: isSketch
                ? buildCloudinaryImageUrl(imgName, 'w_250,c_limit,q_100,f_png')
                : mainUrl
        }
    })
}
