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
    type ProductPrice = NonNullable<FullProduct['price']>[number];
    type DirtyProductPrice = { wood?: Partial<hebrewEnglishObj>; amount?: number; size?: string; sku?: string; };

    // Helper to merge split objects like [{he: 'A'}, {en: 'B'}] into [{he: 'A', en: 'B'}]
    function _healHebrewEnglishArray(arr: (Partial<hebrewEnglishObj> | null)[]): hebrewEnglishObj[] {
        if (!arr) return []
        
        const healed: hebrewEnglishObj[] = []
        let current: Partial<hebrewEnglishObj> = {}

        arr.forEach(item => {
            if (!item) return
            
            // If item has both, just add it
            if (item.he && item.en) {
                healed.push({ he: item.he, en: item.en })
                return
            }

            // If it's a partial object, try to merge it
            if (item.he) {
                if (current.he) { // Already have a pending Hebrew, push it and start new
                    healed.push({ he: current.he, en: current.en || '' })
                    current = { he: item.he }
                } else {
                    current.he = item.he
                }
            } else if (item.en) {
                if (current.en) { // Already have a pending English, push it and start new
                    healed.push({ he: current.he || '', en: current.en })
                    current = { en: item.en }
                } else {
                    current.en = item.en
                }
            }

            // If we now have a complete pair, push it
            if (current.he && current.en) {
                healed.push({ he: current.he, en: current.en })
                current = {}
            }
        })

        // Push any remaining partial
        if (current.he || current.en) {
            healed.push({ he: current.he || '', en: current.en || '' })
        }

        return healed
    }

    // Helper to ensure price entries have both languages if one is missing or inconsistent
    function _healPriceArray(prices: DirtyProductPrice[]): ProductPrice[] {
        if (!prices) return []
        return prices.map(p => {
            const woodNameEn = (p.wood?.en || '').trim()
            const woodNameHe = (p.wood?.he || '').trim()
            
            // Handle "Oak stained Walnut" mapping
            if (
                woodNameEn.toLowerCase() === 'oak stained walnut' || 
                woodNameEn.toLowerCase() === 'oak stained as walnut' ||
                woodNameHe === 'אלון מגוון לאגוז'
            ) {
                return { ...p, amount: p.amount ?? 0, wood: { en: 'Oak stained Walnut', he: 'אלון מגוון לאגוז' } }
            }

            // Try to find a match in constants by either English or Hebrew name
            const found = (PRODUCT_OPTIONS.WOOD_TYPES as unknown as hebrewEnglishObj[]).find(opt => 
                (woodNameEn && opt.en.toLowerCase() === woodNameEn.toLowerCase()) || 
                (woodNameHe && opt.he === woodNameHe)
            ) || (woodNameEn.toLowerCase().includes('american') && woodNameEn.toLowerCase().includes('walnut') ? { en: 'American walnut', he: 'אגוז אמריקאי' } : null)
              || (woodNameEn.toLowerCase() === 'oak' ? { en: 'Oak', he: 'אלון' } : null)

            if (found) {
                return { ...p, amount: p.amount ?? 0, wood: found }
            }
            return { ...p, amount: p.amount ?? 0, wood: { en: woodNameEn, he: woodNameHe } }
        })
    }

    const [formData, setFormData] = useState<Partial<FullProduct>>(() => {
        const initialState = product || {
            name: { en: '', he: '' },
            description: { en: '', he: '' },
            price: [{ wood: { he: '', en: '' }, amount: 0 }],
            isActive: true,
            category: [],
            imgsUrl: [],
            material: [],
            woodType: [],
            size: [{}],
            socketType: { screwType: '', lightType: '' }
        }
        
        return {
            ...initialState,
            category: _healHebrewEnglishArray(initialState.category),
            material: _healHebrewEnglishArray(initialState.material),
            woodType: _healHebrewEnglishArray(initialState.woodType),
            size: (initialState.size && initialState.size.length > 0) ? initialState.size : [{}],
            imgsUrl: initialState.imgsUrl || [],
            socketType: initialState.socketType || { screwType: '', lightType: '' }, // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            price: _healPriceArray((initialState.price && Array.isArray(initialState.price) && initialState.price.length > 0) ? initialState.price : [{ wood: { he: '', en: '' }, amount: 0 }]),
            name: initialState.name || { en: '', he: '' },
            description: initialState.description || { en: '', he: '' }
        }
    })
    const [uploadConfig, setUploadConfig] = useState({
        type: 'C' as 'C' | 'H' | 'S',
        category: 'P' as 'P' | 'C' | 'W' | 'A'
    })
    const [isUploading, setIsUploading] = useState(false)
    const { language } = useLanguage()
    const isEn = language === 'en'

    function handleChange<K extends keyof FullProduct>(field: K, value: FullProduct[K]) {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    function handlePriceChange(index: number, field: 'amount' | 'size' | 'sku', value: number | string) {
        const newPrice = [...(formData.price || [])]
        newPrice[index] = { ...newPrice[index], [field]: value } as ProductPrice
        setFormData(prev => ({ ...prev, price: newPrice as ProductPrice[] }))
    }

    function addPriceVariant(wood: hebrewEnglishObj) {
        setFormData(prev => ({
            ...prev,
            price: [...(prev.price || []), { wood, amount: 0, size: '', sku: '' }]
        }))
    }

    function removePriceVariant(index: number) {
        const currentPrices = [...(formData.price || [])]
        if (currentPrices.length <= 1) {
            alert(isEn ? 'At least one price is required' : 'חובה להזין לפחות מחיר אחד')
            return
        }
        const newPrices = currentPrices.filter((_, i) => i !== index)
        setFormData(prev => ({ ...prev, price: newPrices }))
    }

    function _getAvailablePriceOptions(): hebrewEnglishObj[] {
        const woodSpecs = formData.woodType || []
        const optionsMap = new Map<string, hebrewEnglishObj>()

        woodSpecs.forEach(spec => {
            if (spec.en.toLowerCase() === 'oak/american walnut') {
                optionsMap.set('oak', { en: 'Oak', he: 'אלון' })
                optionsMap.set('american walnut', { en: 'American walnut', he: 'אגוז אמריקאי' })
            } else {
                optionsMap.set(spec.en.toLowerCase(), spec)
            }
        })

        return Array.from(optionsMap.values())
    }

    function toggleWoodPrice(woodOption: hebrewEnglishObj) {
        const currentPrices = [...(formData.price || [])]
        const isCurrentlySelected = currentPrices.some(p => p.wood.en.toLowerCase() === woodOption.en.toLowerCase())
        
        if (isCurrentlySelected) {
            const remainingPrices = currentPrices.filter(p => p.wood.en.toLowerCase() !== woodOption.en.toLowerCase())
            if (remainingPrices.length === 0) {
                alert(isEn ? 'At least one price is required' : 'חובה להזין לפחות מחיר אחד')
                return
            }
            setFormData(prev => ({ ...prev, price: remainingPrices }))
        } else {
            const newPrices = [...currentPrices, { wood: woodOption, amount: 0, size: '', sku: '' }]
            setFormData(prev => ({ ...prev, price: newPrices }))
        }
    }

    function handleLangChange(field: 'name' | 'description', lang: 'en' | 'he', value: string) {
        setFormData(prev => {
            const currentVal = prev[field] || { en: '', he: '' };
            return {
                ...prev,
                [field]: { ...currentVal, [lang]: value }
            }
        })
    }

    function toggleOption(field: 'category' | 'material' | 'woodType', option: hebrewEnglishObj) {
        const currentList = formData[field] || []
        
        const isSelected = currentList.some(item => 
            (item.en && item.en.toLowerCase() === option.en.toLowerCase()) || 
            (item.he && item.he === option.he)
        )
        
        let newList
        let addedOption: hebrewEnglishObj | null = null
        
        if (isSelected) {
            newList = currentList.filter(item => 
                (item.en && item.en.toLowerCase() !== option.en.toLowerCase()) && 
                (item.he && item.he !== option.he)
            )
        } else {
            newList = [...currentList, option]
            addedOption = option
        }

        const newFormData = { ...formData, [field]: newList }
        
        // If woodType changed, sync prices
        if (field === 'woodType') {
            const availableOptions: string[] = []
            newList.forEach(spec => {
                if (spec.en === 'Oak/American walnut') {
                    availableOptions.push('Oak', 'American walnut')
                } else {
                    availableOptions.push(spec.en)
                }
            })

            // 1. Prune prices that are no longer available in ANY selected wood type
            const updatedPrices = (formData.price || []).filter(p => 
                availableOptions.some(opt => opt.toLowerCase() === p.wood.en.toLowerCase())
            )
            
            // 2. If an option was added, automatically add its corresponding price entries
            if (addedOption) {
                const optionsToAdd: hebrewEnglishObj[] = []
                const addedEnLower = addedOption.en.toLowerCase()
                if (addedEnLower === 'oak/american walnut') {
                    optionsToAdd.push({ en: 'Oak', he: 'אלון' })
                    optionsToAdd.push({ en: 'American walnut', he: 'אגוז אמריקאי' })
                } else if (addedEnLower === 'oak stained walnut' || addedEnLower === 'oak stained as walnut') {
                    optionsToAdd.push({ en: 'Oak stained Walnut', he: 'אלון מגוון לאגוז' })
                } else {
                    optionsToAdd.push(addedOption)
                }
                
                optionsToAdd.forEach(opt => {
                    if (!updatedPrices.some(p => p.wood.en.toLowerCase() === opt.en.toLowerCase())) {
                        updatedPrices.push({ wood: opt, amount: 0 })
                    }
                })
            }

            // 3. Safety: If we have wood types but no prices, add the first available
            if (updatedPrices.length === 0 && availableOptions.length > 0) {
                const firstOpt = newList[0].en === 'Oak/American walnut' 
                    ? { en: 'Oak', he: 'אלון' }
                    : newList[0]
                updatedPrices.push({ wood: firstOpt, amount: 0 })
            }
            newFormData.price = updatedPrices
        }
        
        setFormData(newFormData)
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
        const productToSave = {
            ...formData,
            category: _healHebrewEnglishArray(formData.category || []),
            material: _healHebrewEnglishArray(formData.material || []),
            woodType: _healHebrewEnglishArray(formData.woodType || [])
        }
        onSave(productToSave as FullProduct)
    }

    const renderSelectionList = (field: 'category' | 'material' | 'woodType', label: string, options: hebrewEnglishObj[]) => (
        <div className="form-section">
            <h4>{label}</h4>
            <div className="options-grid">
                {options.map(option => {
                    const isSelected = (formData[field] || []).some(item => 
                        (item.en && item.en.toLowerCase() === option.en.toLowerCase()) || 
                        (item.he && item.he === option.he)
                    )
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
            <form onSubmit={handleSubmit} className="admin-form-grid">
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
                    
                    <div className="form-section">
                        <h4>{isEn ? 'Prices by Wood Type' : 'מחירים לפי סוג עץ'}</h4>
                        <div className="wood-price-toggles">
                            {_getAvailablePriceOptions().map(wood => {
                                const isSelected = (formData.price || []).some(p => p.wood.en.toLowerCase() === wood.en.toLowerCase())
                                return (
                                    <label key={wood.en} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', padding: '8px', background: isSelected ? '#f0f7ff' : '#f9f9f9', borderRadius: '4px', border: `1px solid ${isSelected ? '#007bff' : '#ddd'}` }}>
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected} 
                                            onChange={() => toggleWoodPrice(wood)}
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                        {isEn ? wood.en : wood.he}
                                    </label>
                                )
                            })}
                        </div>

                        {_getAvailablePriceOptions().filter(wood => (formData.price || []).some(p => p.wood.en.toLowerCase() === wood.en.toLowerCase())).map(wood => {
                            const woodPrices = (formData.price || []).map((p, originalIdx) => ({...p, originalIdx})).filter(p => p.wood.en.toLowerCase() === wood.en.toLowerCase())
                            
                            return (
                                <div key={wood.en} className="wood-group" style={{ marginBottom: '20px', padding: '15px', background: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px' }}>
                                    <h5 style={{ marginTop: 0, marginBottom: '15px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>{isEn ? wood.en : wood.he}</h5>
                                    {woodPrices.map((p) => (
                                        <div key={p.originalIdx} className="price-row-grid">
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{isEn ? 'SKU / מקט (Optional)' : 'מקט / SKU (אופציונלי)'}</label>
                                                <input 
                                                    type="text" 
                                                    value={p.sku || ''} 
                                                    onChange={(e) => handlePriceChange(p.originalIdx, 'sku', e.target.value)}
                                                    placeholder={isEn ? 'e.g. TL-101' : 'למשל TL-101'}
                                                />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{isEn ? 'Size Label (Optional)' : 'תווית מידה (אופציונלי)'}</label>
                                                <input 
                                                    type="text" 
                                                    value={p.size || ''} 
                                                    onChange={(e) => handlePriceChange(p.originalIdx, 'size', e.target.value)}
                                                    placeholder={isEn ? 'e.g. 12cm' : 'למשל 12 ס"מ'}
                                                />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: 0 }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{isEn ? 'Amount' : 'מחיר'}</label>
                                                <input 
                                                    type="number" 
                                                    value={p.amount || ''} 
                                                    onChange={(e) => handlePriceChange(p.originalIdx, 'amount', +e.target.value)} 
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removePriceVariant(p.originalIdx)} 
                                                style={{ padding: '8px 12px', background: '#fff', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '4px', cursor: 'pointer' }}
                                                title={isEn ? 'Remove Variant' : 'הסר גרסה'}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        onClick={() => addPriceVariant(wood)} 
                                        style={{ background: 'none', border: '1px dashed #ccc', color: '#666', padding: '8px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontSize: '0.85rem' }}
                                    >
                                        + {isEn ? 'Add another size for ' : 'הוסף מידה נוספת ל-'}{isEn ? wood.en : wood.he}
                                    </button>
                                </div>
                            )
                        })}

                        {_getAvailablePriceOptions().length === 0 && (
                            <p style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
                                {isEn ? 'Select wood types in "Wood Types" section first' : 'בחר סוגי עץ במקטע "סוגי עץ" תחילה'}
                            </p>
                        )}
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
                                    <input type="number" step="any" value={s.upTo || ''} onChange={(e) => handleSizeChange(index, 'upTo', +e.target.value)} />
                                </div>
                                <div className="size-row-grid">
                                    <div className="form-group">
                                        <label>{isEn ? 'Diameter' : 'קוטר'}</label>
                                        <input type="number" step="any" value={s.diameter || ''} onChange={(e) => handleSizeChange(index, 'diameter', +e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isEn ? 'Length' : 'אורך'}</label>
                                        <input type="number" step="any" value={s.length || ''} onChange={(e) => handleSizeChange(index, 'length', +e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isEn ? 'Width' : 'רוחב'}</label>
                                        <input type="number" step="any" value={s.width || ''} onChange={(e) => handleSizeChange(index, 'width', +e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isEn ? 'Depth' : 'עומק'}</label>
                                        <input type="number" step="any" value={s.depth || ''} onChange={(e) => handleSizeChange(index, 'depth', +e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>{isEn ? 'Height' : 'גובה'}</label>
                                        <input type="number" step="any" value={s.height || ''} onChange={(e) => handleSizeChange(index, 'height', +e.target.value)} />
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
                                const isDirectUpload = url.startsWith('C_') || url.startsWith('H_') || url.startsWith('S_')
                                return (
                                    <div key={url} className="img-preview-item" style={{ position: 'relative' }}>
                                        <img 
                                            src={isDirectUpload 
                                                ? `https://res.cloudinary.com/dhixlriwm/image/upload/${url}.webp`
                                                : `https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${url}.webp`
                                            } 
                                            alt="preview" 
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        {url.startsWith('S_') && (
                                            <span style={{ 
                                                position: 'absolute', 
                                                bottom: '2px', 
                                                left: '2px', 
                                                background: 'rgba(0,0,0,0.7)', 
                                                color: 'white', 
                                                fontSize: '9px', 
                                                padding: '1px 3px', 
                                                borderRadius: '2px',
                                                pointerEvents: 'none'
                                            }}>
                                                {isEn ? 'Scratch' : 'שרטוט'}
                                            </span>
                                        )}
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

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>{isEn ? 'Cancel' : 'ביטול'}</button>
                    <button type="submit" className="btn-save">{isEn ? 'Save' : 'שמור'}</button>
                </div>
            </form>
        </section>
    )
}
