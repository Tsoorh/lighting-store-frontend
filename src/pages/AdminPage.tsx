import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { AdminProductList } from '../cmps/Admin/AdminProductList'
import { AdminUserList } from '../cmps/Admin/AdminUserList'
import { AdminPriceSettings } from '../cmps/Admin/AdminPriceSettings'
import { useLanguage } from '../hooks/useLanguage'
import '../assets/styles/pages/AdminPage.css'

export const AdminPage: React.FC = () => {
    const [searchParams] = useSearchParams()
    const editProductId = searchParams.get('edit')
    const [activeTab, setActiveTab] = useState<'products' | 'users' | 'settings'>(editProductId ? 'products' : 'products')
    const [user, setUser] = useState(authService.getLoggedinUser())
    const navigate = useNavigate()
    const { language } = useLanguage()
    const isEn = language === 'en'

    const isAdmin = user?.role?.trim().toLowerCase() === 'admin'

    useEffect(() => {
        const onUserChanged = () => setUser(authService.getLoggedinUser())
        window.addEventListener('user-changed', onUserChanged)
        
        if (!user) {
            navigate('/login')
        } else if (!isAdmin) {
            navigate('/')
        }

        return () => window.removeEventListener('user-changed', onUserChanged)
    }, [user, isAdmin, navigate])

    if (!user || !isAdmin) return null

    return (
        <div className="admin-page main-layout" dir={isEn ? 'ltr' : 'rtl'}>
            <header className="admin-header">
                <h1>{isEn ? 'Admin Dashboard' : 'לוח בקרה מנהל'}</h1>
                <nav className="admin-tabs">
                    <button 
                        className={activeTab === 'products' ? 'active' : ''} 
                        onClick={() => setActiveTab('products')}
                    >
                        {isEn ? 'Products' : 'מוצרים'}
                    </button>
                    <button 
                        className={activeTab === 'users' ? 'active' : ''} 
                        onClick={() => setActiveTab('users')}
                    >
                        {isEn ? 'Users' : 'משתמשים'}
                    </button>
                    <button 
                        className={activeTab === 'settings' ? 'active' : ''} 
                        onClick={() => setActiveTab('settings')}
                    >
                        {isEn ? 'Price Settings' : 'הגדרות מחירים'}
                    </button>
                </nav>
            </header>

            <main className="admin-content">
                {activeTab === 'products' && <AdminProductList initialProductId={editProductId} />}
                {activeTab === 'users' && <AdminUserList />}
                {activeTab === 'settings' && <AdminPriceSettings />}
            </main>
        </div>
    )
}
