import React, { useState } from 'react'
import type { FullProduct, hebrewEnglishObj, ProductSize } from '../../model/product.model'
import { useLanguage } from '../../hooks/useLanguage'
import { uploadService } from '../../services/upload.service'
import { PRODUCT_OPTIONS } from '../../constants/product.constants'

type Props = {
    product?: FullProduct
    onSave: (product: FullProduct) => void
    onCancel: () => void
}

export const AdminProductEdit: React.FC<Props> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<FullProduct>>(product || {
        name: { en: '', he: '' },
        description: { en: '', he: '' },
        price: 0,
        isActive: true,
        category: [],
        imgsUrl: [],
        material: [],
        woodType: [],
        size: [{}],
        socketType: { screwType: '', lightType: '' }
    })
    const [uploadConfig, setUploadConfig] = useState({
        type: 'C' as 'C' | 'H',
        category: 'P' as 'P' | 'C' | 'W' | 'A'
    })
    const [isUploading, setIsUploading] = useState(false)
    const { language } = useLanguage()
    const isEn = language === 'en'

    function handleChange<K extends keyof FullProduct>(field: K, value: FullProduct[K]) {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    function handleLangChange(field: 'name' | 'description', lang: 'en' | 'he', value: string) {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [lang]: value }
        }))
    }

    function toggleOption(field: 'category' | 'material' | 'woodType', option: hebrewEnglishObj) {
        const currentList = formData[field] || []
        const isSelected = currentList.some(item => item.en === option.en)
        
        let newList
        if (isSelected) {
            newList = currentList.filter(item => item.en !== option.en)
        } else {
            newList = [...currentList, option]
        }
        
        setFormData(prev => ({ ...prev, [field]: newList }))
    }

    // Size handler
    function handleSizeChange(index: number, field: keyof ProductSize, value: number | boolean) {
        const newSize = [...(formData.size || [])]
        newSize[index] = { ...newSize[index], [field]: value }
        setFormData(prev => ({ ...prev, size: newSize }))
    }

    function addSize() {
        setFormData(prev => ({
            ...prev,
            size: [...(prev.size || []), {}]
        }))
    }

    function removeSize(index: number) {
        setFormData(prev => ({
            ...prev,
            size: prev.size?.filter((_, i) => i !== index)
        }))
    }

    // SocketType handler
    function handleSocketChange(field: 'screwType' | 'lightType', value: string) {
        setFormData(prev => ({
            ...prev,
            socketType: { ...(prev.socketType || { screwType: '', lightType: '' }), [field]: value }
        }))
    }

    async function onUploadImg(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const randomNum = Math.floor(Math.random() * 9000) + 1000
            const publicId = `${uploadConfig.type}_${uploadConfig.category}${randomNum}`
            
            const res = await uploadService.uploadImg(file, publicId)
            const newImgUrl = res.public_id
            
            if (newImgUrl) {
                setFormData(prev => ({
                    ...prev,
                    imgsUrl: [...(prev.imgsUrl || []), newImgUrl]
                }))
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

    function onRemoveImg(imgUrl: string) {
        setFormData(prev => ({
            ...prev,
            imgsUrl: prev.imgsUrl?.filter(url => url !== imgUrl)
        }))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        onSave(formData as FullProduct)
    }

    const renderSelectionList = (field: 'category' | 'material' | 'woodType', label: string, options: hebrewEnglishObj[]) => (
        <div className="form-section">
            <h4>{label}</h4>
            <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {options.map(option => {
                    const isSelected = (formData[field] || []).some(item => item.en === option.en)
                    return (
                        <label key={option.en} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => toggleOption(field, option)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            {isEn ? option.en : option.he}
                        </label>
                    )
                })}
            </div>
        </div>
    )

    return (
        <section className="admin-edit-form">
            <h3>{product ? (isEn ? 'Edit Product' : 'ערוך מוצר') : (isEn ? 'Add Product' : 'הוסף מוצר')}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div className="main-info">
                    <div className="form-group">
                        <label>{isEn ? 'Name (EN)' : 'שם (אנגלית)'}</label>
                        <input 
                            type="text" 
                            value={formData.name?.en || ''} 
                            onChange={(e) => handleLangChange('name', 'en', e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>{isEn ? 'Name (HE)' : 'שם (עברית)'}</label>
                        <input 
                            type="text" 
                            value={formData.name?.he || ''} 
                            onChange={(e) => handleLangChange('name', 'he', e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>{isEn ? 'Description (EN)' : 'תיאור (אנגלית)'}</label>
                        <textarea 
                            value={formData.description?.en || ''} 
                            onChange={(e) => handleLangChange('description', 'en', e.target.value)} 
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label>{isEn ? 'Description (HE)' : 'תיאור (עברית)'}</label>
                        <textarea 
                            value={formData.description?.he || ''} 
                            onChange={(e) => handleLangChange('description', 'he', e.target.value)} 
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label>{isEn ? 'Price' : 'מחיר'}</label>
                        <input 
                            type="number" 
                            value={formData.price || ''} 
                            onChange={(e) => handleChange('price', +e.target.value)} 
                        />
                    </div>

                    <div className="form-section">
                        <h4>{isEn ? 'Socket Type' : 'סוג הברגה/נורה'}</h4>
                        <div className="stacked-fields">
                            <div className="form-group">
                                <label>{isEn ? 'Screw Type' : 'סוג הברגה'}</label>
                                <select 
                                    value={formData.socketType?.screwType || ''} 
                                    onChange={(e) => handleSocketChange('screwType', e.target.value)}
                                >
                                    <option value="">{isEn ? '-- Select --' : '-- בחר --'}</option>
                                    {PRODUCT_OPTIONS.SCREW_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{isEn ? 'Light Type' : 'סוג נורה'}</label>
                                <select 
                                    value={formData.socketType?.lightType || ''} 
                                    onChange={(e) => handleSocketChange('lightType', e.target.value)}
                                >
                                    <option value="">{isEn ? '-- Select --' : '-- בחר --'}</option>
                                    {PRODUCT_OPTIONS.LIGHT_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>{isEn ? 'Sizes' : 'מידות'}</h4>
                        {formData.size?.map((s, index) => (
                            <div key={index} className="size-row-container" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div className="form-group">
                                    <label>{isEn ? 'Up to' : 'עד ל-'}</label>
                                    <input type="number" value={s.upTo || ''} onChange={(e) => handleSizeChange(index, 'upTo', +e.target.value)} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div className="form-group">
                                        <label>{isEn ? 'Diameter' : 'קוטר'}</label>
                                        <input type="number" value={s.diameter || ''} onChange={(e) => handleSizeChange(index, 'diameter', +e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isEn ? 'Length' : 'אורך'}</label>
                                        <input type="number" value={s.length || ''} onChange={(e) => handleSizeChange(index, 'length', +e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isEn ? 'Width' : 'רוחב'}</label>
                                        <input type="number" value={s.width || ''} onChange={(e) => handleSizeChange(index, 'width', +e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isEn ? 'Height' : 'גובה'}</label>
                                        <input type="number" value={s.height || ''} onChange={(e) => handleSizeChange(index, 'height', +e.target.value)} />
                                    </div>
                                </div>
                                <button type="button" onClick={() => removeSize(index)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 15px', width: '100%', marginTop: '10px' }}>{isEn ? 'Remove Size' : 'הסר מידה'}</button>
                            </div>
                        ))}
                        <button type="button" onClick={addSize} className="btn-add-secondary">+ Add Size</button>
                    </div>
                </div>

                <div className="secondary-info">
                    {renderSelectionList('category', isEn ? 'Categories' : 'קטגוריות', PRODUCT_OPTIONS.CATEGORIES as unknown as hebrewEnglishObj[])}
                    {renderSelectionList('material', isEn ? 'Materials' : 'חומרים', PRODUCT_OPTIONS.MATERIALS as unknown as hebrewEnglishObj[])}
                    {renderSelectionList('woodType', isEn ? 'Wood Types' : 'סוגי עץ', PRODUCT_OPTIONS.WOOD_TYPES as unknown as hebrewEnglishObj[])}

                    <div className="image-upload-section" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                        <h4>{isEn ? 'Product Images' : 'תמונות מוצר'}</h4>
                        
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>{isEn ? 'Type' : 'סוג'}</label>
                                <select 
                                    value={uploadConfig.type} 
                                    onChange={(e) => setUploadConfig(prev => ({ ...prev, type: e.target.value as 'C' | 'H' }))}
                                >
                                    <option value="C">{isEn ? 'Card' : 'כרטיס (C)'}</option>
                                    <option value="H">{isEn ? 'Hero' : 'ראשי (H)'}</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>{isEn ? 'Category' : 'קטגוריה'}</label>
                                <select 
                                    value={uploadConfig.category} 
                                    onChange={(e) => setUploadConfig(prev => ({ ...prev, category: e.target.value as 'P' | 'C' | 'W' | 'A' }))}
                                >
                                    <option value="P">{isEn ? 'Pendant' : 'תלייה (P)'}</option>
                                    <option value="C">{isEn ? 'Ceiling' : 'צמוד תקרה (C)'}</option>
                                    <option value="W">{isEn ? 'Wall' : 'קיר (W)'}</option>
                                    <option value="A">{isEn ? 'Accessories' : 'אביזרים (A)'}</option>
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
                            {formData.imgsUrl?.map(url => {
                                if (!url) return null
                                return (
                                    <div key={url} className="img-preview-item" style={{ position: 'relative' }}>
                                        <img 
                                            src={url.startsWith('C_') || url.startsWith('H_') 
                                                ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_ID}/image/upload/${url}.webp`
                                                : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_ID}/image/upload/4G8A${url}.webp`
                                            } 
                                            alt="preview" 
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => onRemoveImg(url)}
                                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            X
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="form-group checkbox">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={formData.isActive !== false} 
                                onChange={(e) => handleChange('isActive', e.target.checked)} 
                                style={{ width: '18px', height: '18px' }}
                            />
                            {isEn ? 'Active' : 'פעיל'}
                        </label>
                    </div>
                </div>

                <div className="form-actions" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button type="button" className="btn-cancel" onClick={onCancel}>{isEn ? 'Cancel' : 'ביטול'}</button>
                    <button type="submit" className="btn-save">{isEn ? 'Save' : 'שמור'}</button>
                </div>
            </form>
        </section>
    )
}
