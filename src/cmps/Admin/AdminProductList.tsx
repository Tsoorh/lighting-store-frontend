import React, { useEffect, useState } from 'react'
import { productService } from '../../services/product.service'
import type { FullProduct } from '../../model/product.model'
import { useLanguage } from '../../hooks/useLanguage'
import { AdminProductEdit } from './AdminProductEdit'

export const AdminProductList: React.FC = () => {
    const [products, setProducts] = useState<FullProduct[]>([])
    const [editingProduct, setEditingProduct] = useState<FullProduct | null | 'new'>(null)
    const { language } = useLanguage()
    const isEn = language === 'en'

    useEffect(() => {
        async function loadProducts() {
            try {
                const fetchedProducts = await productService.query({})
                setProducts(fetchedProducts as FullProduct[])
            } catch (err) {
                console.error('Failed to load products', err)
            }
        }

        loadProducts()
    }, [])

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
            setEditingProduct(null)
        } catch (err) {
            console.error('Failed to save product', err)
        }
    }

    if (editingProduct) {
        return (
            <AdminProductEdit 
                product={editingProduct === 'new' ? undefined : editingProduct} 
                onSave={onSaveProduct} 
                onCancel={() => setEditingProduct(null)} 
            />
        )
    }

    return (
        <section className="admin-product-list">
            <header className="list-header">
                <h2>{isEn ? 'Manage Products' : 'ניהול מוצרים'}</h2>
                <button className="btn-add" onClick={() => setEditingProduct('new')}>
                    {isEn ? 'Add Product' : 'הוסף מוצר'}
                </button>
            </header>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{isEn ? 'Name' : 'שם'}</th>
                            <th>{isEn ? 'Price' : 'מחיר'}</th>
                            <th>{isEn ? 'Status' : 'סטטוס'}</th>
                            <th>{isEn ? 'Actions' : 'פעולות'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id?.toString()}>
                                <td>{isEn ? product.name.en : product.name.he}</td>
                                <td>{product.price || '-'}</td>
                                <td>
                                    <button 
                                        className={`status-btn ${product.isActive !== false ? 'active' : 'inactive'}`}
                                        onClick={() => onToggleActive(product)}
                                    >
                                        {product.isActive !== false ? (isEn ? 'Active' : 'פעיל') : (isEn ? 'Inactive' : 'לא פעיל')}
                                    </button>
                                </td>
                                <td className="actions">
                                    <button onClick={() => setEditingProduct(product)}>{isEn ? 'Edit' : 'ערוך'}</button>
                                    <button onClick={() => onRemoveProduct(product._id!.toString())}>{isEn ? 'Remove' : 'מחק'}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
