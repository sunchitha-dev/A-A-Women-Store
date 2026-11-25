import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Tailoring from './pages/Tailoring'
import About from './pages/About'
import Stub from './pages/Stub'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Stub title="Product" />} />
          <Route path="/tailoring" element={<Tailoring />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Stub title="Contact" />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
