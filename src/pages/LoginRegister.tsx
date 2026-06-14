import { useState, type ChangeEvent, type FormEvent } from "react"
import { useLanguage } from "../hooks/useLanguage"
import { authService } from "../services/auth.service"
import '../assets/styles/pages/LoginRegister.css'

export const LoginRegister = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [errorMsg, setErrorMsg] = useState('')
    
    const { language } = useLanguage()
    const isEnglish = language === 'en'

    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = ev.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    const onSubmit = async (ev: FormEvent) => {
        ev.preventDefault()
        setErrorMsg('')
        
        try {
            await authService.login({ username: credentials.username, password: credentials.password })
            window.location.assign('/') // Hard reload to clear query cache
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Auth error:', err.message)
            } else {
                console.error('Auth error:', err)
            }
            setErrorMsg(isEnglish ? 'Authentication failed. Please try again.' : 'שגיאה באימות הנתונים. נסה שוב.')
        }
    }

    return (
        <section className={`auth-page ${isEnglish ? 'ltr' : 'rtl'}`} dir={isEnglish ? 'ltr' : 'rtl'}>
            <div className="auth-page-wrapper theme-dark">
                <div className="auth-layout-grid">
                    
                    <div className="auth-form-container">
                        <div className="auth-box">
                            <h1>{isEnglish ? 'Suppliers Login' : 'התחברות ספקים'}</h1>
                            
                            <form onSubmit={onSubmit} className="auth-form">
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={credentials.username} 
                                    onChange={handleChange} 
                                    placeholder={isEnglish ? 'Username' : 'שם משתמש'} 
                                    required 
                                    className="auth-input"
                                    autoComplete="off"
                                />
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={credentials.password} 
                                    onChange={handleChange} 
                                    placeholder={isEnglish ? 'Password' : 'סיסמה'} 
                                    required 
                                    className="auth-input"
                                    autoComplete="new-password"
                                />
                                
                                {errorMsg && <p className="error-msg">{errorMsg}</p>}
                                
                                <button type="submit" className="submit-btn">
                                    {isEnglish ? 'Submit' : 'המשך'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}