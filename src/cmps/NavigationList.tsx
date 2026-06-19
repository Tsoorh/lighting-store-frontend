import { FormControl, MenuItem, Select, type SelectChangeEvent } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../hooks/useLanguage"
import type { Language } from "../services/LanguageContext"
import type { NavbarProperties, SubMenu } from "./AppHeader"
import { Icons } from "./Icons"
import { useState, Fragment } from "react"
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
    const [isMenuOpen, setIsMenuOpen] = useState(false)
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
        <ul className="nav-links " style={!isMobile ? { flexDirection: isEnglish ? 'row-reverse' : 'row-reverse' } : { alignItems: isEnglish ? 'start' : '' }}>
            {navLinks.map(link => {
                return (
                    <Fragment key={link.title.en}>
                        <li
                            role="menuitem"
                            tabIndex={0}
                            onClick={() => (onHandleClick(link?.address, link?.subMenu, isMobile))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onHandleClick(link?.address, link?.subMenu, isMobile);
                                }
                            }}
                            onMouseEnter={() => !isMobile && onEnter(link?.subMenu)}
                            onMouseLeave={!isMobile ? onLeave : undefined}
                        >
                            {isMobile ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                                    {isEnglish ? link.title.en : link.title.he}
                                    {link?.iconName && <Icons iconName={link.iconName} />}
                                </div>
                            ) : (
                                <>
                                    {isEnglish ? link.title.en : link.title.he}
                                    {link?.iconName && <Icons iconName={link.iconName} />}
                                </>
                            )}

                            {/* DESKTOP SUBMENU */}
                            {link.subMenu && subMenuDetails && !isMobile &&
                                <div
                                    className={`sub-menu ${isEnglish?`en`:`he`}`}
                                    onMouseEnter={() => onEnter(link.subMenu)}
                                    onMouseLeave={onLeave}
                                >
                                    <ul>
                                        {subMenuDetails.map(child => (
                                            <li
                                                key={child.title.en}
                                                role="menuitem"
                                                tabIndex={0}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate(child.address)
                                                    setSubMenuDetails(null)
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.stopPropagation()
                                                        navigate(child.address)
                                                        setSubMenuDetails(null)
                                                    }
                                                }}
                                            style={{ textAlign: isEnglish ? 'left' : 'right' }}
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
                                            role="menuitem"
                                            tabIndex={0}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(child.address)
                                                if (closeMenu) closeMenu()
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.stopPropagation()
                                                    navigate(child.address)
                                                    if (closeMenu) closeMenu()
                                                }
                                            }}
                                style={{ textAlign: isEnglish ? 'left' : 'right' }}
                                        >
                                            {isEnglish ? child.title.en : child.title.he}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        }
                    </Fragment>
                )
            })}


            {/* Language selector */}
            <li className={isMobile ? 'mobile-align' : ''} >
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
                        inputProps={{ 'aria-label': isEnglish ? 'Select Language' : 'בחר שפה' }}
                        displayEmpty
                    >
                        <MenuItem sx={{ fontSize: "small" }} value={"en"}>EN</MenuItem>
                        <MenuItem sx={{ fontSize: "small" }} value={"he"}>עב</MenuItem>
                    </Select>
                </FormControl>
            </li>
            {!isMobile &&
                <li>
                    <a href={`https://wa.me/972524000102?text=${encodeURIComponent(
                        isEnglish 
                            ? "Hi, I reached out through Tiran Lasry's website and would like to get more details." 
                            : "היי, הגעתי דרך האתר של טירן לסרי ואשמח לקבל פרטים נוספים."
                       )}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       aria-label={isEnglish ? "Contact on WhatsApp" : "צור קשר בוואטסאפ"}
                       style={{ display: 'flex', color: 'inherit' }}
                    >
                        <Icons iconName="whatsapp" />
                    </a>
                </li>
            }
            {!isMobile && <li 
                role="button" 
                tabIndex={0} 
                aria-label={isEnglish ? "Search" : "חיפוש"} 
                onClick={handleSearch}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSearch?.()}
            >
                <Icons iconName="search" />
            </li>
            }

        </ul >
    )
}