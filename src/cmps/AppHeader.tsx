import { useNavigate } from "react-router-dom"
import { useLanguage } from "../hooks/useLanguage";
import type { Language } from "../services/LanguageContext";
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { FormControl } from "@mui/material";


export const AppHeader = () => {
    const { language, changeLanguage } = useLanguage()
    const navigate = useNavigate()

    const navbarProperties = [
        { title: { en: 'Lighting', he: 'תאורה' }, address: '/Product' },
        { title: { en: 'Home', he: 'בית' }, address: '/' }
    ]

    const handleChangeLanguage = (event: SelectChangeEvent) => {
        const value = event.target.value as Language;
        changeLanguage(value)
    }

    return (
        <header className="app-header">
            <div className="logo">
                <p>TIRAN LASRY</p>
                <span className="slogen">Lighting Design Studio</span>
            </div>
            <nav className="nav-bar">
                <ul>
                    {navbarProperties.map(property => {
                        return <li onClick={() => navigate(property.address)}>{language==="en"?property.title.en:property.title.he}</li>
                    })}
                    <FormControl sx={{ m: 0, minWidth: 67 }} size="small" >
                        <Select
                            sx={{
                                fontSize:"small",
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
                            <MenuItem sx={{fontSize:"small"}} value={"en"}>EN</MenuItem>
                            <MenuItem sx={{fontSize:"small"}} value={"he"}>HE</MenuItem>
                        </Select>
                    </FormControl>
                    {/* <select onChange={(e)=>handleChangeLanguage(e)} defaultValue={language}>
                    <option value="en">EN</option>
                    <option value="he">HE</option>
                </select> */}
                </ul>
            </nav>

        </header>
    )
}