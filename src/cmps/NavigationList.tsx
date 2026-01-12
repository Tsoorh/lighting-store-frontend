import { FormControl, MenuItem, Select, type SelectChangeEvent } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../hooks/useLanguage"
import type { Language } from "../services/LanguageContext"
import type { NavbarProperties } from "./AppHeader"
import { Icons } from "./Icons"
import { useState } from "react"
import type { SubMenu } from "./AppHeader"
import { useWindowWidth } from "../hooks/useWindowWidth"

type NavLinks = {
    navLinks: NavbarProperties,
    closeMenu?: () => void
    handleSearch?: () => void
}

export const NavigationList = ({ navLinks, closeMenu , handleSearch}: NavLinks) => {
    const [subMenuDetails, setSubMenuDetails] = useState<SubMenu | null>(null)
    const { language, changeLanguage } = useLanguage()
    const [closeTimeout, setCloseTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const navigate = useNavigate()
    const width = useWindowWidth()

    const handleChangeLanguage = (event: SelectChangeEvent) => {
        const value = event.target.value as Language;
        changeLanguage(value)
    }

    const onEnter = (subMenu: SubMenu | undefined) => {
        if (closeTimeout) clearTimeout(closeTimeout)
        if (subMenu) setSubMenuDetails(subMenu)
    }

    const onLeave = () => {
        const timeout = setTimeout(() => setSubMenuDetails(null), 150)
        setCloseTimeout(timeout)
    }

    const onHandleClick = (address: string | undefined, subMenu: SubMenu | undefined, isMobile?: boolean) => {
        if (!subMenu && address) {
            navigate(address)
            setSubMenuDetails(null)
            if (closeMenu) closeMenu()
        }
        if (subMenu) setSubMenuDetails(subMenu)
        if (isMobile) setIsMenuOpen(prev => !prev)
    }


    const isEnglish = language === 'en'
    const isMobile = (width <= 768)
    const orderLangSelectorRight = !isEnglish && !isMobile ? { order: -1 } : {}
    const orderLangSelectorLeft = !isEnglish && !isMobile ? { order: 1 } : {}
    const orderLangSelectorLefter = !isEnglish && !isMobile ? { order: 2 } : { order: -2 }
    return (
        <ul className="nav-links" style={!isMobile ? { flexDirection: isEnglish ? 'row' : 'row-reverse' } : { alignItems: isEnglish ? 'start' : 'end' }}>
            {!isMobile &&
                <li style={orderLangSelectorLeft} onClick={() => { window.location.href = 'https://wa.me/972524000102?text=%D7%94%D7%99%D7%99%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%93%D7%A3%20%D7%94%D7%91%D7%99%D7%AA%20%D7%91%D7%90%D7%AA%D7%A8%20%D7%A9%D7%9C%20%D7%98%D7%99%D7%A8%D7%9F.%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D' }}>
                    <Icons iconName="whatsapp" /></li>
            }
            {!isMobile && <li style={orderLangSelectorLefter} onClick={handleSearch}><Icons iconName="search" /></li>
            }
            {navLinks.map(link => {
                return (
                    <>
                        <li
                            onClick={() => (onHandleClick(link?.address, link?.subMenu, isMobile))}
                            onMouseEnter={() => !isMobile && onEnter(link?.subMenu)}
                            onMouseLeave={!isMobile ? onLeave : undefined}
                            key={link.title.en}>
                            {isEnglish ? link.title.en : link.title.he}
                            {link?.iconName && <Icons iconName={link.iconName} />}

                            {/* DESKTOP SUBMENU */}
                            {link.subMenu && subMenuDetails && !isMobile &&
                                <div
                                    className="sub-menu"
                                    onMouseEnter={() => onEnter(link.subMenu)}
                                    onMouseLeave={onLeave}
                                >
                                    <ul>
                                        {subMenuDetails.map(child => (
                                            <li
                                                key={child.title.en}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate(child.address)
                                                    setSubMenuDetails(null)
                                                }}
                                                style={{ textAlign: isEnglish ? 'start' : 'end' }}
                                            >
                                                {isEnglish ? child.title.en : child.title.he}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }

                        </li>
                        {/* MOBILE SUBMENU */}
                        {link.subMenu && subMenuDetails && isMobile && isMenuOpen &&
                            <li className="sub-menu-small" style={{ flexDirection: isEnglish ? 'row' : 'row-reverse' }}>
                                <ul>
                                    {subMenuDetails.map(child => (
                                        <li
                                            key={child.title.en}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(child.address)
                                                if (closeMenu) closeMenu()
                                            }}
                                            style={{ textAlign: isEnglish ? 'start' : 'end' }}
                                        >
                                            {isEnglish ? child.title.en : child.title.he}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        }
                    </>
                )
            })}


            {/* Language selector */}
            <li className={isMobile ? 'mobile-align' : ''} style={orderLangSelectorRight}>
                <FormControl sx={{ m: 0, minWidth: 67 }} size="small">
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

        </ul >
    )
}