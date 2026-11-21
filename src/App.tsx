import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './assets/styles/main.css'
import { AppFooter } from './cmps/AppFooter'
import { AppHeader } from './cmps/AppHeader'
import { HomePage } from './pages/HomePage'
import { About } from './pages/About'
import { Gallery } from './pages/Gallery'
import { Contact } from './pages/Contact'
import { ProductDetails } from './cmps/Product/ProductDetails'
import { ProductCategory } from './pages/ProductCategory'
import { TermsOfUse } from './pages/TermsOfUse'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { AccessibilityStatement } from './pages/AccessibilityStatement'
import { LoginRegister } from './pages/LoginRegister'
import { AdminPage } from './pages/AdminPage'
import { PreviewHomePage } from './pages/PreviewHomePage'
import { CartPage } from './pages/CartPage'
import { FloatingWhatsApp } from './cmps/FloatingWhatsApp'
import { CartProvider } from './context/CartContext'
import { CartDrawer } from './cmps/Cart/CartDrawer'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const ProductDetailsWrapper = () => {
  const { productId } = useParams()
  return <ProductDetails key={productId} />
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/preview-homepage" element={<PreviewHomePage />} />
            <Route path="*" element={
              <div className='home-grid'>
                <AppHeader />
                <CartDrawer />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginRegister />} />
                    <Route path="/dashboard" element={<AdminPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/product/:productId" element={<ProductDetailsWrapper />} />
                    <Route path="/product/category/:categoryName" element={<ProductCategory/>} />
                    <Route path="/terms" element={<TermsOfUse />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/accessibility" element={<AccessibilityStatement />} />
                  </Routes>
                </main>
                <AppFooter />
                <FloatingWhatsApp />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  )
}

export default App
