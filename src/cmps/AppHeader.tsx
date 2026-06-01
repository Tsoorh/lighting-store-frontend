
import Logo from '/images/Figma/Tiran_T_Grey_Logo.png';
import { Icons } from "./Icons";
import { useWindowWidth } from "../hooks/useWindowWidth";
import type { FullProductsOrNull, hebrewEnglishObj } from '../model/product.model';
import { NavigationList } from './NavigationList';
import { useEffect, useState, type ChangeEvent } from 'react';
import { MenuModal } from './MenuModal';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Input } from '@mui/material';
import { useDebounce } from '../hooks/useDebounce';
import { productService } from '../services/product.service';

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

    const isMobile = width <= 768;

    const navbarProperties: NavbarProperties = [
        { title: { en: 'Home', he: 'בית' }, address: '/' },
        {
            title: { en: 'Lighting', he: 'גופי תאורה' }, iconName: 'dropdown', subMenu: [
                { title: { en: 'Wall', he: 'גופי תאורה לקיר' }, address: '/product/category/wall' },
                { title: { en: 'Pendant', he: 'גופי תאורה תלויים' }, address: '/product/category/pendant' },
                { title: { en: 'Ceiling', he: 'גופי תאורה צמודי תקרה' }, address: '/product/category/ceiling' },
                { title: { en: 'Accessories', he: 'אביזרים' }, address: '/product/category/accessories' },
            ]
        },
        { title: { en: 'About', he: 'אודות' }, address: '/About' },
        { title: { en: 'Contact', he: 'יצירת קשר' }, address: '/contact' }

    ]

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
                {isMobile ? <button className={`menu-icon ${isMenuOpen ? `active` : ``}`} onClick={handleOpenMenu} aria-expanded={isMenuOpen} aria-label={isEnglish ? 'Menu' : 'תפריט'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}> <Icons iconName="menu" /> </button> :
                    <NavigationList navLinks={navbarProperties} handleSearch={handleSearch} />
                }
            </nav>

            {/* Side sub-menu on mobile */}
            {isMenuOpen && !isOnSearch && <MenuModal closeMenu={handleOpenMenu} >
                <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="exit-btn" onClick={handleOpenMenu} aria-label={isEnglish ? 'Close menu' : 'סגור תפריט'}><Icons iconName={"close"} /></button>
                    <h1>{isEnglish ? 'Menu' : 'תפריט'}</h1>
                    <NavigationList navLinks={navbarProperties} closeMenu={handleOpenMenu} />
                </div>
            </MenuModal>}

            {/* Side search on mobile */}
            {isOnSearch && <MenuModal closeMenu={handleOpenMenu} >
                <div className="menu-modal search-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="exit-btn" onClick={handleOpenMenu} aria-label={isEnglish ? 'Close' : 'סגור'}><Icons iconName={"close"} /></button>
                    <div className='text-field-search'>
                        <Input autoFocus color='primary' onChange={onHandleChangeInput} value={inputSearch} sx={{ mr: '1rem', ml: '2.5rem', width: 'calc(100% - 2rem)' }} dir={isEnglish ? 'ltr' : 'rtl'} placeholder={isEnglish ? 'What would you like to light today?' : 'מה תרצו להאיר היום?'} inputProps={{ 'aria-label': isEnglish ? 'Search products' : 'חפש מוצרים' }} />
                    </div>
                    <div className="search-results">
                        {debouncedSearch?
                        <ul>
                            {resultProduct?.map(product => {
                                return <li key={product._id} role="link" tabIndex={0} onClick={()=>navigateToProduct(product._id as string)} onKeyDown={(e)=> (e.key === 'Enter' || e.key === ' ') && navigateToProduct(product._id as string)}>
                                    <div>
                                        <img src={`https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${product.imgsUrl[0]}.webp`} alt={product.name.en} />
                                        <p>{isEnglish ? product.name.en : product.name.he}</p>
                                    </div>
                                    <b>₪{product.price}</b>
                                </li>
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