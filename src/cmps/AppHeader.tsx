
import Logo from '/images/TIRAN-LOGO1.svg';
import { Icons } from "./Icons";
import { useWindowWidth } from "../hooks/useWindowWidth";
import type { hebrewEnglishObj } from '../model/product.model';
import { NavigationList } from './NavigationList';
import { useEffect, useState } from 'react';
import { MenuModal } from './MenuModal';
import { useNavigate } from 'react-router-dom';

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
    const width = useWindowWidth()
    const navigate = useNavigate()

    const isMobile = width <= 768;

    const navbarProperties: NavbarProperties = [
        { title: { en: 'Home', he: 'בית' }, address: '/' },
        {
            title: { en: 'Lighting', he: 'תאורה' }, iconName: 'dropdown', subMenu: [
                { title: { en: 'All Lighting', he: 'כל התאורה' }, address: '/product' },
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

    const handleOpenMenu = () => {
        setIsMenuOpen(prev => !prev)
    }

    return (
        <header className="app-header">
            <div className="logo" onClick={() => navigate('/')}>
                {/* <p>TIRAN LASRY</p> */}
                <img src={Logo} alt="Tiran-Logo" />
                {/* <span className="slogen">Lighting Design Studio</span> */}
            </div>
            <nav className="nav-bar">
                {isMobile ? <div className={`menu-icon ${isMenuOpen ? `active` : ``}`} onClick={handleOpenMenu}> <Icons iconName="menu" /> </div> :
                    <NavigationList navLinks={navbarProperties} />
                }
            </nav>
            {isMenuOpen ? <MenuModal navLinks={navbarProperties} closeMenu={handleOpenMenu} /> : ''}
        </header>
    )
}