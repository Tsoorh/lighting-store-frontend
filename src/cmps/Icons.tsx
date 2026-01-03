import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type IconName = string;

type IconsProps = {
    iconName?: IconName;
};

export const Icons = ({ iconName }: IconsProps): JSX.Element | null => {
    const key = (iconName ?? '').toLowerCase();

    const icons: Record<string, JSX.Element> = {
        menu: <MenuIcon aria-hidden="true" />,
        close: <CloseIcon aria-label="true" />,
        dropdown: <KeyboardArrowDownIcon fontSize="small" aria-hidden="true" />,
    };

    return icons[key] ?? null;
};