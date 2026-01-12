
import Logo from '/images/TIRAN-LOGO1.svg';
import { Icons } from "./Icons";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { type FullProductsOrNull, type hebrewEnglishObj } from '../model/product.model';
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
    const [inputSearch, setInputSearch] = useState<string>('')
    const width = useWindowWidth()
    const navigate = useNavigate()
    const { language } = useLanguage()
    const debouncedSearch = useDebounce<string>(inputSearch, 500);
    const [resultProduct, setResultProduct] = useState<FullProductsOrNull | undefined>(null)

    const isMobile = width <= 768;

    const navbarProperties: NavbarProperties = [
        { title: { en: 'Home', he: 'בית' }, address: '/' },
        {
            title: { en: 'Lighting', he: 'תאורה' }, iconName: 'dropdown', subMenu: [
                { title: { en: 'All Lighting', he: 'כל התאורה' }, address: '/product/category/all' },
                { title: { en: 'Wall', he: 'מנורות קיר' }, address: '/product/category/wall' },
                { title: { en: 'Hanging', he: 'מנורות תלייה' }, address: '/product/category/hanging' },
                { title: { en: 'Ceiling', he: 'מנורות תקרה' }, address: '/product/category/ceiling' },
                { title: { en: 'Accessories', he: 'אביזרים' }, address: '/product/category/accessories' },
            ]
        },
        { title: { en: 'Contact', he: 'צור קשר' }, address: '/contact' }

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
        <header className="app-header">
            <div className="logo" onClick={() => navigate('/')}>
                <img src={Logo} alt="Tiran-Logo" />
                {/* <span className="slogen">Lighting Design Studio</span> */}
            </div>
            <nav className="nav-bar">
                {isMobile ? <div className={`menu-icon ${isMenuOpen ? `active` : ``}`} onClick={handleOpenMenu}> <Icons iconName="menu" /> </div> :
                    <NavigationList navLinks={navbarProperties} handleSearch={handleSearch} />
                }
            </nav>

            {/* Side sub-menu on mobile */}
            {isMenuOpen && !isOnSearch && <MenuModal closeMenu={handleOpenMenu} >
                <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="exit-btn" onClick={handleOpenMenu}><Icons iconName={"close"} /></button>
                    <h1>{isEnglish ? 'Menu' : 'תפריט'}</h1>
                    <NavigationList navLinks={navbarProperties} closeMenu={handleOpenMenu} />
                </div>
            </MenuModal>}

            {/* Side search on mobile */}
            {isOnSearch && <MenuModal closeMenu={handleOpenMenu} >
                <div className="menu-modal search-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="exit-btn" onClick={handleOpenMenu}><Icons iconName={"close"} /></button>
                    <div className='text-field-search'>
                        <Input autoFocus color='primary' onChange={onHandleChangeInput} value={inputSearch} sx={{ mr: '1rem', ml: '2.5rem', width: 'calc(100% - 2rem)' }} dir={isEnglish ? 'ltr' : 'rtl'} placeholder={isEnglish ? 'What would you like to light today?' : 'מה תרצו להאיר היום?'} />
                    </div>
                    <div className="search-results">
                        {debouncedSearch?
                        <ul>
                            {resultProduct?.map(product => {
                                return <li key={product._id} onClick={()=>navigateToProduct(product._id as string)}>
                                    <div>
                                        <img src={`https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${product.imgsUrl[0]}.webp`} alt={product.name.en} />
                                        <p>{isEnglish ? product.name.en : product.name.he}</p>
                                    </div>
                                    <b>₪{product.price}</b>
                                </li>
                            })}
                        </ul>:
                        <p>Start Searching...</p>
                        }
                    </div>
                </div>
            </MenuModal>}

        </header >
    )
}