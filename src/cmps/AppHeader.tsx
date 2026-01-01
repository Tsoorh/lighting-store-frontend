import { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../hooks/useLanguage";
import type { Language } from "../services/LanguageContext";
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { FormControl } from "@mui/material";
import Logo from '/images/TIRAN-LOGO1.svg';
import { Icons } from "./Icons";
import { useWindowWidth } from "../hooks/useWindowWidth";
import '../assets/styles/cmps/AppHeader.css'

export const AppHeader = () => {
    const { language, changeLanguage } = useLanguage()
    const navigate = useNavigate()
    const width = useWindowWidth()

    const isMobile = width <= 768;

    const navbarProperties = [
        { title: { en: 'Home', he: 'בית' }, address: '/' },
        { title: { en: 'Lighting', he: 'תאורה' }, address: '/product' },
        { title: { en: 'Contact', he: 'צור קשר' }, address: '/contact' }
    ]

    const handleChangeLanguage = (event: SelectChangeEvent) => {
        const value = event.target.value as Language;
        changeLanguage(value)
    }


    const isEnglish = (language === "en")

    // Drawer state & refs
    const [isOpen, setIsOpen] = useState(false)
    const menuButtonRef = useRef<HTMLButtonElement | null>(null)
    const firstLinkRef = useRef<HTMLButtonElement | null>(null)

    // close on Escape, return focus to trigger, lock body scroll
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) setIsOpen(false)
        }
        if (isOpen) {
            document.addEventListener('keydown', onKey)
            const prev = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            const triggerEl = menuButtonRef.current
            // focus first link after the open animation
            const focusT = setTimeout(() => firstLinkRef.current?.focus(), 300)
            return () => {
                document.removeEventListener('keydown', onKey)
                document.body.style.overflow = prev
                clearTimeout(focusT)
                triggerEl?.focus()
            }
        }
    }, [isOpen])

    // if the screen becomes large, ensure drawer is closed (deferred to avoid sync setState in effect)
    useEffect(() => {
        if (!isMobile) {
            const t = setTimeout(() => setIsOpen(false), 0)
            return () => clearTimeout(t)
        }
    }, [isMobile])

    return (
        <header className="app-header">
            <div className="logo" onClick={() => navigate('/') }>
                <img src={Logo} alt="Tiran-Logo" />
            </div>

            <nav className="nav-bar">
                {isMobile ? (
                    <>
                        <button
                            ref={menuButtonRef}
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                            aria-haspopup="dialog"
                            className={`menu-icon ${isOpen ? 'active' : ''}`}
                            onClick={() => setIsOpen(true)}
                            title="Open menu"
                        >
                            <Icons iconName="menu" />
                        </button>

                        <div
                            className={`drawer-overlay ${isOpen ? 'open' : ''}`}
                            onClick={() => setIsOpen(false)}
                            aria-hidden={!isOpen}
                        />

                        <aside
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Main menu"
                            className={`mobile-drawer ${isOpen ? 'open' : ''}`}
                        >
                            <div className="drawer-header">
                                <button aria-label="Close menu" onClick={() => setIsOpen(false)} className="menu-close-btn">×</button>
                            </div>
                            <div className="drawer-body">
                                <div className="drawer-links">
                                    {navbarProperties.map((property, idx) => (
                                        <button
                                            key={property.address}
                                            ref={idx === 0 ? firstLinkRef : undefined}
                                            className="drawer-link"
                                            onClick={() => { navigate(property.address); setIsOpen(false); }}
                                        >
                                            {isEnglish ? property.title.en : property.title.he}
                                        </button>
                                    ))}

                                    <div>
                                        <FormControl sx={{ m: 0, minWidth: 67 }} size="small" >
                                            <Select
                                                sx={{
                                                    fontSize: "small",
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                    width: '100%'
                                                }}
                                                id="language-mobile"
                                                className="select-lang"
                                                value={language}
                                                onChange={(e) => handleChangeLanguage(e)}
                                                inputProps={{ 'aria-label': 'Language' }}
                                                displayEmpty
                                            >
                                                <MenuItem sx={{ fontSize: "small" }} value={"en"}>EN</MenuItem>
                                                <MenuItem sx={{ fontSize: "small" }} value={"he"}>עב</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </>
                ) : (
                    <ul className="nav-links" style={{ flexDirection: isEnglish ? 'row' : 'row-reverse' }}>
                        {navbarProperties.map(property => {
                            return <li onClick={() => navigate(property.address)} key={property.address}>{isEnglish ? property.title.en : property.title.he}</li>
                        })}
                        <li style={!isEnglish ? { order: -1 } : {}}>
                            <FormControl sx={{ m: 0, minWidth: 67 }} size="small" >
                                <Select
                                    sx={{
                                        fontSize: "small",
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                    }}
                                    id="language"
                                    className="select-lang"
                                    value={language}
                                    onChange={(e) => handleChangeLanguage(e)}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    displayEmpty
                                >
                                    <MenuItem sx={{ fontSize: "small" }} value={"en"}>EN</MenuItem>
                                    <MenuItem sx={{ fontSize: "small" }} value={"he"}>עב</MenuItem>
                                </Select>
                            </FormControl>
                        </li>
                    </ul>
                )}
            </nav>

        </header>
    )
}