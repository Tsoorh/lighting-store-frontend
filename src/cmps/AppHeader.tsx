import { useNavigate } from "react-router-dom"

export const AppHeader = () => {
    const navigate = useNavigate()
    const navbarProperties = [
        { title: { en: 'Home', he: 'בית' }, address: '/' },
        { title: { en: 'Products', he: 'מוצרים' }, address: '/Product' }
        
    ]


    return (
        <header className="app-header">
            <div className="logo">
                <p>TIRAN LASRY</p>
                <span className="slogen">Lighting Design Studio</span>
            </div>
            <nav className="nav-bar">
                <ul>
                    {navbarProperties.map(property => {
                        return <li onClick={() => navigate(property.address)}>{property.title.en}</li>
                    })}
                    <select>
                        <option value="en">EN</option>
                        <option value="he">HE</option>
                    </select>
                </ul>
            </nav>

        </header>
    )
}