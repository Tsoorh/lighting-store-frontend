
import Logo from '/images/Figma/Tiran_T_Grey_Logo.png';
import { Icons } from "./Icons";
import { useWindowWidth } from "../hooks/useWindowWidth";
import type { FullProductsOrNull, hebrewEnglishObj } from '../model/product.model';
import { NavigationList } from './NavigationList';
import { useEffect, useState, useMemo, type ChangeEvent } from 'react';
import { MenuModal } from './MenuModal';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Input } from '@mui/material';
import { useDebounce } from '../hooks/useDebounce';
import { productService } from '../services/product.service';
import { authService } from '../services/auth.service';
import type { Miniuser } from '../model/user.model';
import { ImageWithSkeleton } from './Skeleton/ImageWithSkeleton';



export type SubMenu = {
    title: hebrewEnglishObj
    address: string
}[]

export type NavbarProperties = {
    title: hebrewEnglishObj
    address?: string,
    iconName?: string,
    subMenu?: SubMenu
}[]

export const AppHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isOnSearch, setIsOnSearch] = useState(false)
    const [inputSearch, setInputSearch] = useState('')
    const width = useWindowWidth()
    const navigate = useNavigate()
    const { language } = useLanguage()
    const debouncedSearch = useDebounce(inputSearch, 500);
    const [resultProduct, setResultProduct] = useState<FullProductsOrNull>(null)
    const [user, setUser] = useState<Miniuser | null>(authService.getLoggedinUser())

    const isMobile = width <= 768;

    const navbarProperties: NavbarProperties = useMemo(() => {
        const props: NavbarProperties = [
            { title: { en: 'Home', he: 'בית' }, address: '/' },
            {
                title: { en: 'Lighting', he: 'גופי תאורה' }, iconName: 'dropdown', subMenu: [
                    { title: { en: 'Wall', he: 'גופי תאורה לקיר' }, address: '/product/category/wall' },
                    { title: { en: 'Pendant', he: 'גופי תאורה תלויים' }, address: '/product/category/pendant' },
                    { title: { en: 'Ceiling', he: 'גופי תאורה צמודי תקרה' }, address: '/product/category/ceiling' }
                ]
            },
            { title: { en: 'About', he: 'אודות' }, address: '/about' },
            { title: { en: 'Contact', he: 'יצירת קשר' }, address: '/contact' }
        ]

        if (user?.role?.trim().toLowerCase() === 'admin') {
            props.push({ title: { en: 'Dashboard', he: 'לוח בקרה' }, address: '/dashboard' })
        }

        return props
    }, [user])

    useEffect(() => {
        const onUserChanged = () => setUser(authService.getLoggedinUser())
        window.addEventListener('user-changed', onUserChanged)
        return () => window.removeEventListener('user-changed', onUserChanged)
    }, [])

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    useEffect(() => {

        const getSearchResult = async () => {
            if(debouncedSearch) {
                const filterBy = { txt: debouncedSearch }
                const productFromDB = await productService.query(filterBy)
                setResultProduct(productFromDB)
            }else{
                setResultProduct(null)
            }
        }
        
        getSearchResult()

    }, [debouncedSearch])

    const handleOpenMenu = () => {
        setIsMenuOpen(prev => !prev)
        setIsOnSearch(false)
    }

    const handleSearch = () => {
        setIsMenuOpen(true)
        setIsOnSearch(true)
    }

    const onHandleChangeInput = (ev: ChangeEvent<HTMLInputElement>) => {
        const { value } = ev.target;
        setInputSearch(value)
    }

    const navigateToProduct = (id:string)=>{
        setInputSearch('');
        setIsMenuOpen(false)
        setIsOnSearch(false)
        navigate(`product/${id}`)


    }

    const onLogout = async () => {
        try {
            await authService.logout()
            navigate('/')
        } catch (err) {
            console.error('Failed to logout', err)
        }
    }

    const isEnglish = language === 'en'
    return (
        <header className={`app-header ${isEnglish?`en-dir`:`he-dir`}`}>
            <div 
                className="logo" 
                role="link"
                tabIndex={0}
                aria-label={isEnglish ? "Go to Home Page" : "חזור לדף הבית"}
                onClick={() => navigate('/')}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/')}
            >
                <img src={Logo} alt="Tiran-Logo" />
            </div>
            <nav className="nav-bar">
                {user ? (
                    <div className="user-logged-in" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginInlineEnd: isMobile ? '12px' : '24px', fontSize: '14px', fontFamily: 'Heebo, sans-serif' }}>
                        <span style={{ color: 'rgba(126, 133, 136, 1)' }}>{isEnglish ? `Hi, ${user.fullname}` : `שלום, ${user.fullname}`}</span>
                        <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', color: 'inherit', fontFamily: 'inherit' }}>
                            {isEnglish ? 'Logout' : 'התנתק'}
                        </button>
                    </div>
                ) : (
                    <button 
                        className="user-btn" 
                        onClick={() => navigate('/login')} 
                        aria-label={isEnglish ? 'Login' : 'התחברות'} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginInlineEnd: isMobile ? '12px' : '24px', display: 'flex', alignItems: 'center', color: 'inherit' }}
                    >
                        <Icons iconName="user" />
                    </button>
                )}
                {isMobile ? <button className={`menu-icon ${isMenuOpen ? `active` : ``}`} onClick={handleOpenMenu} aria-expanded={isMenuOpen} aria-label={isEnglish ? 'Menu' : 'תפריט'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}> <Icons iconName="menu" /> </button> :
                    <NavigationList navLinks={navbarProperties} handleSearch={handleSearch} />
                }
            </nav>

            {/* Side sub-menu on mobile */}
            {isMenuOpen && !isOnSearch && <MenuModal closeMenu={handleOpenMenu} >
                <div className={`menu-modal ${isEnglish ? 'en-dir' : 'he-dir'} ` } dir={isEnglish ? 'ltr' : 'rtl'} onClick={(e) => e.stopPropagation()}>
                    <button className="exit-btn" onClick={handleOpenMenu} aria-label={isEnglish ? 'Close menu' : 'סגור תפריט'}><Icons iconName={"close"} /></button>
                    <h1>{isEnglish ? 'Menu' : 'תפריט'}</h1>
                    <NavigationList navLinks={navbarProperties} closeMenu={handleOpenMenu} />
                </div>
            </MenuModal>}

            {/* Side search on mobile */}
            {isOnSearch && <MenuModal closeMenu={handleOpenMenu} >
                <div className={`menu-modal search-modal ${isEnglish ? 'en-dir' : 'he-dir'}`} dir={isEnglish ? 'ltr' : 'rtl'} onClick={(e) => e.stopPropagation()}>
                    <button className="exit-btn" onClick={handleOpenMenu} aria-label={isEnglish ? 'Close' : 'סגור'}><Icons iconName={"close"} /></button>
                    <div className='text-field-search'>
                        <Input 
                            autoFocus 
                            color='primary' 
                            onChange={onHandleChangeInput} 
                            value={inputSearch} 
                            sx={{ 
                                width: '100%', 
                                fontSize: '1.1rem',
                                '&:before': { borderBottomColor: '#e0e0e0' },
                                '&:after': { borderBottomColor: '#000' }
                            }} 
                            dir={isEnglish ? 'ltr' : 'rtl'} 
                            placeholder={isEnglish ? 'What would you like to light today?' : 'מה תרצו להאיר היום?'} 
                            inputProps={{ 'aria-label': isEnglish ? 'Search products' : 'חפש מוצרים' }} 
                        />
                    </div>
                    <div className="search-results">
                        {debouncedSearch?
                        <ul>
                            {resultProduct?.map(product => {
                                const cleanUrls = product.imgsUrl.map(url => url.replace(/[\r\n\s]+/g, '').replace(/\.[^/.]+$/, ""))
                                const filteredUrls = cleanUrls.filter(url => url !== 'coming-soon')
                                const cPhoto = filteredUrls.find(url => url.startsWith('C_'))
                                const hPhoto = filteredUrls.find(url => url.startsWith('H_'))
                                const numPhoto = filteredUrls.find(url => !url.startsWith('C_') && !url.startsWith('H_'))
                                
                                const displayPhoto = cPhoto || hPhoto || numPhoto
                                
                                const getImageUrl = (imgName: string) => {
                                    const cloudId = import.meta.env.VITE_CLOUDINARY_ID
                                    if (imgName.startsWith('C_') || imgName.startsWith('H_')) return `https://res.cloudinary.com/${cloudId}/image/upload/${imgName}.webp`
                                    return `https://res.cloudinary.com/${cloudId}/image/upload/4G8A${imgName}.webp`
                                }

                                return (
                                    <li key={product._id} role="link" tabIndex={0} onClick={()=>navigateToProduct(product._id as string)} onKeyDown={(e)=> (e.key === 'Enter' || e.key === ' ') && navigateToProduct(product._id as string)}>
                                        <div>
                                            <div className="image-container">
                                                {displayPhoto ? (
                                                    <ImageWithSkeleton src={getImageUrl(displayPhoto)} alt={product.name.en} />
                                                ) : (
                                                    <div className="no-photo-placeholder-search" style={{ 
                                                        width: '100%', 
                                                        height: '100%', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        backgroundColor: '#f4f4f4', 
                                                        fontSize: '10px', 
                                                        color: '#999',
                                                        textAlign: 'center'
                                                    }}>
                                                        {isEnglish ? 'No photo' : 'אין תמונה'}
                                                    </div>
                                                )}
                                            </div>
                                            <p>{isEnglish ? product.name.en : product.name.he}</p>
                                        </div>
                                        {product.price !== undefined && Array.isArray(product.price) && product.price.length > 0 && (
                                            <b dir="ltr">
                                                {(() => {
                                                    const amounts = product.price.map(p => p.amount)
                                                    const min = Math.min(...amounts)
                                                    const max = Math.max(...amounts)
                                                    if (min === max) return `₪${min}`
                                                    return `₪${min} - ₪${max}`
                                                })()}
                                            </b>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>:
                        <p>{isEnglish?`Start Searching...`:`...התחל בחיפוש`}</p>
                        }
                    </div>
                </div>
            </MenuModal>}

        </header >
    )
}