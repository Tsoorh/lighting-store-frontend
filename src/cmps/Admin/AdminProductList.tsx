import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
import { productService } from '../../services/product.service'
import { optionsService } from '../../services/options.service'
import type { FullProduct } from '../../model/product.model'
import { useLanguage } from '../../hooks/useLanguage'
import { AdminProductEdit } from './AdminProductEdit'

interface AdminProductListProps {
    initialProductId?: string | null
}

interface TargetScrollInfo {
    productId?: string
    scrollY: number
    offsetFromTop?: number
    isNew?: boolean
}

export const AdminProductList: React.FC<AdminProductListProps> = ({ initialProductId }) => {
    const [products, setProducts] = useState<FullProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState<FullProduct | null | 'new'>(null)
    const [filterBy, setFilterBy] = useState({ txt: '' })
    const [isNewCollectionActive, setIsNewCollectionActive] = useState<boolean>(true)
    const [isUpdatingOptions, setIsUpdatingOptions] = useState<boolean>(false)
    const targetScrollInfoRef = useRef<TargetScrollInfo | null>(null)
    const { language } = useLanguage()
    const isEn = language === 'en'

    useEffect(() => {
        async function loadOptions() {
            try {
                const opt = await optionsService.getSiteOptions()
                setIsNewCollectionActive(opt.isNewCollectionActive !== false)
            } catch (err) {
                console.error('Failed to load site options', err)
            }
        }
        loadOptions()

        const onSiteOptionsChanged = (e: Event) => {
            const customEvent = e as CustomEvent<{ isNewCollectionActive?: boolean }>
            if (customEvent.detail && typeof customEvent.detail.isNewCollectionActive === 'boolean') {
                setIsNewCollectionActive(customEvent.detail.isNewCollectionActive)
            }
        }
        window.addEventListener('site-options-changed', onSiteOptionsChanged)
        return () => window.removeEventListener('site-options-changed', onSiteOptionsChanged)
    }, [])

    async function onToggleNewCollectionVisibility() {
        try {
            setIsUpdatingOptions(true)
            const nextState = !isNewCollectionActive
            const updated = await optionsService.updateSiteOptions({ isNewCollectionActive: nextState })
            setIsNewCollectionActive(updated.isNewCollectionActive)
        } catch (err) {
            console.error('Failed to toggle New Collection visibility', err)
            alert(isEn ? 'Failed to update visibility' : 'עדכון ההגדרה נכשל')
        } finally {
            setIsUpdatingOptions(false)
        }
    }

    useEffect(() => {
        async function loadProducts() {
            try {
                setIsLoading(true)
                const fetchedProducts = await productService.query({})
                const prodList = fetchedProducts as FullProduct[]
                setProducts(prodList)

                if (initialProductId) {
                    const productToEdit = prodList.find(p => p._id === initialProductId)
                    if (productToEdit) setEditingProduct(productToEdit)
                }
            } catch (err) {
                console.error('Failed to load products', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadProducts()
    }, [initialProductId])

    const filteredProducts = useMemo(() => {
        if (!filterBy.txt) return products
        const searchTxt = filterBy.txt.toLowerCase()
        return products.filter(p => 
            p.name.en.toLowerCase().includes(searchTxt) || 
            p.name.he.includes(searchTxt)
        )
    }, [products, filterBy.txt])

    async function onRemoveProduct(productId: string) {
        if (!window.confirm(isEn ? 'Are you sure?' : 'האם אתה בטוח?')) return
        try {
            await productService.remove(productId)
            setProducts(prev => prev.filter(p => p._id?.toString() !== productId))
        } catch (err) {
            console.error('Failed to remove product', err)
        }
    }

    async function onToggleActive(product: FullProduct) {
        try {
            const updatedProduct = { ...product, isActive: !product.isActive }
            await productService.update(updatedProduct)
            setProducts(prev => prev.map(p => p._id === product._id ? updatedProduct : p))
        } catch (err) {
            console.error('Failed to toggle product status', err)
        }
    }

    async function onSaveProduct(productToSave: FullProduct) {
        try {
            const isEditingExisting = !!productToSave._id
            const savedProduct = isEditingExisting 
                ? await productService.update(productToSave)
                : await productService.add(productToSave)
            
            if (isEditingExisting) {
                setProducts(prev => prev.map(p => p._id === savedProduct._id ? savedProduct : p))
                if (targetScrollInfoRef.current) {
                    targetScrollInfoRef.current.productId = savedProduct._id
                }
            } else {
                setProducts(prev => [savedProduct, ...prev])
                targetScrollInfoRef.current = {
                    productId: savedProduct._id,
                    scrollY: 0,
                    offsetFromTop: undefined,
                    isNew: false
                }
            }
            
            if (initialProductId && window.history.length > 1) {
                window.history.back()
            } else {
                setEditingProduct(null)
            }
        } catch (err) {
            console.error('Failed to save product', err)
        }
    }

    useLayoutEffect(() => {
        if (editingProduct) {
            window.scrollTo({ top: 0, behavior: 'instant' })
            return
        }

        if (!editingProduct && targetScrollInfoRef.current) {
            const { productId, scrollY, offsetFromTop, isNew } = targetScrollInfoRef.current

            const restoreScroll = () => {
                if (isNew) {
                    if (scrollY !== undefined) {
                        window.scrollTo({ top: scrollY, behavior: 'instant' })
                    }
                    return
                }

                const rowEl = productId ? document.getElementById(`product-row-${productId}`) : null
                if (rowEl && offsetFromTop !== undefined) {
                    const targetScrollY = window.scrollY + rowEl.getBoundingClientRect().top - offsetFromTop
                    window.scrollTo({ top: Math.max(0, targetScrollY), behavior: 'instant' })
                    rowEl.classList.add('product-row-highlight')
                    setTimeout(() => {
                        rowEl.classList.remove('product-row-highlight')
                    }, 1600)
                } else if (rowEl) {
                    rowEl.scrollIntoView({ block: 'center', behavior: 'instant' })
                    rowEl.classList.add('product-row-highlight')
                    setTimeout(() => {
                        rowEl.classList.remove('product-row-highlight')
                    }, 1600)
                } else if (scrollY !== undefined) {
                    window.scrollTo({ top: scrollY, behavior: 'instant' })
                }
            }

            restoreScroll()

            const rafId = requestAnimationFrame(() => {
                restoreScroll()
                targetScrollInfoRef.current = null
            })

            return () => cancelAnimationFrame(rafId)
        }
    }, [editingProduct])

    const getImageUrl = (imgsUrl: string[]) => {
        if (!imgsUrl || imgsUrl.length === 0) return null
        
        const cleanUrls = imgsUrl.map(url => url.replace(/[\r\n\s]+/g, '').replace(/\.[^/.]+$/, "").replace(/^4G8A/i, ""))
        const filteredUrls = cleanUrls.filter(url => url !== 'coming-soon')
        if (filteredUrls.length === 0) return null

        const cPhoto = filteredUrls.find(url => url.toUpperCase().startsWith('C_'))
        const hPhoto = filteredUrls.find(url => url.toUpperCase().startsWith('H_'))
        const numPhoto = filteredUrls.find(url => !url.toUpperCase().startsWith('C_') && !url.toUpperCase().startsWith('H_') && !url.toUpperCase().startsWith('S_'))
        const sPhoto = filteredUrls.find(url => url.toUpperCase().startsWith('S_'))
        
        const imgName = cPhoto || hPhoto || numPhoto || sPhoto
        if (!imgName) return null

        // const cloudId = import.meta.env.VITE_CLOUDINARY_ID
        const cloudId = 'dhixlriwm'
        const nameWithout4G8A = imgName.replace(/^4G8A/i, '')
        const upper = nameWithout4G8A.toUpperCase()
        if (upper.startsWith('C_') || upper.startsWith('H_') || upper.startsWith('S_')) return `https://res.cloudinary.com/${cloudId}/image/upload/w_50,h_50,c_fill,q_auto/${nameWithout4G8A}.webp`
        return `https://res.cloudinary.com/${cloudId}/image/upload/w_50,h_50,c_fill,q_auto/4G8A${nameWithout4G8A}.webp`
    }

    function onStartAddProduct() {
        targetScrollInfoRef.current = {
            scrollY: window.scrollY,
            isNew: true
        }
        setEditingProduct('new')
    }

    if (editingProduct) {
        return (
            <AdminProductEdit 
                product={editingProduct === 'new' ? undefined : editingProduct} 
                onSave={onSaveProduct} 
                onCancel={() => {
                    if (initialProductId && window.history.length > 1) {
                        window.history.back()
                    } else {
                        setEditingProduct(null)
                    }
                }} 
            />
        )
    }

    return (
        <section className="admin-product-list">
            <header className="list-header">
                <h2>{isEn ? 'Manage Products' : 'ניהול מוצרים'}</h2>
                <div className="list-actions">
                    <input 
                        type="text" 
                        placeholder={isEn ? 'Search products...' : 'חפש מוצרים...'}
                        value={filterBy.txt}
                        onChange={(e) => setFilterBy({ txt: e.target.value })}
                        className="search-input"
                    />
                    <button className="btn-add" onClick={onStartAddProduct}>
                        {isEn ? 'Add Product' : 'הוסף מוצר'}
                    </button>
                </div>
            </header>

            <div className="admin-category-visibility-card" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                background: '#fafafa',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                marginBottom: '20px',
                gap: '16px',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e1c19' }}>
                            {isEn ? 'Category "New Collection"' : 'קטגוריית "קולקציה חדשה"'}
                        </span>
                        <span style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: isNewCollectionActive ? '#2e7d32' : '#9e9e9e'
                        }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        {isEn 
                            ? 'Toggle whether "New Collection" appears in the navigation menu and filter toolbar on the website.' 
                            : 'הגדרה זו קובעת האם קטגוריית "קולקציה חדשה" תוצג בתפריט הראשי ובסרגל הסינונים באתר.'}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onToggleNewCollectionVisibility}
                    disabled={isUpdatingOptions}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 18px',
                        borderRadius: '20px',
                        border: '1px solid ' + (isNewCollectionActive ? '#c8e6c9' : '#e0e0e0'),
                        cursor: isUpdatingOptions ? 'wait' : 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        backgroundColor: isNewCollectionActive ? '#e8f5e9' : '#f5f5f5',
                        color: isNewCollectionActive ? '#2e7d32' : '#616161',
                        transition: 'all 0.2s ease'
                    }}
                    title={isEn ? 'Click to show/hide category' : 'לחץ להצגה או הסתרה'}
                >
                    <span>
                        {isUpdatingOptions 
                            ? (isEn ? 'Updating...' : 'מעדכן...')
                            : isNewCollectionActive 
                                ? (isEn ? '✓ Active (Shown on site)' : '✓ פעיל (מוצג באתר)') 
                                : (isEn ? '✕ Hidden from site' : '✕ מוסתר מהאתר')}
                    </span>
                </button>
            </div>

            {isLoading ? (
                <div className="admin-loader-container">
                    <div className="admin-loader"></div>
                    <p>{isEn ? 'Loading products...' : 'טוען מוצרים...'}</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{isEn ? 'Image' : 'תמונה'}</th>
                                <th>{isEn ? 'Name' : 'שם'}</th>
                                <th>{isEn ? 'Price' : 'מחיר'}</th>
                                <th>{isEn ? 'Status' : 'סטטוס'}</th>
                                <th>{isEn ? 'Actions' : 'פעולות'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const imageUrl = getImageUrl(product.imgsUrl)
                                return (
                                    <tr key={product._id?.toString()} id={product._id ? `product-row-${product._id}` : undefined}>
                                        <td className="product-img-td">
                                            {imageUrl ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt={isEn ? product.name.en : product.name.he} 
                                                    className="admin-list-img"
                                                />
                                            ) : (
                                                <div className="admin-list-no-img" style={{ 
                                                    width: '50px', 
                                                    height: '50px', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    backgroundColor: '#f4f4f4', 
                                                    fontSize: '10px', 
                                                    textAlign: 'center',
                                                    color: '#999',
                                                    borderRadius: '4px'
                                                }}>
                                                    {isEn ? 'No photo' : 'אין תמונה'}
                                                </div>
                                            )}
                                        </td>
                                        <td data-label={isEn ? 'Name' : 'שם'}>
                                            <span>{isEn ? product.name.en : product.name.he}</span>
                                            {Boolean(product.isNew || product.category?.some(c => c.en?.toLowerCase().includes('new') || c.he?.includes('חדש'))) && (
                                                <span 
                                                    dir={isEn ? "ltr" : "rtl"}
                                                    style={{
                                                        display: 'inline-block',
                                                        fontSize: '10px',
                                                        backgroundColor: '#1e1c19',
                                                        color: '#ffffff',
                                                        padding: '2px 6px',
                                                        borderRadius: '2px',
                                                        marginLeft: isEn ? '8px' : '0',
                                                        marginRight: isEn ? '0' : '8px',
                                                        fontWeight: 500,
                                                        letterSpacing: '0.05em'
                                                    }}
                                                >
                                                    {isEn ? 'NEW!' : 'חדש!'}
                                                </span>
                                            )}
                                        </td>
                                        <td data-label={isEn ? 'Price' : 'מחיר'}>
                                            {(() => {
                                                if (!product.price || !Array.isArray(product.price) || product.price.length === 0) return '-'
                                                const amounts = product.price.map(p => p.amount)
                                                const min = Math.min(...amounts)
                                                const max = Math.max(...amounts)
                                                if (min === max) return <span dir="ltr">₪{min}</span>
                                                return <span dir="ltr">₪{min} - ₪{max}</span>
                                            })()}
                                        </td>
                                        <td data-label={isEn ? 'Status' : 'סטטוס'}>
                                            <button 
                                                className={`status-btn ${product.isActive !== false ? 'active' : 'inactive'}`}
                                                onClick={() => onToggleActive(product)}
                                            >
                                                {product.isActive !== false ? (isEn ? 'Active' : 'פעיל') : (isEn ? 'Inactive' : 'לא פעיל')}
                                            </button>
                                        </td>
                                        <td className="actions" data-label={isEn ? 'Actions' : 'פעולות'}>
                                            <button onClick={() => setEditingUserOrProduct(product)}>{isEn ? 'Edit' : 'ערוך'}</button>
                                            <button onClick={() => onRemoveProduct(product._id!.toString())}>{isEn ? 'Remove' : 'מחק'}</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )

    function setEditingUserOrProduct(product: FullProduct) {
        const rowEl = product._id ? document.getElementById(`product-row-${product._id}`) : null
        targetScrollInfoRef.current = {
            productId: product._id,
            scrollY: window.scrollY,
            offsetFromTop: rowEl ? rowEl.getBoundingClientRect().top : undefined,
            isNew: false
        }
        setEditingProduct(product)
    }
}
