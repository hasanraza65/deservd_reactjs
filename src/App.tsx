import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { Layout } from '@/components/layout/Layout'
import { AdminApp } from '@/admin/AdminApp'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import BuildABox from '@/pages/BuildABox'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Account from '@/pages/Account'
import AccountOrders from '@/pages/AccountOrders'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Story from '@/pages/Story'
import Nutrition from '@/pages/Nutrition'
import Faq from '@/pages/Faq'
import Contact from '@/pages/Contact'
import Shipping from '@/pages/Shipping'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import RefundPolicy from '@/pages/RefundPolicy'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="admin/*" element={<AdminApp />} />
              <Route
                path="*"
                element={
                  <CartProvider>
                    <Routes>
                      <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="shop" element={<Shop />} />
                        <Route path="cookies/:slug" element={<ProductDetail />} />
                        <Route path="build-a-box" element={<BuildABox />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="order-confirmation" element={<OrderConfirmation />} />
                        <Route path="account" element={<Account />} />
                        <Route path="account/orders" element={<AccountOrders />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="story" element={<Story />} />
                        <Route path="nutrition" element={<Nutrition />} />
                        <Route path="faq" element={<Faq />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="shipping" element={<Shipping />} />
                        <Route path="privacy" element={<Privacy />} />
                        <Route path="terms" element={<Terms />} />
                        <Route path="refund-policy" element={<RefundPolicy />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </CartProvider>
                }
              />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
