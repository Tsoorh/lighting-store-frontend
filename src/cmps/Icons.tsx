import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SquareFootIcon from '@mui/icons-material/SquareFoot';import LayersIcon from '@mui/icons-material/Layers';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BoltIcon from '@mui/icons-material/Bolt';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';

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
        size: <SquareFootIcon fontSize='small' aria-label='true'/>,
        material: <LayersIcon fontSize='small' aria-label='true'/>,
        bulb: <LightbulbIcon fontSize='small' aria-label='true'/>,
        bolt:<BoltIcon fontSize='small' aria-label='true'/>,
        whatsapp:<WhatsAppIcon aria-label='true'/>,
        left:<KeyboardArrowLeftIcon aria-label='true'/>,
        right:<KeyboardArrowRightIcon aria-label='true'/>,
        search: <SearchIcon aria-label='true'/>
    };

    return icons[key] ?? null;
};