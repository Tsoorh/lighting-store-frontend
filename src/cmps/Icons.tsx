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
        close: <CloseIcon aria-hidden="true" />,
        dropdown: <KeyboardArrowDownIcon fontSize="small" aria-hidden="true" />,
        size: <SquareFootIcon fontSize='small' aria-hidden='true'/>,
        material: <LayersIcon fontSize='small' aria-hidden='true'/>,
        bulb: <LightbulbIcon fontSize='small' aria-hidden='true'/>,
        bolt:<BoltIcon fontSize='small' aria-hidden='true'/>,
        whatsapp:<WhatsAppIcon aria-hidden='true'/>,
        facebook:<FacebookIcon aria-hidden='true'/>,
        instagram:<InstagramIcon aria-hidden='true'/>,
        gmail:<EmailIcon aria-hidden='true'/>,
        left:<KeyboardArrowLeftIcon aria-hidden='true'/>,
        right:<KeyboardArrowRightIcon aria-hidden='true'/>,
        search: <SearchIcon aria-hidden='true'/>,
        back: <ArrowBackIcon sx={{fontSize:12,fontWeight: 100}} aria-hidden='true'/>,
        next: <ArrowForwardIcon sx={{fontSize:12,fontWeight: 100}} aria-hidden='true'/>
    };

    return icons[key] ?? null;
};