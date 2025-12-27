import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './assets/styles/main.css'
import { AppFooter } from './cmps/AppFooter'
import { AppHeader } from './cmps/AppHeader'
import { HomePage } from './pages/HomePage'
import { ProductIndex } from './cmps/Product/ProductIndex'
import { ProductDetails } from './cmps/Product/ProductDetails'

function App() {

  return (
    <BrowserRouter>
      <div className='home-grid'>
        <AppHeader />
        <main>
          <Routes>
            <Route path="" element={<HomePage />} />
            <Route path="/product" element={<ProductIndex />} />
            <Route path="/product/productId" element={<ProductDetails />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </BrowserRouter>
  )
}

export default App
