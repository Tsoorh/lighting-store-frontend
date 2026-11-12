import React, { useState } from 'react'
import { uploadService } from '../../services/upload.service'
import { buildCloudinaryImageUrl } from '../../utils/cloudinary'

interface ProductImageUploaderProps {
    imgsUrl: string[]
    isEn: boolean
    onAddImage: (publicId: string) => void
    onRemoveImage: (imgUrl: string) => void
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
    imgsUrl,
    isEn,
    onAddImage,
    onRemoveImage
}) => {
    const [uploadConfig, setUploadConfig] = useState({
        type: 'C' as 'C' | 'H' | 'S',
        category: 'P' as 'P' | 'C' | 'W'
    })
    const [isUploading, setIsUploading] = useState(false)

    async function onUploadImg(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const timestamp = Date.now()
            const randomSalt = Math.random().toString(36).substring(2, 8).toUpperCase()
            const publicId = `${uploadConfig.type}_${uploadConfig.category}_${timestamp}_${randomSalt}`

            const res = await uploadService.uploadImg(file, publicId)
            const newImgUrl = res.public_id

            if (newImgUrl) {
                onAddImage(newImgUrl)
            } else {
                throw new Error('No public_id returned from Cloudinary')
            }
        } catch (err) {
            console.error('Failed to upload image', err)
            alert(isEn ? 'Upload failed' : 'העלאה נכשלה')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="image-upload-section" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
            <h4>{isEn ? 'Product Images' : 'תמונות מוצר'}</h4>

            <div className="image-upload-flex">
                <div className="form-group" style={{ flex: 1 }}>
                    <label>{isEn ? 'Type' : 'סוג'}</label>
                    <select
                        value={uploadConfig.type}
                        onChange={(e) => setUploadConfig(prev => ({ ...prev, type: e.target.value as 'C' | 'H' | 'S' }))}
                    >
                        <option value="C">{isEn ? 'Card' : 'כרטיס (C)'}</option>
                        <option value="H">{isEn ? 'Hero' : 'ראשי (H)'}</option>
                        <option value="S">{isEn ? 'Scratch' : 'שרטוט (S)'}</option>
                    </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>{isEn ? 'Category' : 'קטגוריה'}</label>
                    <select
                        value={uploadConfig.category}
                        onChange={(e) => setUploadConfig(prev => ({ ...prev, category: e.target.value as 'P' | 'C' | 'W' }))}
                    >
                        <option value="P">{isEn ? 'Pendant' : 'תלייה (P)'}</option>
                        <option value="C">{isEn ? 'Ceiling' : 'צמוד תקרה (C)'}</option>
                        <option value="W">{isEn ? 'Wall' : 'קיר (W)'}</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>{isEn ? 'Upload New Image' : 'העלה תמונה חדשה'}</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={onUploadImg}
                    disabled={isUploading}
                />
                {isUploading && <span style={{ fontSize: '12px', color: '#666' }}>{isEn ? 'Uploading...' : 'מעלה...'}</span>}
            </div>

            <div className="images-preview" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                {imgsUrl.map(url => {
                    if (!url) return null
                    return (
                        <div key={url} className="img-preview-item" style={{ position: 'relative' }}>
                            <img
                                src={buildCloudinaryImageUrl(url)}
                                alt="preview"
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            {url.startsWith('S_') && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        bottom: '2px',
                                        left: '2px',
                                        background: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        fontSize: '9px',
                                        padding: '1px 3px',
                                        borderRadius: '2px',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    {isEn ? 'Scratch' : 'שרטוט'}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => onRemoveImage(url)}
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                X
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
