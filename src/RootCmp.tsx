import { createRoot } from 'react-dom/client'
// import './main.css'
import App from './App.tsx'
import { LanguageProvider } from './cmps/LanguageProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <LanguageProvider>
    <App />
    </LanguageProvider>
)
