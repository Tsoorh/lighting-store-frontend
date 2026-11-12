import React, { useState, useLayoutEffect } from 'react'
import type { FullProduct, hebrewEnglishObj, ProductSize } from '../../model/product.model'
import { PRODUCT_OPTIONS } from '../../constants/product.constants'
import { useLanguage } from '../../hooks/useLanguage'
import {
    healHebrewEnglishArray,
    healPriceArray,
    matchesWood,
    type DirtyProductPrice,
    type ProductPrice
} from '../../utils/product-healer'
import { ProductPriceEditor } from './ProductPriceEditor'
import { SocketOptionsEditor } from './SocketOptionsEditor'
import { ProductImageUploader } from './ProductImageUploader'

type Props = {
    product?: FullProduct
    onSave: (product: FullProduct) => void
    onCancel: () => void
}

const DEFAULT_STANDARD_WOOD: hebrewEnglishObj = {
    en: 'Standard / No wood',
    he: 'מחיר כללי / ללא עץ'
}

export const AdminProductEdit: React.FC<Props> = ({ product, onSave, onCancel }) => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const [formData, setFormData] = useState<Partial<FullProduct>>(() => {
        const initialState = product || {
            name: { en: '', he: '' },
            description: { en: '', he: '' },
            price: [{ wood: DEFAULT_STANDARD_WOOD, amount: 0 }],
            isActive: true,
            isNew: false,
            category: [],
            imgsUrl: [],
            material: [],
            woodType: [],
            size: [{}],
            socketType: { screwType: '', lightType: '' }
        }

        const rawPrices = (
            initialState.price && Array.isArray(initialState.price) && initialState.price.length > 0
                ? initialState.price
                : [{ wood: DEFAULT_STANDARD_WOOD, amount: 0 }]
        ) as DirtyProductPrice[]

        return {
            ...initialState,
            isActive: initialState.isActive !== false,
            isNew: !!initialState.isNew,
            category: healHebrewEnglishArray(initialState.category),
            material: healHebrewEnglishArray(initialState.material),
            woodType: healHebrewEnglishArray(initialState.woodType),
            size: (initialState.size && initialState.size.length > 0) ? initialState.size : [{}],
            imgsUrl: initialState.imgsUrl || [],
            socketType: initialState.socketType || { screwType: '', lightType: '' },
            price: healPriceArray(rawPrices),
            name: initialState.name || { en: '', he: '' },
            description: initialState.description || { en: '', he: '' }
        }
    })

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }, [])

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
        setFormData(prev => ({ ...prev, price: currentPrices.filter((_, i) => i !== index) }))
    }

    function getAvailablePriceOptions(): hebrewEnglishObj[] {
        const woodSpecs = formData.woodType || []
        const optionsMap = new Map<string, hebrewEnglishObj>()

        woodSpecs.forEach(spec => {
            const enLower = (spec.en || '').toLowerCase()
            if (enLower === 'oak/american walnut' || spec.he === 'אלון/אגוז אמריקאי') {
                optionsMap.set('oak', { en: 'Oak', he: 'אלון' })
                optionsMap.set('american walnut', { en: 'American walnut', he: 'אגוז אמריקאי' })
            } else if (spec.en || spec.he) {
                optionsMap.set((spec.en || spec.he).toLowerCase(), spec)
            }
        })

        // Also ensure any wood already existing in formData.price is present so it is never hidden
        const existingPrices = (formData.price || []) as ProductPrice[]
        existingPrices.forEach(p => {
            if (!p.wood) return
            const en = (p.wood.en || '').trim()
            const he = (p.wood.he || '').trim()
            const enLower = en.toLowerCase()
            if (enLower === 'oak/american walnut' || he === 'אלון/אגוז אמריקאי') {
                optionsMap.set('oak', { en: 'Oak', he: 'אלון' })
                optionsMap.set('american walnut', { en: 'American walnut', he: 'אגוז אמריקאי' })
            } else if (en || he) {
                const key = (en || he).toLowerCase()
                if (!optionsMap.has(key)) {
                    optionsMap.set(key, { en: en || he, he: he || en })
                }
            }
        })

        if (optionsMap.size === 0) {
            optionsMap.set('standard', DEFAULT_STANDARD_WOOD)
        }

        return Array.from(optionsMap.values())
    }

    function toggleWoodPrice(woodOption: hebrewEnglishObj) {
        const currentPrices = [...(formData.price || [])]
        const isCurrentlySelected = currentPrices.some(p => matchesWood(p.wood, woodOption))

        if (isCurrentlySelected) {
            const remainingPrices = currentPrices.filter(p => !matchesWood(p.wood, woodOption))
            if (remainingPrices.length === 0) {
                alert(isEn ? 'At least one price is required' : 'חובה להזין לפחות מחיר אחד')
                return
            }
            setFormData(prev => ({ ...prev, price: remainingPrices }))
        } else {
            setFormData(prev => ({
                ...prev,
                price: [...currentPrices, { wood: woodOption, amount: 0, size: '', sku: '' }]
            }))
        }
    }

    function handleLangChange(field: 'name' | 'description', lang: 'en' | 'he', value: string) {
        setFormData(prev => {
            const currentVal = prev[field] || { en: '', he: '' }
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

        const newList = isSelected
            ? currentList.filter(item =>
                (item.en && item.en.toLowerCase() !== option.en.toLowerCase()) &&
                (item.he && item.he !== option.he)
            )
            : [...currentList, option]

        const addedOption = isSelected ? null : option
        const newFormData: Partial<FullProduct> = { ...formData, [field]: newList }

        if (field === 'woodType') {
            const availableOptions: string[] = []
            newList.forEach(spec => {
                const enLower = (spec.en || '').toLowerCase()
                if (enLower === 'oak/american walnut' || spec.he === 'אלון/אגוז אמריקאי') {
                    availableOptions.push('Oak', 'American walnut')
                } else {
                    availableOptions.push(spec.en)
                }
            })

            const updatedPrices = (formData.price || []).filter(p =>
                availableOptions.length === 0 ||
                availableOptions.some(opt => opt.toLowerCase() === (p.wood?.en || '').toLowerCase())
            )

            if (addedOption) {
                const optionsToAdd: hebrewEnglishObj[] = []
                const addedEnLower = (addedOption.en || '').toLowerCase()
                if (addedEnLower === 'oak/american walnut' || addedOption.he === 'אלון/אגוז אמריקאי') {
                    optionsToAdd.push({ en: 'Oak', he: 'אלון' }, { en: 'American walnut', he: 'אגוז אמריקאי' })
                } else if (
                    addedEnLower === 'oak stained walnut' ||
                    addedEnLower === 'oak stained as walnut' ||
                    addedOption.he === 'אלון מגוון לאגוז'
                ) {
                    optionsToAdd.push({ en: 'Oak stained Walnut', he: 'אלון מגוון לאגוז' })
                } else {
                    optionsToAdd.push(addedOption)
                }

                optionsToAdd.forEach(opt => {
                    if (!updatedPrices.some(p => matchesWood(p.wood, opt))) {
                        updatedPrices.push({ wood: opt, amount: 0 })
                    }
                })
            }

            if (updatedPrices.length === 0 && availableOptions.length > 0) {
                const firstOpt = (newList[0].en?.toLowerCase() === 'oak/american walnut' || newList[0].he === 'אלון/אגוז אמריקאי')
                    ? { en: 'Oak', he: 'אלון' }
                    : newList[0]
                updatedPrices.push({ wood: firstOpt, amount: 0 })
            } else if (updatedPrices.length === 0) {
                updatedPrices.push({ wood: DEFAULT_STANDARD_WOOD, amount: 0 })
            }
            newFormData.price = updatedPrices
        }

        setFormData(newFormData)
    }

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

    function handleSocketChange(field: 'screwType' | 'lightType', value: string) {
        setFormData(prev => ({
            ...prev,
            socketType: { ...(prev.socketType || { screwType: '', lightType: '' }), [field]: value }
        }))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const productToSave = {
            ...formData,
            category: healHebrewEnglishArray(formData.category || []),
            material: healHebrewEnglishArray(formData.material || []),
            woodType: healHebrewEnglishArray(formData.woodType || [])
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

                    <ProductPriceEditor
                        prices={(formData.price || []) as ProductPrice[]}
                        availableWoodOptions={getAvailablePriceOptions()}
                        isEn={isEn}
                        onToggleWoodPrice={toggleWoodPrice}
                        onPriceChange={handlePriceChange}
                        onAddVariant={addPriceVariant}
                        onRemoveVariant={removePriceVariant}
                    />

                    <SocketOptionsEditor
                        screwType={formData.socketType?.screwType || ''}
                        lightType={formData.socketType?.lightType || ''}
                        isEn={isEn}
                        onSocketChange={handleSocketChange}
                    />

                    <div className="form-section">
                        <h4>{isEn ? 'Sizes' : 'מידות'}</h4>
                        {formData.size?.map((s, index) => (
                            <div key={index} className="size-row-container" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div className="form-group">
                                    <label>{isEn ? 'Up to' : 'עד ל-'}</label>
                                    <input type="number" step="any" value={s.upTo || ''} onChange={(e) => handleSizeChange(index, 'upTo', +e.target.value)} />
                                </div>
                                <div className="size-row-grid">
                                    {(['diameter', 'length', 'width', 'depth', 'height'] as const).map(dim => (
                                        <div key={dim} className="form-group">
                                            <label>
                                                {isEn
                                                    ? dim.charAt(0).toUpperCase() + dim.slice(1)
                                                    : { diameter: 'קוטר', length: 'אורך', width: 'רוחב', depth: 'עומק', height: 'גובה' }[dim]}
                                            </label>
                                            <input type="number" step="any" value={s[dim] || ''} onChange={(e) => handleSizeChange(index, dim, +e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSize(index)}
                                    style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 15px', width: '100%', marginTop: '10px' }}
                                >
                                    {isEn ? 'Remove Size' : 'הסר מידה'}
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addSize} className="btn-add-secondary">+ Add Size</button>
                    </div>
                </div>

                <div className="secondary-info">
                    {renderSelectionList('category', isEn ? 'Categories' : 'קטגוריות', PRODUCT_OPTIONS.CATEGORIES as unknown as hebrewEnglishObj[])}
                    {renderSelectionList('material', isEn ? 'Materials' : 'חומרים', PRODUCT_OPTIONS.MATERIALS as unknown as hebrewEnglishObj[])}
                    {renderSelectionList('woodType', isEn ? 'Wood Types' : 'סוגי עץ', PRODUCT_OPTIONS.WOOD_TYPES as unknown as hebrewEnglishObj[])}

                    <ProductImageUploader
                        imgsUrl={formData.imgsUrl || []}
                        isEn={isEn}
                        onAddImage={(publicId) => setFormData(prev => ({ ...prev, imgsUrl: [...(prev.imgsUrl || []), publicId] }))}
                        onRemoveImage={(url) => setFormData(prev => ({ ...prev, imgsUrl: prev.imgsUrl?.filter(item => item !== url) }))}
                    />

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', margin: '15px 0', flexWrap: 'wrap' }}>
                        <div className="form-group checkbox" style={{ margin: 0 }}>
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
                        <div className="form-group checkbox" style={{ margin: 0 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={!!formData.isNew}
                                    onChange={(e) => handleChange('isNew', e.target.checked)}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                {isEn ? 'New Product (חדש / New)' : 'מוצר חדש (חדש / New)'}
                            </label>
                        </div>
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
