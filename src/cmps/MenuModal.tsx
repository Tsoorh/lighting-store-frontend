// import { useEffect } from "react"
import { Backdrop } from "@mui/material"
import type { NavbarProperties } from "./AppHeader"
import { NavigationList } from "./NavigationList"
import { useLanguage } from "../hooks/useLanguage"
import { Icons } from "./Icons"


type MenuModalProps = {
    navLinks: NavbarProperties
    closeMenu: () => void
}

export const MenuModal = ({ navLinks, closeMenu }: MenuModalProps) => {
    const { language } = useLanguage()

    const isEnglish = language === 'en'
    return (
        // <div className={`menu-modal ${isOpen ? `open-modal` : ``}`}>
        // <div className={`full-screen-bgc`} onClick={onCloseModal}>
        <Backdrop
            sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            onClick={closeMenu}
        >
            <div className="menu-modal" >
                <button className="exit-btn"><Icons iconName={"close"}/></button>
                <h1>{isEnglish ? 'Menu' : 'תפריט'}</h1>
                <NavigationList navLinks={navLinks} />
            </div>
        </Backdrop>
        // </div>
    )
}