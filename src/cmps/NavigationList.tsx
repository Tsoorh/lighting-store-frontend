import { FormControl, MenuItem, Select, type SelectChangeEvent } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../hooks/useLanguage"
import type { Language } from "../services/LanguageContext"
import type { NavbarProperties } from "./AppHeader"
import { Icons } from "./Icons"
import { useState } from "react"
import type { SubMenu } from "./AppHeader"

type NavLinks = {
    navLinks: NavbarProperties
}

export const NavigationList = ({ navLinks }: NavLinks) => {
    const [subMenuDetails, setSubMenuDetails] = useState<SubMenu | null>(null)
    const { language, changeLanguage } = useLanguage()
    const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)
    const navigate = useNavigate()



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
    const onHandleClick = (address: string | undefined, subMenu: SubMenu | undefined) => {
        if (!subMenu && address) navigate(address)
        if (subMenu) setSubMenuDetails(subMenu)
    }

    const isEnglish = language === 'en'
    return (
        <ul className="nav-links" style={{ flexDirection: isEnglish ? 'row' : 'row-reverse' }}>
            {navLinks.map(link => {
                return <li
                    onClick={() => onHandleClick(link?.address, link?.subMenu)}
                    onMouseEnter={() => onEnter(link?.subMenu)}
                    onMouseLeave={onLeave}
                    key={link.title.en}>
                    {isEnglish ? link.title.en : link.title.he}
                    {link?.iconName && <Icons iconName={link.iconName} />}
                    {link.subMenu && subMenuDetails &&
                        <div
                            className="sub-menu"
                            onMouseEnter={() => onEnter(link.subMenu)}
                            onMouseLeave={onLeave}
                        >
                            <ul >
                                {subMenuDetails.map(link => {
                                    return (
                                        <li
                                            key={link.title.en}
                                            onClick={() => {
                                                navigate(link.address)
                                                setSubMenuDetails(null)

                                            }} 
                                            style={{ textAlign: isEnglish ? 'start' : 'end' }}
                                        >
                                            {isEnglish ? link.title.en : link.title.he}
                                        </li>)
                                })}
                            </ul>
                        </div>
                    }
                </li>

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
    )
}