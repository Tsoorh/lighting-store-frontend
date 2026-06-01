import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './assets/styles/main.css'
import { AppFooter } from './cmps/AppFooter'
import { AppHeader } from './cmps/AppHeader'
import { HomePage } from './pages/HomePage'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { ProductDetails } from './cmps/Product/ProductDetails'
import { ProductCategory } from './pages/ProductCategory'
import { TermsOfUse } from './pages/TermsOfUse'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { AccessibilityStatement } from './pages/AccessibilityStatement'
import { LoginRegister } from './pages/LoginRegister'

function App() {

  return (
    <BrowserRouter>
      <div className='home-grid'>
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/product/category/:categoryName" element={<ProductCategory/>} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/accessibility" element={<AccessibilityStatement />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </BrowserRouter>
  )
}

export default App
