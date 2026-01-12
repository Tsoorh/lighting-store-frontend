import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './assets/styles/main.css'
import { AppFooter } from './cmps/AppFooter'
import { AppHeader } from './cmps/AppHeader'
import { HomePage } from './pages/HomePage'
import { ProductDetails } from './cmps/Product/ProductDetails'
import { ProductCategory } from './pages/ProductCategory'

function App() {

  return (
    <BrowserRouter>
      <div className='home-grid'>
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/contact" element={<Contact />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/product/category/:categoryName" element={<ProductCategory/>} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </BrowserRouter>
  )
}

export default App
