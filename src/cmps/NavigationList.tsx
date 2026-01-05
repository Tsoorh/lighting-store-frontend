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
}

export const NavigationList = ({ navLinks, closeMenu }: NavLinks) => {
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
    return (
        <ul className="nav-links" style={!isMobile ? { flexDirection: isEnglish ? 'row' : 'row-reverse' } : { alignItems: isEnglish ? 'start' : 'end' }}>
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
                            <li className="sub-menu-small">
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
                            </li>
                        }
                    </>
                )
            })}

            {/* Language selector */}
            <li style={!isEnglish ? { order: -1 } : {}}>
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
            </li >
        </ul >
    )
}