// import { useEffect } from "react"
import { Backdrop } from "@mui/material"
// import type { NavbarProperties } from "./AppHeader"
// import { NavigationList } from "./NavigationList"
// import { useLanguage } from "../hooks/useLanguage"
// import { Icons } from "./Icons"

type MenuModalProps = {
    // navLinks: NavbarProperties
    closeMenu: () => void
    children: JSX.Element
}

export const MenuModal = ({ children, closeMenu }: MenuModalProps) => {

    return (
        <Backdrop
            sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            onClick={closeMenu}
        >
            {children}
        </Backdrop>
    )
}