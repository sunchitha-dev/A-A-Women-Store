import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import Home from './pages/Home'
import Stub from './pages/Stub'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Stub title="Shop" />} />
          <Route path="/product/:id" element={<Stub title="Product" />} />
          <Route path="/tailoring" element={<Stub title="Tailoring" />} />
          <Route path="/about" element={<Stub title="About" />} />
          <Route path="/contact" element={<Stub title="Contact" />} />
          <Route path="/cart" element={<Stub title="Cart" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
