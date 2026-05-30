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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

type IconName = string;

type IconsProps = {
    iconName?: IconName;
};

export const Icons = ({ iconName }: IconsProps): JSX.Element | null => {
    const key = (iconName ?? '').toLowerCase();

    const icons: Record<string, JSX.Element> = {
        menu: <MenuIcon aria-hidden="true" style={{'height':'28px','width':'28px'}}/>,
        close: <CloseIcon aria-label="true" />,
        dropdown: <KeyboardArrowDownIcon fontSize="small" aria-hidden="true" />,
        size: <SquareFootIcon fontSize='small' aria-label='true'/>,
        material: <LayersIcon fontSize='small' aria-label='true'/>,
        bulb: <LightbulbIcon fontSize='small' aria-label='true'/>,
        bolt:<BoltIcon fontSize='small' aria-label='true'/>,
        whatsapp:<WhatsAppIcon aria-label='true'/>,
        facebook:<FacebookIcon aria-label='true'/>,
        instagram:<InstagramIcon aria-label='true'/>,
        gmail:<EmailIcon aria-label='true'/>,
        left:<KeyboardArrowLeftIcon aria-label='true'/>,
        right:<KeyboardArrowRightIcon aria-label='true'/>,
        search: <SearchIcon aria-label='true'/>,
        back: <ArrowBackIcon sx={{fontSize:12,fontWeight: 100}} aria-label='true'/>,
        next: <ArrowForwardIcon sx={{fontSize:12,fontWeight: 100}} aria-label='true'/>
    };

    return icons[key] ?? null;
};