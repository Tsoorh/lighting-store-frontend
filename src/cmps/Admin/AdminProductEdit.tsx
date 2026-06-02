import React, { useState } from 'react'
import type { FullProduct } from '../../model/product.model'
import { useLanguage } from '../../hooks/useLanguage'
import { uploadService } from '../../services/upload.service'

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
        size: [{ radius: 0, height: 0 }],
        socketType: { screwType: '', lightType: '' }
    })
    const [uploadConfig, setUploadConfig] = useState({
        type: 'C' as 'C' | 'H',
        category: 'P' as 'P' | 'C' | 'W' | 'A'
    })
    const [isUploading, setIsUploading] = useState(false)
    const { language } = useLanguage()
    const isEn = language === 'en'

    function handleChange(field: string, value: any) {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    function handleLangChange(field: 'name' | 'description', lang: 'en' | 'he', value: string) {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [lang]: value }
        }))
    }

    // Dynamic list handlers (Category, Material, WoodType)
    function handleListChange(field: 'category' | 'material' | 'woodType', index: number, lang: 'en' | 'he', value: string) {
        const newList = [...(formData[field] || [])]
        newList[index] = { ...newList[index], [lang]: value }
        setFormData(prev => ({ ...prev, [field]: newList }))
    }

    function addListItem(field: 'category' | 'material' | 'woodType') {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), { en: '', he: '' }]
        }))
    }

    function removeListItem(field: 'category' | 'material' | 'woodType', index: number) {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field]?.filter((_, i) => i !== index)
        }))
    }

    // Size handler
    function handleSizeChange(index: number, field: 'radius' | 'height', value: number) {
        const newSize = [...(formData.size || [])]
        newSize[index] = { ...newSize[index], [field]: value }
        setFormData(prev => ({ ...prev, size: newSize }))
    }

    function addSize() {
        setFormData(prev => ({
            ...prev,
            size: [...(prev.size || []), { radius: 0, height: 0 }]
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
            
            setFormData(prev => ({
                ...prev,
                imgsUrl: [...(prev.imgsUrl || []), newImgUrl]
            }))
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

    const renderMultiLangList = (field: 'category' | 'material' | 'woodType', label: string) => (
        <div className="form-section">
            <h4>{label}</h4>
            {formData[field]?.map((item, index) => (
                <div key={index} className="list-item-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        placeholder="EN"
                        value={item.en} 
                        style={{ flex: 1 }}
                        onChange={(e) => handleListChange(field, index, 'en', e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="עברית"
                        value={item.he} 
                        style={{ flex: 1 }}
                        onChange={(e) => handleListChange(field, index, 'he', e.target.value)} 
                    />
                    <button type="button" onClick={() => removeListItem(field, index)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>X</button>
                </div>
            ))}
            <button type="button" onClick={() => addListItem(field)} className="btn-add-secondary" style={{ marginBottom: '15px' }}>+ Add {label}</button>
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
                                <label>Screw (e.g. E27)</label>
                                <input 
                                    type="text" 
                                    value={formData.socketType?.screwType || ''} 
                                    onChange={(e) => handleSocketChange('screwType', e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Light (e.g. LED)</label>
                                <input 
                                    type="text" 
                                    value={formData.socketType?.lightType || ''} 
                                    onChange={(e) => handleSocketChange('lightType', e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>{isEn ? 'Sizes' : 'מידות'}</h4>
                        {formData.size?.map((s, index) => (
                            <div key={index} className="size-row-container" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div className="form-group">
                                    <label>Radius</label>
                                    <input type="number" value={s.radius} onChange={(e) => handleSizeChange(index, 'radius', +e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Height</label>
                                    <input type="number" value={s.height} onChange={(e) => handleSizeChange(index, 'height', +e.target.value)} />
                                </div>
                                <button type="button" onClick={() => removeSize(index)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 15px', width: '100%' }}>{isEn ? 'Remove Size' : 'הסר מידה'}</button>
                            </div>
                        ))}
                        <button type="button" onClick={addSize} className="btn-add-secondary">+ Add Size</button>
                    </div>
                </div>

                <div className="secondary-info">
                    {renderMultiLangList('category', isEn ? 'Categories' : 'קטגוריות')}
                    {renderMultiLangList('material', isEn ? 'Materials' : 'חומרים')}
                    {renderMultiLangList('woodType', isEn ? 'Wood Types' : 'סוגי עץ')}

                    <div className="image-upload-section" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                        <h4>{isEn ? 'Product Images' : 'תמונות מוצר'}</h4>
                        
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>{isEn ? 'Type' : 'סוג'}</label>
                                <select 
                                    value={uploadConfig.type} 
                                    onChange={(e) => setUploadConfig(prev => ({ ...prev, type: e.target.value as any }))}
                                >
                                    <option value="C">{isEn ? 'Card' : 'כרטיס (C)'}</option>
                                    <option value="H">{isEn ? 'Hero' : 'ראשי (H)'}</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>{isEn ? 'Category' : 'קטגוריה'}</label>
                                <select 
                                    value={uploadConfig.category} 
                                    onChange={(e) => setUploadConfig(prev => ({ ...prev, category: e.target.value as any }))}
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
                            {formData.imgsUrl?.map(url => (
                                <div key={url} className="img-preview-item" style={{ position: 'relative' }}>
                                    <img 
                                        src={url.startsWith('C_') || url.startsWith('H_') 
                                            ? `https://res.cloudinary.com/dhixlriwm/image/upload/${url}.webp`
                                            : `https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${url}.webp`
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
                            ))}
                        </div>
                    </div>

                    <div className="form-group checkbox">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={formData.isActive !== false} 
                                onChange={(e) => handleChange('isActive', e.target.checked)} 
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
