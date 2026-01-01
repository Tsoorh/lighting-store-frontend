import MenuIcon from '@mui/icons-material/Menu';

type propName = {
    iconName: string
}
type IconType = {
    [key: string]: JSX.Element
}

export const Icons = ({ iconName }: propName): JSX.Element | null => {
    const normalize = iconName?.toLowerCase() || ''
    const icons: IconType = {
        menu: <MenuIcon />
    }
    return icons[normalize] || null
}