import React, { useEffect, useState, useMemo } from 'react'
import { productService } from '../../services/product.service'
import type { FullProduct } from '../../model/product.model'
import { useLanguage } from '../../hooks/useLanguage'
import { AdminProductEdit } from './AdminProductEdit'

interface AdminProductListProps {
    initialProductId?: string | null
}

export const AdminProductList: React.FC<AdminProductListProps> = ({ initialProductId }) => {
    const [products, setProducts] = useState<FullProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState<FullProduct | null | 'new'>(null)
    const [filterBy, setFilterBy] = useState({ txt: '' })
    const { language } = useLanguage()
    const isEn = language === 'en'

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
            const savedProduct = productToSave._id 
                ? await productService.update(productToSave)
                : await productService.add(productToSave)
            
            if (productToSave._id) {
                setProducts(prev => prev.map(p => p._id === savedProduct._id ? savedProduct : p))
            } else {
                setProducts(prev => [savedProduct, ...prev])
            }
            
            if (initialProductId) {
                window.history.back()
            } else {
                setEditingProduct(null)
            }
        } catch (err) {
            console.error('Failed to save product', err)
        }
    }

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

    if (editingProduct) {
        return (
            <AdminProductEdit 
                product={editingProduct === 'new' ? undefined : editingProduct} 
                onSave={onSaveProduct} 
                onCancel={() => {
                    if (initialProductId) {
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
                    <button className="btn-add" onClick={() => setEditingProduct('new')}>
                        {isEn ? 'Add Product' : 'הוסף מוצר'}
                    </button>
                </div>
            </header>

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
                                    <tr key={product._id?.toString()}>
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
                                        <td data-label={isEn ? 'Name' : 'שם'}>{isEn ? product.name.en : product.name.he}</td>
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
        setEditingProduct(product)
    }
}
